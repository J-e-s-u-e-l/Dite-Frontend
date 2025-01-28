"use client";

import { useEffect, useState } from "react";
import NotificationList from "@/components/feature/notifications/NotificationList";
import NotificationSearchFilter from "@/components/feature/notifications/NotificationSearchFilter";
import { fetchAllNotifications } from "@/services/notificationServices";
import {
  startSignalRConnection,
  subscribeToNotifications,
} from "@/services/signalRServices";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
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

  startSignalRConnection();
  subscribeToNotifications((newNotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  });

  // Filter notifications based on the selected filters

  // const filteredNotifications = notifications.filter((notification) => {
  //   const matchesSearch = notification.title.includes(filters.search);
  //   const matchesReadStatus = filters.unread ? !notification.read : true;
  //   return matchesSearch && matchesReadStatus;
  // });

  return (
    <div>
      <h1>Notifications</h1>
      {/* <NotificationSearchFilter setFilters={setFilters} /> */}
      {loading ? (
        <p>
          <i>Loading notifications...</i>
        </p>
      ) : notifications.length === 0 ? (
        <p>You don’t have any notifications at the moment.</p>
      ) : (
        <NotificationList
          // notifications={filteredNotifications}
          notifications
        ></NotificationList>
      )}
    </div>
  );
};

export default NotificationPage;
