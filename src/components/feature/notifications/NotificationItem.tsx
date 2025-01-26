import { useState } from "react";
import { markNotificationAsRead } from "@/services/notificationServices";
import { deleteNotification } from "@/services/notificationServices";

import { useToast } from "@/context/ToastContext";
export const NotificationItem = (notification) => {
  const [read, setRead] = useState(notification.read);
  const { showToast } = useToast();

  const markSelectedNotificationAsRead = async () => {
    try {
      await markNotificationAsRead(notification.id);
      setRead(true);
      showToast("Notification marked as read", "success");
    } catch (error) {
      showToast(
        "Failed to mark notification as read. Please try again",
        "error"
      );
      console.error("Error marking notification as read", error);
    }
  };

  const deleteSelectedNotification = async () => {
    try {
      await deleteNotification(notification.id);
      showToast("Notification deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete notification. Please try again", "error");
      console.error("Error deleting notification", error);
    }
  };

  return (
    <div className={`${read ? "bg-white" : "bg-gray-200"}`}>
      <h3>{notification.title}</h3>
      <p>{notification.body}</p>
      <p>{new Date(notification.timeStamp).toLocaleString()}</p>
      <button onClick={markSelectedNotificationAsRead}>Mark as Read</button>
      <button onClick={deleteSelectedNotification}>Delete</button>
    </div>
  );
};
