import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  ACCESS_TOKEN: "@schoolstart_access_token",
  USER_ID: "@schoolstart_user_id",
  USERNAME: "@schoolstart_username",
  EMAIL: "@schoolstart_email",
  ROLE: "@schoolstart_role",
  TOKEN_TYPE: "@schoolstart_token_type",
};

export const saveAuthData = async (authResponse) => {
  try {
    const {
      accessToken,
      tokenType = "Bearer",
      username,
      email,
      role,
      userId,
    } = authResponse;

    if (!accessToken) {
      throw new Error("No access token received from backend.");
    }

    await AsyncStorage.multiSet([
      [KEYS.ACCESS_TOKEN, accessToken],
      [KEYS.TOKEN_TYPE, tokenType || "Bearer"],
      [KEYS.USERNAME, username || ""],
      [KEYS.EMAIL, email || ""],
      [KEYS.ROLE, role || ""],
      [KEYS.USER_ID, userId || ""],
    ]);

    console.log("Authentication data saved successfully.");
  } catch (error) {
    console.error("Error saving authentication data:", error);
    throw error;
  }
};

export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error("Error getting access token:", error);
    return null;
  }
};

export const getTokenType = async () => {
  try {
    return (await AsyncStorage.getItem(KEYS.TOKEN_TYPE)) || "Bearer";
  } catch (error) {
    return "Bearer";
  }
};

export const getAuthData = async () => {
  try {
    const results = await AsyncStorage.multiGet(Object.values(KEYS));

    const data = {};

    results.forEach(([key, value]) => {
      if (key === KEYS.ACCESS_TOKEN) {
        data.accessToken = value;
      } else if (key === KEYS.TOKEN_TYPE) {
        data.tokenType = value;
      } else if (key === KEYS.USERNAME) {
        data.username = value;
      } else if (key === KEYS.EMAIL) {
        data.email = value;
      } else if (key === KEYS.ROLE) {
        data.role = value;
      } else if (key === KEYS.USER_ID) {
        data.userId = value;
      }
    });

    if (!data.accessToken) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error getting authentication data:", error);
    return null;
  }
};

export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(Object.values(KEYS));

    console.log("Authentication data cleared successfully.");
  } catch (error) {
    console.error("Error clearing authentication data:", error);
    throw error;
  }
};
