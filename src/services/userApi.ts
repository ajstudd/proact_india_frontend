import {
  ProjectsResponse,
  BookmarkedProjectsResponse,
  TrimmedProjectsResponse,
} from "types/project";
import {
  UpdateUserPayload,
  UpdateUserResponse,
  BookmarkResponse,
  UserProfileResponse,
  EmailVerificationPayload,
  EmailVerificationResponse,
  UserCommentsResponse,
  // UserProjectsResponse,
} from "../types";
import { getAuthToken } from "../utils/authUtils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/user`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Bookmarks", "Profile", "Comments", "Projects"],
  endpoints: (builder) => ({
    updateUser: builder.mutation<UpdateUserResponse, UpdateUserPayload>({
      query: (body) => ({
        url: "/update",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    editProfile: builder.mutation<
      {
        message: string;
        user: UpdateUserResponse;
      },
      FormData
    >({
      query: (formData) => ({
        url: "/edit-profile",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    verifyEmailChange: builder.mutation<
      EmailVerificationResponse,
      EmailVerificationPayload
    >({
      query: (body) => ({
        url: "/verify-email",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    getUserProfile: builder.query<UserProfileResponse, void>({
      query: () => "/profile",
      providesTags: ["Profile"],
    }),
    getUserComments: builder.query<UserCommentsResponse, string>({
      query: (userId) => `/comments/user/${userId}`,
      providesTags: ["Comments"],
    }),
    bookmarkProject: builder.mutation<BookmarkResponse, { projectId: string }>({
      query: (body) => ({
        url: "/bookmarks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Bookmarks"],
    }),
    removeBookmark: builder.mutation<BookmarkResponse, string>({
      query: (projectId) => ({
        url: `/bookmarks/${projectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmarks"],
    }),
    getBookmarkedProjects: builder.query<BookmarkedProjectsResponse, void>({
      query: () => "/bookmarks",
      providesTags: ["Bookmarks"],
    }),
    getUserProjects: builder.query<TrimmedProjectsResponse, void>({
      query: () => "/projects",
      providesTags: ["Projects"],
    }),
    resetPassword: builder.mutation<
      { message: string; success: boolean },
      { oldPassword: string; newPassword: string }
    >({
      query: (credentials) => ({
        url: "/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
    searchUsers: builder.query<
      { users: any[]; total: number; hasMore: boolean },
      { query: string; limit?: number; page?: number }
    >({
      query: ({ query, limit = 10, page = 1 }) => {
        const queryParams = new URLSearchParams();
        queryParams.append("query", query);
        queryParams.append("limit", limit.toString());
        queryParams.append("page", page.toString());
        return `/search?${queryParams.toString()}`;
      },
    }),
    searchContractors: builder.query<
      { users: any[]; total: number; hasMore: boolean },
      { query: string; limit?: number; page?: number }
    >({
      query: ({ query, limit = 10, page = 1 }) => {
        const queryParams = new URLSearchParams();
        queryParams.append("query", query);
        queryParams.append("limit", limit.toString());
        queryParams.append("page", page.toString());
        return `/search/contractors?${queryParams.toString()}`;
      },
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useEditProfileMutation,
  useVerifyEmailChangeMutation,
  useGetUserProfileQuery,
  useGetUserCommentsQuery,
  useBookmarkProjectMutation,
  useRemoveBookmarkMutation,
  useGetBookmarkedProjectsQuery,
  useGetUserProjectsQuery,
  useResetPasswordMutation,
  useSearchUsersQuery,
  useSearchContractorsQuery,
} = userApi;
