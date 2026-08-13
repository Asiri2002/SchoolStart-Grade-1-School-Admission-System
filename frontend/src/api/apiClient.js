import axios from 'axios';
import { getAccessToken } from '../storage/authStorage';

export const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    } catch (error) {
      console.error(
        'Failed to retrieve access token:',
        error
      );

      return config;
    }
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response) {
      console.error(
        'API Error:',
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error(
        'No response received from:',
        API_BASE_URL
      );
    } else {
      console.error(
        'API Request Error:',
        error.message
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;