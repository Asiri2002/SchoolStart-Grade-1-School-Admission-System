import apiClient from "../api/apiClient";

/**
 * Fetch all schools.
 * Calls: GET /api/schools
 */
export const fetchSchools = async () => {
  try {
    const response = await apiClient.get("/schools");

    console.log("Schools from backend:", response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to fetch schools:", error);
    throw error;
  }
};

/**
 * Fetch a single school by its ID.
 * Calls: GET /api/schools/{schoolId}
 */
export const fetchSchoolById = async (schoolId) => {
  try {
    const response = await apiClient.get(`/schools/${schoolId}`);

    console.log("School from backend:", response.data);

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch school with ID ${schoolId}:`, error);
    throw error;
  }
};

/**
 * Search schools by name or code.
 * Calls: GET /api/schools/search?query={query}
 */
export const searchSchools = async (query) => {
  try {
    const response = await apiClient.get("/schools/search", {
      params: { query },
    });

    console.log("Search results:", response.data);

    return response.data;
  } catch (error) {
    console.error("Failed to search schools:", error);
    throw error;
  }
};

/**
 * Filter schools by district.
 * Calls: GET /api/schools/district/{district}
 */
export const getSchoolsByDistrict = async (district) => {
  try {
    const response = await apiClient.get(`/schools/district/${district}`);

    console.log("Schools by district:", response.data);

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch schools for district ${district}:`, error);
    throw error;
  }
};

/**
 * Filter schools by type.
 * Calls: GET /api/schools/type/{type}
 */
export const getSchoolsByType = async (type) => {
  try {
    const response = await apiClient.get(`/schools/type/${type}`);

    console.log("Schools by type:", response.data);

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch schools for type ${type}:`, error);
    throw error;
  }
};

/**
 * Filter schools by active/inactive status.
 * Calls: GET /api/schools/status/{active}
 */
export const getSchoolsByStatus = async (active) => {
  try {
    const response = await apiClient.get(`/schools/status/${active}`);

    console.log("Schools by status:", response.data);

    return response.data;
  } catch (error) {
    console.error(`Failed to fetch schools with status ${active}:`, error);
    throw error;
  }
};
