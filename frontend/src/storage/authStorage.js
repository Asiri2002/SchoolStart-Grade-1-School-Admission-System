import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  ACCESS_TOKEN: '@schoolstart_access_token',
  USER_ID: '@schoolstart_user_id',
  USERNAME: '@schoolstart_username',
  EMAIL: '@schoolstart_email',
  ROLE: '@schoolstart_role',
  TOKEN_TYPE: '@schoolstart_token_type',
};

/**
 * Save authentication data received from the backend.
 *
 * Expected authResponse:
 * {
 *   accessToken,
 *   tokenType,
 *   username,
 *   email,
 *   role,
 *   userId
 * }
 */
export const saveAuthData = async (authResponse) => {
  try {
    const {
      accessToken,
      tokenType = 'Bearer',
      username,
      email,
      role,
      userId,
    } = authResponse;

    const storageItems = [
      [KEYS.ACCESS_TOKEN, accessToken || ''],
      [KEYS.TOKEN_TYPE, tokenType || 'Bearer'],
      [KEYS.USERNAME, username || ''],
      [KEYS.EMAIL, email || ''],
      [KEYS.ROLE, role || ''],
      [KEYS.USER_ID, userId || ''],
    ];

    await AsyncStorage.multiSet(storageItems);

    console.log('Authentication data saved successfully.');
  } catch (error) {
    console.error(
      'Error saving authentication data:',
      error
    );

    throw error;
  }
};

/**
 * Get the stored JWT access token.
 */
export const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem(
      KEYS.ACCESS_TOKEN
    );

    return token;
  } catch (error) {
    console.error(
      'Error getting access token:',
      error
    );

    return null;
  }
};

/**
 * Get all stored authentication data.
 */
export const getAuthData = async () => {
  try {
    const keys = [
      KEYS.ACCESS_TOKEN,
      KEYS.TOKEN_TYPE,
      KEYS.USERNAME,
      KEYS.EMAIL,
      KEYS.ROLE,
      KEYS.USER_ID,
    ];

    const results = await AsyncStorage.multiGet(keys);

    const authData = {};

    results.forEach(([key, value]) => {
      if (key === KEYS.ACCESS_TOKEN) {
        authData.accessToken = value;
      }

      if (key === KEYS.TOKEN_TYPE) {
        authData.tokenType = value;
      }

      if (key === KEYS.USERNAME) {
        authData.username = value;
      }

      if (key === KEYS.EMAIL) {
        authData.email = value;
      }

      if (key === KEYS.ROLE) {
        authData.role = value;
      }

      if (key === KEYS.USER_ID) {
        authData.userId = value;
      }
    });

    // No token means the user is not authenticated.
    if (!authData.accessToken) {
      return null;
    }

    return authData;
  } catch (error) {
    console.error(
      'Error getting authentication data:',
      error
    );

    return null;
  }
};

/**
 * Clear all authentication data during logout.
 */
export const clearAuthData = async () => {
  try {
    const keys = Object.values(KEYS);

    await AsyncStorage.multiRemove(keys);

    console.log('Authentication data cleared successfully.');
  } catch (error) {
    console.error(
      'Error clearing authentication data:',
      error
    );

    throw error;
  }
};

