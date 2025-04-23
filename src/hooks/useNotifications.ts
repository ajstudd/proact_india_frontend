import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "../services/notificationsApi";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setUnreadCount,
} from "../store/notificationsSlice";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState<"read" | "unread" | undefined>(
    undefined
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { unreadCount } = useSelector(
    (state: RootState) => state.notificationsSlice || { unreadCount: 0 }
  );

  const { unreadNotificationsCount } = useSelector(
    (state: RootState) => state.userSlice || { unreadNotificationsCount: 0 }
  );

  const {
    data: notificationsData,
    isLoading: isLoadingNotifications,
    refetch: refetchNotifications,
  } = useGetNotificationsQuery({ page, limit, filter });

  const { data: unreadCountData, refetch: refetchUnreadCount } =
    useGetUnreadCountQuery();

  // Synchronize unread count from API response with Redux state
  useEffect(() => {
    if (unreadCountData?.unreadCount !== undefined) {
      dispatch(setUnreadCount(unreadCountData.unreadCount));
    }
  }, [unreadCountData, dispatch]);

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  // Auto-mark all notifications as read when the component loads
  useEffect(() => {
    if (
      !isLoadingNotifications &&
      notificationsData?.notifications?.some((n) => !n.read) &&
      unreadCount > 0
    ) {
      handleMarkAllAsRead();
    }
  }, [notificationsData?.notifications]);

  const handleMarkAsRead = async (notificationIds: string[]) => {
    try {
      await markAsRead(notificationIds).unwrap();
      notificationIds.forEach((id) => {
        dispatch(markNotificationAsRead(id));
      });
      refetchUnreadCount();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
      dispatch(markAllNotificationsAsRead());
      refetchNotifications();
      refetchUnreadCount();
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  // Use the unread count from user state if available, otherwise fall back to notifications state
  const effectiveUnreadCount =
    unreadNotificationsCount !== undefined
      ? unreadNotificationsCount
      : unreadCount;

  return {
    notifications: notificationsData?.notifications || [],
    totalPages: notificationsData?.totalPages || 1,
    currentPage: page,
    unreadCount: effectiveUnreadCount,
    isLoading: isLoadingNotifications,
    filter,
    setFilter,
    setPage,
    setLimit,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    refetch: refetchNotifications,
    refetchUnreadCount,
  };
};

export default useNotifications;
