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

  const handleCreateNotification = async () => {
    const newNotification = {
      title: 'New Notification',
      message: 'This is a test notification.',
      sender: {
        uid: '1',
        name: 'Sender',
        email: 'sender@example.com',
      },
      receiver: [
        {
          uid: '2',
          name: 'Receiver',
          email: 'receiver@example.com',
        },
      ],
      url: '/notifications',
      urlName: 'View',
      searchTerms: ['test', 'notification'],
    };
    await createNotification.execute(newNotification);
  };

  return (
    <div>
      <h1>Notifications</h1>
      <button onClick={handleCreateNotification}>Create Notification</button>
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
