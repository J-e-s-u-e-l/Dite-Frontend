import apiClient from "@/utils/apiClient";

export const fetchAllNotifications = async () => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/get-all-notifications`
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch notifications"
    );
  }
};

export interface NotificationCountResponse {
  status: boolean;
  message: string;
  unreadNotificationsCount: number;
}
export const getUnreadNotificationsCount = async () => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/Notifications/unreadNotifications-count`
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    // return response.data as NotificationCountResponse;
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to fetch unread notifications count"
    );
  }
};

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await apiClient.put(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/mark-as-read`
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to mark notification as read"
    );
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await apiClient.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}/delete`
    );
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete notification"
    );
  }
};
