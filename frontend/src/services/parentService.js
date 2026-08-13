import apiClient from '../api/apiClient';


export const fetchParentProfile = async () => {
  try {
    const response = await apiClient.get('/parent/profile');

    console.log('Parent profile response:', response.data);

    return response.data;
  } catch (error) {
    console.error(
      'Failed to fetch parent profile:',
      error?.response?.data || error.message
    );

    throw error;
  }
};


export const updateParentProfile = async (profileData) => {
  try {
    const response = await apiClient.put(
      '/parent/profile',
      profileData
    );

    console.log(
      'Updated parent profile:',
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      'Failed to update parent profile:',
      error?.response?.data || error.message
    );

    throw error;
  }
};


export const fetchParentDashboard = async () => {
  try {
    const response = await apiClient.get('/parent/profile');

    console.log(
      'Parent dashboard response:',
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      'Failed to fetch parent dashboard:',
      error?.response?.data || error.message
    );

    throw error;
  }
};