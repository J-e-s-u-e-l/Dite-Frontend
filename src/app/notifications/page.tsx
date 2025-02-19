"use client";

import { useEffect, useState } from "react";
import NotificationList from "@/components/feature/notifications/NotificationList";
import NotificationSearchFilter from "@/components/feature/notifications/NotificationSearchFilter";
import { fetchAllNotifications } from "@/services/notificationServices";
import {
  startSignalRConnectionForNotifications,
  subscribeToNotifications,
  cleanupNotificationSubscription,
} from "@/services/signalRServices";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [newNotifications, setNewNotifications] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  // const [filters, setFilters] = useState({ unread: false, search: "" });

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetchAllNotifications();
      setNotifications(response.data);
    } catch (error) {
      setPageError("Failed to load notifications. Please try again.");
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // useEffect(() => {
  //   startSignalRConnectionForNotifications();
  //   subscribeToNotifications((newNotification) => {
  //     setNotifications((prev) => [newNotification, ...prev]);
  //   });

  //   return () => {
  //     cleanupNotificationSubscription();
  //   };
  // }, []);

  // startSignalRConnectionForMessages();
  // subscribeToNotifications((newNotification) => {
  //   setNotifications((prev) => [newNotification, ...prev]);
  // });

  // Filter notifications based on the selected filters

  // const filteredNotifications = notifications.filter((notification) => {
  //   const matchesSearch = notification.title.includes(filters.search);
  //   const matchesReadStatus = filters.unread ? !notification.read : true;
  //   return matchesSearch && matchesReadStatus;
  // });

  if (pageError) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{pageError}</p>
        <button
          onClick={fetchNotifications}
          className="mt-4 p-2 rounded bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      {/* Page Title */}
      {/* <h1 className="text-3xl font-bold text-gray-900 mb-6 border-b pb-3">
        Notifications
      </h1> */}
      <div className="sticky top-0 bg-white z-10 flex justify-between items-center py-4 px-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
      </div>

      <div className="p-6">
        {/* <NotificationSearchFilter setFilters={setFilters} /> */}

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
            <p className="text-gray-500 italic ml-3">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          // Empty State
          <div className="text-gray-500 text-center py-10">
            <p className="text-lg">📭 No new notifications at the moment.</p>
          </div>
        ) : (
          // Notification List
          <div className="mt-4">
            <NotificationList notifications={notifications} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
