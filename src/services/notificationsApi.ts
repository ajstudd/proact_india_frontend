import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "../utils/authUtils";
import { NotificationResponsePayload } from "../types/notification";

const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/notifications`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Notifications", "User"],
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationResponsePayload,
      { page?: number; limit?: number; filter?: "read" | "unread" }
    >({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.filter) queryParams.append("filter", params.filter);

        const queryString = queryParams.toString();
        return `/?${queryString}`;
      },
      providesTags: ["Notifications"],
    }),

    getUnreadCount: builder.query<{ unreadCount: number }, void>({
      query: () => "/unread-count",
      providesTags: ["Notifications", "User"],
    }),

    markAsRead: builder.mutation<
      { success: boolean; markedAsRead: number },
      string[]
    >({
      query: (notificationIds) => ({
        url: "/mark-as-read",
        method: "POST",
        body: { notificationIds },
      }),
      invalidatesTags: ["Notifications", "User"],
    }),

    markAllAsRead: builder.mutation<
      { success: boolean; markedAsRead: number },
      void
    >({
      query: () => ({
        url: "/mark-all-as-read",
        method: "POST",
      }),
      invalidatesTags: ["Notifications", "User"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
