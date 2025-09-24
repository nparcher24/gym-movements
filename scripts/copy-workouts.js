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

function transformTimestamps(obj) {
  // Handle null or undefined
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Check if it's a Firebase Timestamp
  if (obj && typeof obj.toMillis === "function") {
    // Convert Firebase Timestamp to milliseconds since epoch
    return obj.toMillis();
  }

  // Handle arrays recursively
  if (Array.isArray(obj)) {
    return obj.map(transformTimestamps);
  }

  // Handle nested objects recursively
  if (obj && typeof obj === "object" && obj.constructor === Object) {
    const transformed = {};
    for (const [key, value] of Object.entries(obj)) {
      transformed[key] = transformTimestamps(value);
    }
    return transformed;
  }

  // Return primitive values unchanged
  return obj;
}

async function copyCollection(sourceCollectionName, targetCollectionName) {
  console.log(
    `Starting copy of 50 latest workouts from '${sourceCollectionName}' to '${targetCollectionName}'...`,
  );

  try {
    const sourceCollection = db.collection(sourceCollectionName);
    // Get only the 50 latest workouts ordered by dateMade descending
    const snapshot = await sourceCollection
      .orderBy("dateMade", "desc")
      .limit(50)
      .get();

    if (snapshot.empty) {
      console.log(`Source collection '${sourceCollectionName}' is empty`);
      return;
    }

    console.log(
      `Found ${snapshot.size} latest documents in '${sourceCollectionName}'`,
    );

    let totalCopied = 0;

    // Process documents in batches to avoid memory issues
    const batchSize = 100;
    const docs = snapshot.docs;

    for (let i = 0; i < docs.length; i += batchSize) {
      const batch = docs.slice(i, i + batchSize);
      const promises = batch.map(async (doc) => {
        await copyDocument(doc, sourceCollectionName, targetCollectionName);
        totalCopied++;
        if (totalCopied % 10 === 0) {
          console.log(`Copied ${totalCopied}/${docs.length} documents...`);
        }
      });

      await Promise.all(promises);
    }

    console.log(
      `✅ Successfully copied ${totalCopied} documents from '${sourceCollectionName}' to '${targetCollectionName}'`,
    );
  } catch (error) {
    console.error("❌ Error copying collection:", error);
    throw error;
  }
}

async function copyDocument(
  sourceDoc,
  sourceCollectionName,
  targetCollectionName,
) {
  try {
    const data = sourceDoc.data();
    const targetDocRef = db.collection(targetCollectionName).doc(sourceDoc.id);

    // Transform Firebase Timestamps to milliseconds before copying
    const transformedData = transformTimestamps(data);

    // Copy the main document with transformed data
    await targetDocRef.set(transformedData);

    // Copy all subcollections
    const subcollections = await sourceDoc.ref.listCollections();

    for (const subcollection of subcollections) {
      await copySubcollection(
        subcollection,
        targetDocRef.collection(subcollection.id),
      );
    }
  } catch (error) {
    console.error(`Error copying document ${sourceDoc.id}:`, error);
    throw error;
  }
}

async function copySubcollection(sourceSubcollection, targetSubcollectionRef) {
  try {
    const snapshot = await sourceSubcollection.get();

    if (snapshot.empty) {
      return;
    }

    console.log(
      `  Copying subcollection '${sourceSubcollection.id}' with ${snapshot.size} documents...`,
    );

    const batch = db.batch();
    let batchCount = 0;
    const batchLimit = 500; // Firestore batch write limit

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const targetDocRef = targetSubcollectionRef.doc(doc.id);

      // Transform timestamps in subcollection documents too
      const transformedData = transformTimestamps(data);
      batch.set(targetDocRef, transformedData);
      batchCount++;

      // Commit batch when we hit the limit
      if (batchCount === batchLimit) {
        await batch.commit();
        console.log(
          `    Committed batch of ${batchCount} subcollection documents`,
        );
        batchCount = 0;
      }

      // Recursively handle nested subcollections
      const nestedSubcollections = await doc.ref.listCollections();
      for (const nestedSubcollection of nestedSubcollections) {
        await copySubcollection(
          nestedSubcollection,
          targetDocRef.collection(nestedSubcollection.id),
        );
      }
    }

    // Commit any remaining documents
    if (batchCount > 0) {
      await batch.commit();
      console.log(
        `    Committed final batch of ${batchCount} subcollection documents`,
      );
    }
  } catch (error) {
    console.error(
      `Error copying subcollection ${sourceSubcollection.id}:`,
      error,
    );
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting workouts collection copy process...\n");

  try {
    // Check if target collection already exists
    const targetCollection = db.collection("app-workouts");
    const targetSnapshot = await targetCollection.limit(1).get();

    if (!targetSnapshot.empty) {
      console.warn('⚠️  Target collection "app-workouts" already has data.');
      console.log(
        "This script will merge with existing data (documents with same IDs will be overwritten).\n",
      );
    }

    await copyCollection("workouts", "app-workouts");

    console.log("\n🎉 Copy process completed successfully!");
    console.log('Your workouts collection has been copied to "app-workouts"');
    console.log(
      "✨ All Firebase Timestamps have been converted to milliseconds since epoch",
    );
  } catch (error) {
    console.error("\n❌ Copy process failed:", error);
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
