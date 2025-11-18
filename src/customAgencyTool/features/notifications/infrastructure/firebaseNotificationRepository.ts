import {
  INotificationRepository,
  IReadNotifications,
  IUpdateNotification,
} from '../application/INotificationRepository';
import { Notification } from '../domain/notifications';

export class FirebaseNotificationRepository implements INotificationRepository {
  private notifications: Notification[] = [
    {
      id: '1',
      title: 'Notification 1',
      message: 'This is the first notification',
      read: false,
      url: '/dashboard/agenda',
      urlName: 'Go to Agenda',
      sender: {
        uid: 'sender1',
        name: 'Admin',
        email: 'admin@example.com',
      },
      receiver: [
        {
          uid: '123',
          name: 'Jules',
          email: 'jules@example.com',
        },
      ],
      searchTerms: ['notification', 'agenda'],
    },
    {
      id: '2',
      title: 'Notification 2',
      message: 'This is the second notification, it is a group notification',
      read: true,
      url: '/dashboard/calendar',
      urlName: 'Go to Calendar',
      sender: {
        uid: 'sender2',
        name: 'System',
        email: 'system@example.com',
      },
      receiver: [
        {
          uid: '123',
          name: 'Jules',
          email: 'jules@example.com',
        },
        {
            uid: 'receiver2',
            name: 'John Doe',
            email: 'john@example.com',
        }
      ],
      searchTerms: ['notification', 'calendar', 'group'],
    },
    {
        id: '3',
        title: 'Notification 3',
        message: 'This is a notification for John Doe',
        read: false,
        url: '/dashboard/settings',
        urlName: 'Go to Settings',
        sender: {
            uid: 'sender1',
            name: 'Admin',
            email: 'admin@example.com',
        },
        receiver: [
            {
                uid: 'receiver2',
                name: 'John Doe',
                email: 'john@example.com',
            }
        ],
        searchTerms: ['notification', 'settings'],
    }
  ];

  async readNotifications({
    userId,
  }: IReadNotifications): Promise<Notification[]> {
    const userNotifications = this.notifications.filter((notification) =>
      notification.receiver.some((receiver) => receiver.uid === userId)
    );
    return Promise.resolve(userNotifications);
  }

  async updateNotification({
    notification,
  }: IUpdateNotification): Promise<Notification> {
    this.notifications = this.notifications.map((n) =>
      n.id === notification.id ? notification : n
    );
    return Promise.resolve(notification);
  }
}
