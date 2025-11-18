import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { notificationRepository } from '../../infrastructure/compositionRoot';
import type { Notification } from '../../domain/notifications';

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    notificationRepository
      .readNotifications({ userId: '123' })
      .then(setNotifications);
  }, []);

  const handleToggleRead = (notification: Notification) => {
    const updatedNotification = { ...notification, read: !notification.read };
    notificationRepository
      .updateNotification({ notification: updatedNotification })
      .then(() => {
        setNotifications((prevNotifications) =>
          prevNotifications.map((n) =>
            n.id === updatedNotification.id ? updatedNotification : n
          )
        );
      });
  };

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <h2>{notification.title}</h2>
            <p>From: {notification.sender.name}</p>
            <p>{notification.message}</p>
            <Link to={notification.url}>{notification.urlName}</Link>
            <p>{notification.read ? 'Read' : 'Unread'}</p>
            <button onClick={() => handleToggleRead(notification)}>
              Mark as {notification.read ? 'Unread' : 'Read'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
