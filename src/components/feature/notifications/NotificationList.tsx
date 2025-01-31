import { NotificationItem } from "@/components/feature/notifications/NotificationItem";

const NotificationList = ({ notifications }) => {
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
