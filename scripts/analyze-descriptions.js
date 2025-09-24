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

function extractOptionsFromDescription(description) {
  const options = [];

  if (!description || typeof description !== "string") {
    return options;
  }

  // Common patterns for workout options in descriptions
  // Look for patterns like:
  // - "Choose: A) Option1 B) Option2 C) Option3"
  // - "Options: 1. Option1 2. Option2"
  // - "A) Option1 B) Option2"
  // - "1. Option1 2. Option2"
  // - "Option 1: ... Option 2: ..."
  // - Lines that start with letters or numbers followed by ) or .

  const patterns = [
    // Pattern: A) something B) something C) something
    /[A-Z]\)\s*([^A-Z\n]+?)(?=[A-Z]\)|$)/g,
    // Pattern: 1) something 2) something 3) something
    /\d+\)\s*([^\d\n]+?)(?=\d+\)|$)/g,
    // Pattern: A. something B. something C. something
    /[A-Z]\.\s*([^A-Z\n]+?)(?=[A-Z]\.|$)/g,
    // Pattern: 1. something 2. something 3. something
    /\d+\.\s*([^\d\n]+?)(?=\d+\.|$)/g,
    // Pattern: Option 1: something Option 2: something
    /Option\s+\d+:\s*([^O\n]+?)(?=Option\s+\d+:|$)/gi,
  ];

  patterns.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(description)) !== null) {
      const option = match[1].trim();
      if (option && option.length > 0) {
        options.push(option);
      }
    }
  });

  // Also look for bullet points or dashes
  const bulletPattern = /[-•*]\s*([^\n-•*]+)/g;
  let bulletMatch;
  while ((bulletMatch = bulletPattern.exec(description)) !== null) {
    const option = bulletMatch[1].trim();
    if (option && option.length > 0) {
      options.push(option);
    }
  }

  return options;
}

async function analyzeWorkoutDescriptions(collectionName = "workouts") {
  console.log(
    `🔍 Analyzing workout descriptions in '${collectionName}' collection...`,
  );

  try {
    const workoutsRef = db.collection(collectionName);
    const snapshot = await workoutsRef.get();

    if (snapshot.empty) {
      console.log(`No documents found in '${collectionName}' collection`);
      return;
    }

    console.log(`Found ${snapshot.size} workout documents`);

    const optionCounts = new Map();
    const descriptionsWithOptions = [];
    const sampleDescriptions = [];
    let totalDocuments = 0;
    let documentsWithDescriptions = 0;
    let documentsWithOptions = 0;

    snapshot.forEach((doc) => {
      totalDocuments++;
      const data = doc.data();

      if (data.description) {
        documentsWithDescriptions++;

        // Collect sample descriptions for analysis
        if (sampleDescriptions.length < 10) {
          sampleDescriptions.push({
            id: doc.id,
            title: data.title || data.name || "Untitled",
            description: data.description,
          });
        }

        const options = extractOptionsFromDescription(data.description);

        if (options.length > 0) {
          documentsWithOptions++;
          descriptionsWithOptions.push({
            id: doc.id,
            title: data.title || data.name || "Untitled",
            description: data.description,
            options: options,
          });

          // Count each option
          options.forEach((option) => {
            const normalizedOption = option.toLowerCase().trim();
            const count = optionCounts.get(normalizedOption) || 0;
            optionCounts.set(normalizedOption, count + 1);
          });
        }
      }
    });

    // Sort options by usage count (descending)
    const sortedOptions = Array.from(optionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([option, count]) => ({ option, count }));

    // Display results
    console.log("\n📊 ANALYSIS RESULTS");
    console.log("==================");
    console.log(`Total workout documents: ${totalDocuments}`);
    console.log(`Documents with descriptions: ${documentsWithDescriptions}`);
    console.log(
      `Documents with options in descriptions: ${documentsWithOptions}`,
    );
    console.log(`Unique options found: ${sortedOptions.length}`);

    // Show sample descriptions to understand the format
    console.log("\n📄 SAMPLE DESCRIPTIONS:");
    console.log("=======================");
    sampleDescriptions.forEach((sample, index) => {
      console.log(`\n${index + 1}. ${sample.title} (${sample.id})`);
      console.log(`Description: ${sample.description}`);
      console.log("---");
    });

    if (sortedOptions.length > 0) {
      console.log("\n🏆 TOP OPTIONS BY USAGE COUNT:");
      console.log("==============================");

      // Show top 20 most common options
      const topOptions = sortedOptions.slice(0, 20);
      topOptions.forEach((item, index) => {
        console.log(`${index + 1}. [${item.count}x] ${item.option}`);
      });

      if (sortedOptions.length > 20) {
        console.log(`\n... and ${sortedOptions.length - 20} more options`);
      }

      // Show some example workouts with options
      console.log("\n📝 EXAMPLE WORKOUTS WITH OPTIONS:");
      console.log("=================================");
      const examples = descriptionsWithOptions.slice(0, 3);
      examples.forEach((workout, index) => {
        console.log(`\n${index + 1}. ${workout.title} (${workout.id})`);
        console.log(`   Options found: ${workout.options.length}`);
        workout.options.forEach((option, optIndex) => {
          console.log(`   ${String.fromCharCode(65 + optIndex)}) ${option}`);
        });
        console.log(
          `   Description snippet: ${workout.description.substring(0, 100)}...`,
        );
      });

      // Save detailed results to JSON file for further analysis
      const results = {
        summary: {
          totalDocuments,
          documentsWithDescriptions,
          documentsWithOptions,
          uniqueOptions: sortedOptions.length,
        },
        optionsByCount: sortedOptions,
        exampleWorkouts: descriptionsWithOptions.slice(0, 10),
      };

      console.log("\n💾 DETAILED RESULTS:");
      console.log("===================");
      console.log("Full results object:");
      console.log(JSON.stringify(results, null, 2));
    }
  } catch (error) {
    console.error("❌ Error analyzing descriptions:", error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Starting workout description analysis...\n");

  try {
    await analyzeWorkoutDescriptions("workouts");

    console.log("\n🎉 Analysis completed successfully!");
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
