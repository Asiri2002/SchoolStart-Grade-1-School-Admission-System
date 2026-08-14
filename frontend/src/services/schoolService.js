import apiClient from "../api/apiClient";

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
