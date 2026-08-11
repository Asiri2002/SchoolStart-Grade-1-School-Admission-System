import axios from 'axios';
import { getAccessToken } from '../storage/authStorage';


export const API_BASE_URL =
  'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,

  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },

  timeout: 15000,
});

/*
 * Request Interceptor
 *
 * Automatically gets the JWT token from
 * AsyncStorage and sends it as:
 *
 * Authorization: Bearer <token>
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken();

      if (token) {
        config.headers.Authorization =
          `Bearer ${token}`;
      }
    } catch (error) {
      console.error(
        'Error fetching access token:',
        error
      );
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

/*
 * Response Interceptor
 *
 * Handles API errors in one place.
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response) {
      console.error(
        'API Error Response:',
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error(
        'API Network Error: No response received from:',
        API_BASE_URL
      );
    } else {
      console.error(
        'API Request Config Error:',
        error.message
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
