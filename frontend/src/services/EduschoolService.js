import apiClient from "../api/apiClient";

/**
 * Fetch all schools
 * GET /api/schools
 */
export const getSchools = async () => {
  const response = await apiClient.get("/schools");
  return response.data;
};

/**
 * Fetch school by ID
 * GET /api/schools/{id}
 */
export const getSchoolById = async (id) => {
  const response = await apiClient.get(`/schools/${id}`);
  return response.data;
};

/**
 * Search schools
 * GET /api/schools/search?query=
 */
export const searchSchools = async (query) => {
  const response = await apiClient.get(
    `/schools/search?query=${encodeURIComponent(query)}`,
  );

  return response.data;
};

/**
 * Filter schools by district
 * GET /api/schools/district/{district}
 */
export const getSchoolsByDistrict = async (district) => {
  const response = await apiClient.get(
    `/schools/district/${encodeURIComponent(district)}`,
  );

  return response.data;
};

/**
 * Filter schools by type
 * GET /api/schools/type/{type}
 */
export const getSchoolsByType = async (type) => {
  const response = await apiClient.get(
    `/schools/type/${encodeURIComponent(type)}`,
  );

  return response.data;
};

/**
 * Filter schools by status
 * GET /api/schools/status/{active}
 */
export const getSchoolsByStatus = async (active) => {
  const response = await apiClient.get(`/schools/status/${active}`);

  return response.data;
};

/**
 * Delete school
 * DELETE /api/schools/{id}
 */
export const deleteSchool = async (id) => {
  const response = await apiClient.delete(`/schools/${id}`);
  return response.data;
};

/**
 * Change school active status
 * PATCH /api/schools/{id}/status
 */
export const changeSchoolStatus = async (id) => {
  const response = await apiClient.patch(`/schools/${id}/status`);
  return response.data;
};

export default {
  getSchools,
  getSchoolById,
  searchSchools,
  getSchoolsByDistrict,
  getSchoolsByType,
  getSchoolsByStatus,
  deleteSchool,
  changeSchoolStatus,
};
