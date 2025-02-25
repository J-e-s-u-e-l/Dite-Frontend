import { NotificationItem } from "@/components/feature/notifications/NotificationItem";

import { FC } from "react";

interface Notification {
  notificationId: string;
  notificationTitle: string;
  notificationBody: string;
  timeStamp: string;
  isRead: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: FC<NotificationListProps> = ({ notifications }) => {
  return (
    <div>
      {/* {notifications.map((notification) => ( */}
      {notifications.map((notification) => (
        <NotificationItem
          // key={notifications.id}
          key={notification.notificationId}
          notification={notification}
        ></NotificationItem>
      ))}
    </div>
  );
};

export default NotificationList;
