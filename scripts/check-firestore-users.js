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

const db = admin.firestore();

async function checkFirestoreUsers() {
  console.log("🔍 Checking Firestore users collection...\n");

  try {
    const usersCollection = db.collection("users");
    const snapshot = await usersCollection.get();

    if (snapshot.empty) {
      console.log("📭 The users collection is empty");
      return [];
    }

    console.log(`📊 Found ${snapshot.size} documents in users collection\n`);

    const users = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      users.push({
        docId: doc.id,
        ...data,
      });
    });

    return users;
  } catch (error) {
    console.error("❌ Error checking Firestore users collection:", error);
    throw error;
  }
}

function displayFirestoreUsers(users) {
  if (users.length === 0) {
    console.log("No users to display.");
    return;
  }

  console.log("📋 FIRESTORE USERS TABLE");
  console.log("=".repeat(100));

  // Table header
  const header = [
    "Document ID".padEnd(30),
    "ID Field".padEnd(30),
    "Email".padEnd(30),
    "Display Name".padEnd(20),
  ].join(" | ");

  console.log(header);
  console.log("-".repeat(100));

  // Table rows
  users.forEach((user) => {
    const row = [
      (user.docId || "N/A").substring(0, 29).padEnd(30),
      (user.id || "N/A").substring(0, 29).padEnd(30),
      (user.email || "N/A").substring(0, 29).padEnd(30),
      (user.displayName || "N/A").substring(0, 19).padEnd(20),
    ].join(" | ");

    console.log(row);
  });

  console.log("-".repeat(100));
  console.log(`Total Documents: ${users.length}`);
}

async function main() {
  console.log("🚀 Starting Firestore users collection check...\n");

  try {
    const users = await checkFirestoreUsers();
    displayFirestoreUsers(users);

    console.log("\n🎉 Firestore users check completed successfully!");
  } catch (error) {
    console.error("\n❌ Firestore users check failed:", error);
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
