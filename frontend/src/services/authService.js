import apiClient from '../api/apiClient';

import {
  saveAuthData,
  clearAuthData,
} from '../storage/authStorage';

/**
 * Authenticate user
 *
 * POST /api/auth/login
 *
 * @param {string} usernameOrEmail
 * @param {string} password
 * @returns {Promise<Object>} Authentication response
 */
export const loginUser = async (
  usernameOrEmail,
  password
) => {
  try {
    const response = await apiClient.post(
      '/auth/login',
      {
        usernameOrEmail: usernameOrEmail.trim(),
        password: password,
      }
    );

    const authData = response.data;

    // Save JWT and user information
    await saveAuthData(authData);

    return authData;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Register a new parent
 *
 * POST /api/auth/register
 *
 * @param {Object} registerData
 * @returns {Promise<Object|string>} Server response
 */
export const registerUser = async ({
  username,
  email,
  password,
}) => {
  try {
    const response = await apiClient.post(
      '/auth/register',
      {
        username: username.trim(),
        email: email.trim(),
        password: password,
      }
    );

    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Logout user.
 *
 * Clears locally stored authentication data.
 */
export const logoutUser = async () => {
  try {
    await clearAuthData();
  } catch (error) {
    console.error(
      'Error during logout:',
      error
    );

    throw error;
  }
};

/**
 * Convert API/Axios errors
 * into user-friendly messages.
 */
const handleAuthError = (error) => {
  // Server responded with an error
  if (error.response) {
    const { status, data } = error.response;

    // Backend returned plain text
    if (
      typeof data === 'string' &&
      data.length > 0
    ) {
      return new Error(data);
    }

    // Backend returned:
    // { message: "..." }
    if (
      data &&
      typeof data.message === 'string'
    ) {
      return new Error(data.message);
    }

    // Handle HTTP status codes
    switch (status) {
      case 400:
        return new Error(
          'Invalid input details provided. Please check your inputs.'
        );

      case 401:
        return new Error(
          'Invalid username/email or password. Please try again.'
        );

      case 403:
        return new Error(
          'Access denied. Your account may be disabled.'
        );

      case 404:
        return new Error(
          'Authentication service was not found.'
        );

      case 409:
        return new Error(
          'Username or email is already registered.'
        );

      case 500:
        return new Error(
          'Server error. Please try again later.'
        );

      default:
        return new Error(
          `Server returned error (${status}). Please try again later.`
        );
    }
  }

  // Request was sent but no response
  if (error.request) {
    return new Error(
      'Unable to connect to SchoolStart server. Please check your network connection.'
    );
  }

  // Other JavaScript/Axios error
  return new Error(
    error.message ||
      'An unexpected error occurred. Please try again.'
  );
};
