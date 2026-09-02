import apiClient from "../api/apiClient";

/**
 * Fetch all school admins
 * GET /api/school-admins
 */
export const getSchoolAdmins = async () => {
  const response = await apiClient.get("/school-admins");
  return response.data;
};

/**
 * Fetch school admin by ID
 * GET /api/school-admins/{id}
 */
export const getSchoolAdminById = async (id) => {
  const response = await apiClient.get(`/school-admins/${id}`);
  return response.data;
};

/**
 * Search school admins
 * GET /api/school-admins/search?query=
 */
export const searchSchoolAdmins = async (query) => {
  const response = await apiClient.get(
    `/school-admins/search?query=${encodeURIComponent(query)}`,
  );

  return response.data;
};

/**
 * Fetch school admins by school
 * GET /api/school-admins/school/{schoolId}
 */
export const getSchoolAdminsBySchool = async (schoolId) => {
  const response = await apiClient.get(`/school-admins/school/${schoolId}`);

  return response.data;
};

/**
 * Fetch school admins by status
 * GET /api/school-admins/status/{enabled}
 */
export const getSchoolAdminsByStatus = async (enabled) => {
  const response = await apiClient.get(`/school-admins/status/${enabled}`);

  return response.data;
};

/**
 * Create school admin
 * POST /api/school-admins
 */
export const createSchoolAdmin = async (data) => {
  const response = await apiClient.post("/school-admins", data);

  return response.data;
};

/**
 * Update school admin
 * PUT /api/school-admins/{id}
 */
export const updateSchoolAdmin = async (id, data) => {
  const response = await apiClient.put(`/school-admins/${id}`, data);

  return response.data;
};

/**
 * Delete school admin
 * DELETE /api/school-admins/{id}
 */
export const deleteSchoolAdmin = async (id) => {
  const response = await apiClient.delete(`/school-admins/${id}`);

  return response.data;
};

/**
 * Activate school admin
 * PATCH /api/school-admins/{id}/activate
 */
export const activateSchoolAdmin = async (id) => {
  const response = await apiClient.patch(`/school-admins/${id}/activate`);

  return response.data;
};

/**
 * Deactivate school admin
 * PATCH /api/school-admins/{id}/deactivate
 */
export const deactivateSchoolAdmin = async (id) => {
  const response = await apiClient.patch(`/school-admins/${id}/deactivate`);

  return response.data;
};

export default {
  getSchoolAdmins,
  getSchoolAdminById,
  searchSchoolAdmins,
  getSchoolAdminsBySchool,
  getSchoolAdminsByStatus,
  createSchoolAdmin,
  updateSchoolAdmin,
  deleteSchoolAdmin,
  activateSchoolAdmin,
  deactivateSchoolAdmin,
};
