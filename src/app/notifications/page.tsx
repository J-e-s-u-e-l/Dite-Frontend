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
  // const [filters, setFilters] = useState({ unread: false, search: "" });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await fetchAllNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications", error);
      } finally {
        setLoading(false);
      }
    };

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
