/**
 * API Test Script
 * Run with: node scripts/test-api.js
 * Make sure the dev server is running: npm run dev
 */

const BASE_URL = "http://localhost:3000/api";

async function testAPI() {
  console.log("🧪 Testing API Endpoints...\n");

  try {
    // Test 1: Health Check
    console.log("1️⃣ Testing Health Check...");
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log("✅ Health:", healthData.data?.status);
    console.log("   Database:", healthData.data?.database);
    console.log("");

    // Test 2: Submit Application
    console.log("2️⃣ Testing Submit Application...");
    const applicationData = {
      firstName: "Test",
      lastName: "User",
      email: `test${Date.now()}@example.com`,
      phone: "+1234567890",
      dateOfBirth: "1990-01-15",
      nationality: "United States",
      currentLocation: "New York, USA",
      desiredCountry: "Germany",
      desiredPosition: "Software Engineer",
      yearsExperience: 5,
      expectedSalary: 80000,
      educationLevel: "BACHELOR",
      resumeUrl: "https://example.com/resume.pdf",
      skills: ["JavaScript", "React", "Node.js"],
      languages: [
        { language: "English", proficiency: "NATIVE" },
        { language: "German", proficiency: "INTERMEDIATE" },
      ],
    };

    const submitResponse = await fetch(`${BASE_URL}/v1/applications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(applicationData),
    });

    const submitData = await submitResponse.json();

    if (submitData.success) {
      console.log("✅ Application submitted successfully");
      console.log("   ID:", submitData.data?.id);
      console.log("   Email:", submitData.data?.email);

      const applicationId = submitData.data?.id;

      // Test 3: Get Application by ID
      console.log("\n3️⃣ Testing Get Application by ID...");
      const getResponse = await fetch(
        `${BASE_URL}/v1/applications/${applicationId}`
      );
      const getData = await getResponse.json();

      if (getData.success) {
        console.log("✅ Application retrieved successfully");
        console.log(
          "   Name:",
          `${getData.data?.firstName} ${getData.data?.lastName}`
        );
        console.log("   Status:", getData.data?.status);
      } else {
        console.log("❌ Failed to retrieve application:", getData.error);
      }

      // Test 4: List Applications
      console.log("\n4️⃣ Testing List Applications...");
      const listResponse = await fetch(
        `${BASE_URL}/v1/applications?page=1&pageSize=5`
      );
      const listData = await listResponse.json();

      if (listData.success) {
        console.log("✅ Applications listed successfully");
        console.log("   Total:", listData.pagination?.total);
        console.log("   Page:", listData.pagination?.page);
        console.log("   Results:", listData.data?.length);
      } else {
        console.log("❌ Failed to list applications:", listData.error);
      }

      // Test 5: Update Application
      console.log("\n5️⃣ Testing Update Application...");
      const updateResponse = await fetch(
        `${BASE_URL}/v1/applications/${applicationId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "REVIEWING",
            reviewNotes: "Test review notes",
          }),
        }
      );

      const updateData = await updateResponse.json();

      if (updateData.success) {
        console.log("✅ Application updated successfully");
        console.log("   New Status:", updateData.data?.status);
      } else {
        console.log("❌ Failed to update application:", updateData.error);
      }

      // Test 6: Get Analytics
      console.log("\n6️⃣ Testing Analytics Endpoint...");
      const analyticsResponse = await fetch(`${BASE_URL}/v1/analytics`);
      const analyticsData = await analyticsResponse.json();

      if (analyticsData.success) {
        console.log("✅ Analytics retrieved successfully");
        console.log(
          "   Total Applications:",
          analyticsData.data?.overview?.totalApplications
        );
        console.log(
          "   Pending:",
          analyticsData.data?.overview?.pendingApplications
        );
        console.log(
          "   Conversion Rate:",
          analyticsData.data?.trends?.conversionRate + "%"
        );
      } else {
        console.log("❌ Failed to get analytics:", analyticsData.error);
      }
    } else {
      console.log("❌ Failed to submit application:", submitData.error);
      if (submitData.details) {
        console.log("   Validation errors:", submitData.details);
      }
    }

    console.log("\n✅ API Tests Complete!\n");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n⚠️  Make sure the dev server is running: npm run dev\n");
  }
}

// Run tests
testAPI();
