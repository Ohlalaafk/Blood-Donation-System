import { useState, useEffect } from "react";
import {
  notificationService,
  Notification,
} from "../services/notificationService";

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await notificationService.getNotifications(userId);
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
        setError(null);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch notifications"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  const refreshNotifications = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const data = await notificationService.getNotifications(userId);
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read).length);
      setError(null);
    } catch (err) {
      console.error("Error refreshing notifications:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to refresh notifications"),
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
      throw err;
    }
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    try {
      await notificationService.markAllAsRead(userId);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      throw err;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      const updatedNotifications = notifications.filter(
        (n) => n.id !== notificationId,
      );
      setNotifications(updatedNotifications);
      setUnreadCount(updatedNotifications.filter((n) => !n.read).length);
    } catch (err) {
      console.error("Error deleting notification:", err);
      throw err;
    }
  };

  const clearAllNotifications = async () => {
    if (!userId) return;

    try {
      await notificationService.clearAllNotifications(userId);
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Error clearing all notifications:", err);
      throw err;
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  };
}
