import apiClient from "../api/apiClient";

import { clearAuthData, saveAuthData } from "../storage/authStorage";

export const loginUser = async (usernameOrEmail, password) => {
  try {
    const response = await apiClient.post("/auth/login", {
      usernameOrEmail: usernameOrEmail.trim(),
      password,
    });

    const authData = response.data;

    // Save JWT and user information
    await saveAuthData(authData);

    return authData;
  } catch (error) {
    throw handleAuthError(error);
  }
};

export const registerUser = async ({ username, email, password }) => {
  try {
    const response = await apiClient.post("/auth/register", {
      username: username.trim(),
      email: email.trim(),
      password,
    });

    return response.data;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Logout user
 *
 * Clears locally stored authentication data.
 */
export const logoutUser = async () => {
  try {
    await clearAuthData();
  } catch (error) {
    console.error("Logout failed:", error);
    throw new Error("Unable to logout. Please try again.");
  }
};

const handleAuthError = (error) => {
  // Server responded with an error
  if (error.response) {
    const { status, data } = error.response;

    // Backend returned a plain text message
    if (typeof data === "string" && data.trim().length > 0) {
      return new Error(data);
    }

    // Backend returned { message: "..." }
    if (
      data &&
      typeof data.message === "string" &&
      data.message.trim().length > 0
    ) {
      return new Error(data.message);
    }

    switch (status) {
      case 400:
        return new Error(
          "Invalid input details. Please check your information.",
        );

      case 401:
        return new Error("Invalid username/email or password.");

      case 403:
        return new Error(
          "Access denied. You do not have permission to perform this action.",
        );

      case 404:
        return new Error("Authentication service was not found.");

      case 409:
        return new Error("Username or email is already registered.");

      case 500:
        return new Error("Server error. Please try again later.");

      default:
        return new Error(`Request failed with status ${status}.`);
    }
  }

  // Request was sent but no response was received
  if (error.request) {
    return new Error(
      "Unable to connect to the SchoolStart server. Please check your network connection.",
    );
  }

  // Other Axios/JavaScript error
  return new Error(error.message || "An unexpected error occurred.");
};
