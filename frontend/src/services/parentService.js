import apiClient from "../api/apiClient";

// =========================================================
// Fetch Parent Profile
// =========================================================

export const fetchParentProfile = async () => {
  try {
    const response = await apiClient.get("/parent/profile");

    console.log("Parent profile response:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Failed to fetch parent profile:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

// =========================================================
// Update Parent Profile
// =========================================================

export const updateParentProfile = async (profileData) => {
  try {
    const response = await apiClient.put("/parent/profile", profileData);

    console.log("Updated parent profile:", response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Failed to update parent profile:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};

// =========================================================
// Fetch Parent Dashboard
// =========================================================

export const fetchParentDashboard = async () => {
  try {
    // -----------------------------------------------------
    // 1. Get parent profile
    // -----------------------------------------------------

    const parentResponse = await apiClient.get("/parent/profile");

    const parentData = parentResponse.data;

    console.log("Parent profile:", parentData);

    // -----------------------------------------------------
    // 2. Get child IDs
    // -----------------------------------------------------

    const childIds = parentData?.childIds || [];

    let children = [];

    // -----------------------------------------------------
    // 3. Fetch child details
    // -----------------------------------------------------

    if (childIds.length > 0) {
      const childResponses = await Promise.all(
        childIds.map(async (childId) => {
          try {
            const childResponse = await apiClient.get(`/children/${childId}`);

            return childResponse.data;
          } catch (error) {
            console.error(
              `Failed to fetch child ${childId}:`,
              error?.response?.data || error.message,
            );

            return null;
          }
        }),
      );

      // Remove failed/null responses
      children = childResponses.filter((child) => child !== null);
    }

    // -----------------------------------------------------
    // 4. Get parent's applications
    // -----------------------------------------------------

    let applications = [];

    try {
      const applicationResponse = await apiClient.get("/applications");

      applications = Array.isArray(applicationResponse.data)
        ? applicationResponse.data
        : [];

      console.log("Parent applications:", applications);
    } catch (error) {
      console.error(
        "Failed to fetch applications:",
        error?.response?.data || error.message,
      );

      // Keep dashboard working even if applications fail
      applications = [];
    }

    // -----------------------------------------------------
    // 5. Return complete dashboard data
    // -----------------------------------------------------

    return {
      ...parentData,

      children,

      applications,
    };
  } catch (error) {
    console.error(
      "Failed to fetch parent dashboard:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};
