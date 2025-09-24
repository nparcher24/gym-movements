const admin = require("firebase-admin");

// Initialize Firebase Admin SDK using Application Default Credentials
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

function normalizeWorkoutType(description) {
  if (!description || typeof description !== "string") {
    return "Unknown";
  }

  const normalized = description.toLowerCase().trim();

  // Define categories and their variations
  const categories = {
    "Stamina": [
      "stamina",
      "stamina day",
      "cardio",
      "endurance",
      "conditioning"
    ],
    "Strength": [
      "strength",
      "strength day",
      "power",
      "lifting",
      "weights"
    ],
    "Stamina & Strength": [
      "stamina & strength",
      "stamina and strength",
      "strength & stamina",
      "strength and stamina",
      "combined",
      "hybrid"
    ],
    "Recovery": [
      "recovery",
      "rest",
      "active recovery",
      "mobility",
      "stretch",
      "yoga"
    ],
    "HIIT": [
      "hiit",
      "high intensity",
      "interval",
      "tabata",
      "circuit"
    ],
    "Functional": [
      "functional",
      "movement",
      "athletic",
      "sport specific"
    ]
  };

  // Find matching category
  for (const [category, variations] of Object.entries(categories)) {
    if (variations.some(variation => normalized.includes(variation))) {
      return category;
    }
  }

  // Return the original if no category matches
  return description.trim();
}

async function analyzeWorkoutTypes(collectionName = "workouts") {
  console.log(`🔍 Analyzing workout types in '${collectionName}' collection...`);

  try {
    const workoutsRef = db.collection(collectionName);
    const snapshot = await workoutsRef.get();

    if (snapshot.empty) {
      console.log(`No documents found in '${collectionName}' collection`);
      return;
    }

    console.log(`Found ${snapshot.size} workout documents`);

    const typeCounts = new Map();
    const originalDescriptions = new Map();
    const workoutsByType = new Map();
    let totalDocuments = 0;
    let documentsWithDescriptions = 0;

    snapshot.forEach((doc) => {
      totalDocuments++;
      const data = doc.data();

      let workoutType = "No Description";
      if (data.description) {
        documentsWithDescriptions++;
        workoutType = normalizeWorkoutType(data.description);

        // Track original descriptions for each type
        if (!originalDescriptions.has(workoutType)) {
          originalDescriptions.set(workoutType, new Set());
        }
        originalDescriptions.get(workoutType).add(data.description);
      }

      // Count workout types
      const count = typeCounts.get(workoutType) || 0;
      typeCounts.set(workoutType, count + 1);

      // Store examples of each type
      if (!workoutsByType.has(workoutType)) {
        workoutsByType.set(workoutType, []);
      }
      if (workoutsByType.get(workoutType).length < 5) {
        workoutsByType.get(workoutType).push({
          id: doc.id,
          title: data.title || data.name || "Untitled",
          description: data.description || "No description",
          date: data.date || data.createdAt || "No date"
        });
      }
    });

    // Sort workout types by count (descending)
    const sortedTypes = Array.from(typeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({
        type,
        count,
        percentage: ((count / totalDocuments) * 100).toFixed(1)
      }));

    // Display results
    console.log("\n📊 WORKOUT TYPE ANALYSIS");
    console.log("========================");
    console.log(`Total workout documents: ${totalDocuments}`);
    console.log(`Documents with descriptions: ${documentsWithDescriptions}`);
    console.log(`Documents without descriptions: ${totalDocuments - documentsWithDescriptions}`);
    console.log(`Unique workout types identified: ${sortedTypes.length}`);

    console.log("\n🏆 WORKOUT TYPES BY FREQUENCY:");
    console.log("===============================");
    sortedTypes.forEach((item, index) => {
      console.log(`${index + 1}. ${item.type}: ${item.count} workouts (${item.percentage}%)`);
    });

    // Show original description variations for each type
    console.log("\n📝 ORIGINAL DESCRIPTION VARIATIONS:");
    console.log("===================================");
    sortedTypes.forEach((item) => {
      const originals = originalDescriptions.get(item.type);
      if (originals && originals.size > 0) {
        console.log(`\n${item.type} (${item.count} workouts):`);
        Array.from(originals).forEach(desc => {
          console.log(`  • "${desc}"`);
        });
      }
    });

    // Show examples of each workout type
    console.log("\n🔍 EXAMPLE WORKOUTS BY TYPE:");
    console.log("============================");
    sortedTypes.slice(0, 5).forEach((item) => {
      const examples = workoutsByType.get(item.type) || [];
      console.log(`\n${item.type} (${item.count} total):`);
      examples.forEach((workout, index) => {
        console.log(`  ${index + 1}. ${workout.title} (${workout.id})`);
        console.log(`     Description: "${workout.description}"`);
      });
    });

    // Generate summary statistics
    const stats = {
      totalWorkouts: totalDocuments,
      workoutsWithDescriptions: documentsWithDescriptions,
      workoutsWithoutDescriptions: totalDocuments - documentsWithDescriptions,
      uniqueTypes: sortedTypes.length,
      typeDistribution: sortedTypes,
      topTypes: sortedTypes.slice(0, 5),
      examples: Object.fromEntries(
        Array.from(workoutsByType.entries()).slice(0, 10)
      )
    };

    console.log("\n💾 SUMMARY STATISTICS:");
    console.log("======================");
    console.log("Distribution breakdown:");
    stats.topTypes.forEach(type => {
      const bar = "█".repeat(Math.round(type.count / 50));
      console.log(`${type.type.padEnd(20)} │${bar} ${type.count} (${type.percentage}%)`);
    });

    return stats;

  } catch (error) {
    console.error("❌ Error analyzing workout types:", error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting workout type analysis...\n");

  try {
    const stats = await analyzeWorkoutTypes("workouts");

    console.log("\n🎉 Analysis completed successfully!");
    console.log("\n📈 KEY INSIGHTS:");
    console.log("================");

    if (stats) {
      console.log(`• Most common workout type: ${stats.topTypes[0]?.type} (${stats.topTypes[0]?.count} workouts)`);
      console.log(`• Workout variety: ${stats.uniqueTypes} different types identified`);
      console.log(`• Documentation rate: ${((stats.workoutsWithDescriptions / stats.totalWorkouts) * 100).toFixed(1)}% of workouts have descriptions`);

      // Calculate balance
      const stamina = stats.topTypes.find(t => t.type.includes("Stamina") && !t.type.includes("&"));
      const strength = stats.topTypes.find(t => t.type.includes("Strength") && !t.type.includes("&"));

      if (stamina && strength) {
        const ratio = (stamina.count / strength.count).toFixed(2);
        console.log(`• Training balance: ${ratio}:1 ratio of Stamina to Strength workouts`);
      }
    }

  } catch (error) {
    console.error("\n❌ Analysis failed:", error);
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
