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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Notifications
      </h1>

      {/* Uncomment when you add the search filter */}
      {/* <NotificationSearchFilter setFilters={setFilters} /> */}

      {loading ? (
        <p className="text-gray-500 italic">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">
          You don’t have any notifications at the moment.
        </p>
      ) : (
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
};

export default NotificationPage;
