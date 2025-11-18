import type { Notification } from '../domain/notifications';

export interface IReadNotifications {
  userId: string;
}

export interface IUpdateNotification {
  notification: Notification;
}

export interface INotificationRepository {
  /**
   * @description Reads notifications.
   * @param {IReadNotifications} args - The arguments for the use case.
   * @returns {Promise<Notification[]>} - The notifications.
   */
  readNotifications(args: IReadNotifications): Promise<Notification[]>;

  /**
   * @description Updates a notification.
   * @param {IUpdateNotification} args - The arguments for the use case.
   * @returns {Promise<Notification>} - The notification.
   */
  updateNotification(args: IUpdateNotification): Promise<Notification>;
}
