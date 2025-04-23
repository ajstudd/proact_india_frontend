/**
 * Utility functions for authentication
 */

/**
 * Gets the current authentication token from localStorage
 * @returns The access token or null if not found
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const authData = localStorage.getItem("authData");
    if (!authData) return null;

    const parsedAuthData = JSON.parse(authData);
    return parsedAuthData?.token || null;
  } catch (error) {
    console.error("Error retrieving auth token:", error);
    return null;
  }
};

/**
 * Gets the current user ID from localStorage
 * @returns The user ID or null if not found
 */
export const getCurrentUserId = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const authData = localStorage.getItem("authData");
    if (!authData) return null;

    const parsedAuthData = JSON.parse(authData);
    return parsedAuthData?.user?.id || null;
  } catch (error) {
    console.error("Error retrieving user ID:", error);
    return null;
  }
};

/**
 * Alias for getAuthToken to maintain consistency across the app
 * @returns The access token or null if not found
 */
export const getToken = getAuthToken;

/**
 * Clears auth data from localStorage
 */
export const clearAuthData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authData");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  }
};
