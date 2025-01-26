import apiClient from "@/utils/apiClient";

export const fetchAllNotifications = async () => {
  try {
    const response = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications`
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
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/${notificationId}`
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
