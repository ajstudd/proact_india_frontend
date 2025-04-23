import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../utils/authUtils";

interface FeedbackRequest {
  description: string;
}

interface FeedbackResponse {
  message: string;
  feedback: {
    _id: string;
    userId: string;
    description: string;
    acknowledged: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export const feedbackApi = createApi({
  reducerPath: "feedbackApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    submitFeedback: builder.mutation<FeedbackResponse, FeedbackRequest>({
      query: (data) => ({
        url: "/feedback",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSubmitFeedbackMutation } = feedbackApi;
