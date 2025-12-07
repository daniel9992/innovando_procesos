import React, { useEffect, useState } from 'react';
import { markNotificationAsRead, notificationService } from '../infrastructure/composition-root';
import { Notification } from '../domain/notifications';
import { createNotification } from '../infrastructure/composition-root';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationService.subscribeToNotifications(setNotifications);
    return () => unsubscribe();
  }, []);

  const handleMarkAsRead = async (uid: string) => {
    await markNotificationAsRead.execute(uid);
  };

  return (
    <div>
      <h1>Notifications</h1>
      <ul>
        {notifications.map(notification => (
          <li key={notification.uid} style={{ textDecoration: notification.isRead ? 'line-through' : 'none' }}>
            <h2>{notification.title}</h2>
            <p>{notification.message}</p>
            {!notification.isRead && (
              <button onClick={() => handleMarkAsRead(notification.uid)}>Mark as Read</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
