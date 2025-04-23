import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../utils/authUtils";

const API_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

// Base API configuration with authentication
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/project`,
    prepareHeaders: (headers) => {
      // Get a fresh token every time
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth", "User", "Projects", "Comments", "Updates", "Media"],
  endpoints: () => ({}),
});

// Helper function to get auth header for custom calls
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
