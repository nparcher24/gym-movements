const admin = require("firebase-admin");

// Initialize Firebase Admin SDK using Application Default Credentials
// This will use your existing Firebase CLI login session
try {
  admin.initializeApp({
    projectId: "leaderboard-d5992",
  });
  console.log("✅ Firebase Admin SDK initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
  console.log("\n💡 Make sure you are logged in to Firebase CLI:");
  console.log("   firebase login");
  process.exit(1);
}

const auth = admin.auth();
const db = admin.firestore();

async function fetchAllUsers() {
  console.log("🔍 Fetching all Firebase Auth users...\n");

  try {
    let allUsers = [];
    let nextPageToken;
    let totalUsers = 0;

    do {
      // List users in batches of 1000 (max per request)
      const listUsersResult = await auth.listUsers(1000, nextPageToken);

      allUsers = allUsers.concat(listUsersResult.users);
      totalUsers += listUsersResult.users.length;

      console.log(`Fetched ${totalUsers} users so far...`);

      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    console.log(`\n✅ Successfully fetched ${totalUsers} total users\n`);

    return allUsers;
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    throw error;
  }
}

function formatDate(dateString) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function displayUsersTable(users) {
  console.log("📊 USER INFORMATION TABLE");
  console.log("=".repeat(120));

  // Table header
  const header = [
    "UID".padEnd(28),
    "Email".padEnd(30),
    "Display Name".padEnd(20),
    "Verified".padEnd(8),
    "Disabled".padEnd(8),
    "Created".padEnd(18),
    "Last Sign In".padEnd(18),
  ].join(" | ");

  console.log(header);
  console.log("-".repeat(120));

  // Table rows
  users.forEach((user, index) => {
    const row = [
      (user.uid || "N/A").substring(0, 27).padEnd(28),
      (user.email || "N/A").substring(0, 29).padEnd(30),
      (user.displayName || "N/A").substring(0, 19).padEnd(20),
      (user.emailVerified ? "Yes" : "No").padEnd(8),
      (user.disabled ? "Yes" : "No").padEnd(8),
      formatDate(user.metadata?.creationTime).substring(0, 17).padEnd(18),
      formatDate(user.metadata?.lastSignInTime).substring(0, 17).padEnd(18),
    ].join(" | ");

    console.log(row);
  });

  console.log("-".repeat(120));
  console.log(`Total Users: ${users.length}`);
}

function displayDetailedStats(users) {
  console.log("\n📈 DETAILED USER STATISTICS");
  console.log("=".repeat(50));

  const stats = {
    total: users.length,
    verified: users.filter((u) => u.emailVerified).length,
    unverified: users.filter((u) => !u.emailVerified).length,
    disabled: users.filter((u) => u.disabled).length,
    withDisplayName: users.filter((u) => u.displayName).length,
    withoutDisplayName: users.filter((u) => !u.displayName).length,
    signedInLast30Days: 0,
    signedInLast7Days: 0,
    neverSignedIn: users.filter((u) => !u.metadata?.lastSignInTime).length,
  };

  // Calculate recent sign-ins
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  users.forEach((user) => {
    if (user.metadata?.lastSignInTime) {
      const lastSignIn = new Date(user.metadata.lastSignInTime);
      if (lastSignIn > thirtyDaysAgo) {
        stats.signedInLast30Days++;
      }
      if (lastSignIn > sevenDaysAgo) {
        stats.signedInLast7Days++;
      }
    }
  });

  console.log(`Total Users:              ${stats.total}`);
  console.log(
    `Email Verified:           ${stats.verified} (${((stats.verified / stats.total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `Email Unverified:         ${stats.unverified} (${((stats.unverified / stats.total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `Disabled:                 ${stats.disabled} (${((stats.disabled / stats.total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `With Display Name:        ${stats.withDisplayName} (${((stats.withDisplayName / stats.total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `Without Display Name:     ${stats.withoutDisplayName} (${((stats.withoutDisplayName / stats.total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `Signed in last 7 days:   ${stats.signedInLast7Days} (${((stats.signedInLast7Days / stats.total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `Signed in last 30 days:  ${stats.signedInLast30Days} (${((stats.signedInLast30Days / stats.total) * 100).toFixed(1)}%)`,
  );
  console.log(
    `Never signed in:          ${stats.neverSignedIn} (${((stats.neverSignedIn / stats.total) * 100).toFixed(1)}%)`,
  );
}

function displayProviderInfo(users) {
  console.log("\n🔐 AUTHENTICATION PROVIDERS");
  console.log("=".repeat(50));

  const providers = {};

  users.forEach((user) => {
    user.providerData?.forEach((provider) => {
      if (!providers[provider.providerId]) {
        providers[provider.providerId] = 0;
      }
      providers[provider.providerId]++;
    });

    // Count users with no provider data
    if (!user.providerData || user.providerData.length === 0) {
      if (!providers["no-provider"]) {
        providers["no-provider"] = 0;
      }
      providers["no-provider"]++;
    }
  });

  Object.entries(providers).forEach(([providerId, count]) => {
    const percentage = ((count / users.length) * 100).toFixed(1);
    console.log(`${providerId.padEnd(20)}: ${count} users (${percentage}%)`);
  });
}

async function createFirestoreUsers(users) {
  console.log("\n💾 CREATING FIRESTORE USER DOCUMENTS");
  console.log("=".repeat(50));

  try {
    const usersCollection = db.collection("users");
    let totalCreated = 0;
    let totalUpdated = 0;
    let totalErrors = 0;

    // Process users in batches to avoid overwhelming Firestore
    const batchSize = 50;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);

      const promises = batch.map(async (user) => {
        try {
          const userDoc = {
            id: user.uid,
            displayName: user.displayName || "",
            email: user.email || "",
          };

          // Check if document already exists
          const existingDoc = await usersCollection.doc(user.uid).get();

          if (existingDoc.exists) {
            // Update existing document
            await usersCollection.doc(user.uid).set(userDoc, { merge: true });
            totalUpdated++;
            console.log(`Updated: ${user.email || user.uid.substring(0, 8)}`);
          } else {
            // Create new document
            await usersCollection.doc(user.uid).set(userDoc);
            totalCreated++;
            console.log(`Created: ${user.email || user.uid.substring(0, 8)}`);
          }
        } catch (error) {
          console.error(`Error processing user ${user.uid}:`, error.message);
          totalErrors++;
        }
      });

      await Promise.all(promises);
      console.log(
        `Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(users.length / batchSize)}`,
      );
    }

    console.log(`\n✅ Firestore user creation completed:`);
    console.log(`   📝 Created: ${totalCreated} new documents`);
    console.log(`   🔄 Updated: ${totalUpdated} existing documents`);
    console.log(`   ❌ Errors: ${totalErrors} failed operations`);
    console.log(
      `   📊 Total processed: ${totalCreated + totalUpdated + totalErrors}/${users.length}`,
    );
  } catch (error) {
    console.error("❌ Error creating Firestore user documents:", error);
    throw error;
  }
}

async function main() {
  console.log(
    "🚀 Starting Firebase Auth user fetch and Firestore sync process...\n",
  );

  try {
    const users = await fetchAllUsers();

    if (users.length === 0) {
      console.log("No users found in Firebase Auth.");
      return;
    }

    displayUsersTable(users);
    displayDetailedStats(users);
    displayProviderInfo(users);

    // Create/update Firestore user documents
    await createFirestoreUsers(users);

    console.log(
      "\n🎉 User fetch and Firestore sync process completed successfully!",
    );
  } catch (error) {
    console.error("\n❌ User fetch and sync process failed:", error);
    process.exit(1);
  } finally {
    // Cleanup
    await admin.app().delete();
  }
}

// Run the script
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
