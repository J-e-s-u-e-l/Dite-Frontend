import { useState } from "react";
import { markNotificationAsRead } from "@/services/notificationServices";
import { deleteNotification } from "@/services/notificationServices";
import { useToast } from "@/context/ToastContext";

export const NotificationItem = ({ notification }) => {
  const [read, setRead] = useState(notification.isRead);
  const { showToast } = useToast();

  const markSelectedNotificationAsRead = async () => {
    try {
      const response = await markNotificationAsRead(
        notification.notificationId
      );
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
      await deleteNotification(notification.notificationId);
      showToast("Notification deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete notification. Please try again", "error");
      console.error("Error deleting notification", error);
    }
  };

  return (
    <div
      className={`p-4 mb-4 rounded-lg border ${
        read ? "bg-white" : "bg-blue-50 border-blue-300"
      } hover:bg-gray-50 transition`}
    >
      <h3
        className={`text-xl font-semibold text-gray-900 ${
          read ? "" : "font-bold"
        }`}
      >
        {notification.notificationTitle}
      </h3>
      <p className={`text-gray-700 ${read ? "" : "text-blue-600"}`}>
        {notification.notificationBody}
      </p>
      <p className="text-sm text-gray-500">
        {new Date(notification.timeStamp).toLocaleString()}
      </p>
      {!read && (
        <div className="flex space-x-2 mt-3">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={markSelectedNotificationAsRead}
          >
            Mark as Read
          </button>
        </div>
      )}
      {/* <button
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          onClick={deleteSelectedNotification}
        >
          Delete
        </button> */}
    </div>
  );
};
