/**
 * Test Application Submission Endpoint
 *
 * Usage: node scripts/test-submission.js
 *
 * Make sure the dev server is running:
 * npm run dev
 */

const API_URL = "http://localhost:3000/api/v1/applications";

// Sample application data
const testApplication = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@example.com",
  phone: "+14155552671",
  dateOfBirth: "1992-08-15",
  nationality: "United States",
  currentLocation: "San Francisco, CA",
  desiredCountry: "Germany",
  desiredPosition: "Senior Software Engineer",
  yearsExperience: 7,
  currentSalary: 120000,
  expectedSalary: 140000,
  educationLevel: "MASTER",
  resumeUrl: "https://example.com/sarah-resume.pdf",
  coverLetterUrl: "https://example.com/sarah-cover.pdf",
  portfolioUrl: "https://sarahjohnson.dev",
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "PostgreSQL",
    "Docker",
    "AWS",
  ],
  languages: [
    { language: "English", proficiency: "NATIVE" },
    { language: "German", proficiency: "INTERMEDIATE" },
    { language: "Spanish", proficiency: "BASIC" },
  ],
  notes:
    "Passionate about building scalable web applications. Looking to relocate to Berlin for new opportunities in the European tech scene.",
};

// Alternative test data with minimal fields
const minimalApplication = {
  firstName: "Mike",
  lastName: "Chen",
  email: "mike.chen@example.com",
  phone: "+16505551234",
  dateOfBirth: "1988-03-22",
  nationality: "Canada",
  currentLocation: "Vancouver, BC",
  desiredCountry: "Japan",
  desiredPosition: "Frontend Developer",
  yearsExperience: 4,
  expectedSalary: 85000,
  educationLevel: "BACHELOR",
  resumeUrl: "https://example.com/mike-resume.pdf",
  skills: ["Vue.js", "Nuxt.js", "Tailwind CSS"],
  languages: [
    { language: "English", proficiency: "NATIVE" },
    { language: "Mandarin", proficiency: "ADVANCED" },
  ],
};

async function testSubmission(data, testName) {
  console.log(`\n🧪 Testing: ${testName}`);
  console.log("━".repeat(60));

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ SUCCESS");
      console.log("Status:", response.status);
      console.log("Response:", JSON.stringify(result, null, 2));
      return true;
    } else {
      console.log("❌ FAILED");
      console.log("Status:", response.status);
      console.log("Error:", JSON.stringify(result, null, 2));
      return false;
    }
  } catch (error) {
    console.log("❌ REQUEST FAILED");
    console.log("Error:", error.message);

    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Tip: Make sure the dev server is running:");
      console.log("   npm run dev");
    }

    return false;
  }
}

async function testInvalidData() {
  console.log("\n🧪 Testing: Invalid Data (should fail)");
  console.log("━".repeat(60));

  const invalidData = {
    firstName: "A", // Too short
    lastName: "B", // Too short
    email: "not-an-email", // Invalid email
    // Missing required fields
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invalidData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.log("✅ CORRECTLY REJECTED");
      console.log("Status:", response.status);
      console.log("Validation errors:", JSON.stringify(result, null, 2));
      return true;
    } else {
      console.log("❌ SHOULD HAVE FAILED");
      console.log("Invalid data was accepted!");
      return false;
    }
  } catch (error) {
    console.log("❌ REQUEST FAILED");
    console.log("Error:", error.message);
    return false;
  }
}

async function testRateLimit() {
  console.log("\n🧪 Testing: Rate Limiting");
  console.log("━".repeat(60));
  console.log("Sending 6 requests quickly (limit is 5)...\n");

  let successCount = 0;
  let rateLimitedCount = 0;

  for (let i = 1; i <= 6; i++) {
    console.log(`Request ${i}/6...`);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...minimalApplication,
        email: `test-${i}-${Date.now()}@example.com`,
      }),
    });

    if (response.ok) {
      successCount++;
      console.log("  ✅ Accepted");
    } else if (response.status === 429) {
      rateLimitedCount++;
      console.log("  🚫 Rate limited");
    } else {
      console.log("  ❌ Other error:", response.status);
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`  Successful: ${successCount}`);
  console.log(`  Rate limited: ${rateLimitedCount}`);

  if (rateLimitedCount > 0) {
    console.log("  ✅ Rate limiting is working!");
    return true;
  } else {
    console.log("  ⚠️  No requests were rate limited");
    return false;
  }
}

async function runAllTests() {
  console.log("\n🚀 Application Submission Endpoint Tests");
  console.log("═".repeat(60));
  console.log(`API: ${API_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);

  const results = {
    fullApplication: await testSubmission(testApplication, "Full Application"),
    minimalApplication: await testSubmission(
      minimalApplication,
      "Minimal Application"
    ),
    invalidData: await testInvalidData(),
    // Uncomment to test rate limiting (will submit 6 applications)
    // rateLimit: await testRateLimit(),
  };

  console.log("\n📊 Test Summary");
  console.log("═".repeat(60));

  let passed = 0;
  let total = 0;

  Object.entries(results).forEach(([test, result]) => {
    total++;
    if (result) passed++;
    console.log(`${result ? "✅" : "❌"} ${test}`);
  });

  console.log("\n" + "═".repeat(60));
  console.log(`${passed}/${total} tests passed`);
  console.log("═".repeat(60));

  if (passed === total) {
    console.log("\n🎉 All tests passed! The endpoint is working correctly.\n");
  } else {
    console.log(
      "\n⚠️  Some tests failed. Check the output above for details.\n"
    );
  }
}

// Run tests
runAllTests().catch((error) => {
  console.error("\n💥 Test suite crashed:", error);
  process.exit(1);
});
