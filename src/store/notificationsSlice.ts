import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "../types/notification";
import { notificationsApi } from "../services/notificationsApi";
import { userApi } from "../services/userApi";

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n._id === action.payload
      );
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        read: true,
      }));
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    // Handle notification count updates from API
    builder.addMatcher(
      notificationsApi.endpoints.getUnreadCount.matchFulfilled,
      (state, { payload }) => {
        state.unreadCount = payload.unreadCount;
      }
    );

    // Handle marking as read
    builder.addMatcher(
      notificationsApi.endpoints.markAsRead.matchFulfilled,
      (state, { payload }) => {
        state.unreadCount = Math.max(
          0,
          state.unreadCount - payload.markedAsRead
        );
      }
    );

    // Handle marking all as read
    builder.addMatcher(
      notificationsApi.endpoints.markAllAsRead.matchFulfilled,
      (state) => {
        state.unreadCount = 0;
        state.notifications = state.notifications.map((notification) => ({
          ...notification,
          read: true,
        }));
      }
    );

    // Get notification counts from user profile
    builder.addMatcher(
      userApi.endpoints.getUserProfile.matchFulfilled,
      (state, { payload }) => {
        if (payload.unreadNotificationsCount !== undefined) {
          state.unreadCount = payload.unreadNotificationsCount;
        }
      }
    );
  },
});

export const {
  setNotifications,
  setUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
