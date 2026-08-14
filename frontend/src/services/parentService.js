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
    // Get parent profile
    const response = await apiClient.get("/parent/profile");

    const parentData = response.data;

    console.log("Parent dashboard response:", parentData);

    // Get child IDs
    const childIds = parentData?.childIds || [];

    let children = [];

    // Fetch child details
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

    // Return parent data + actual children
    return {
      ...parentData,
      children,
    };
  } catch (error) {
    console.error(
      "Failed to fetch parent dashboard:",
      error?.response?.data || error.message,
    );

    throw error;
  }
};
