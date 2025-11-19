import { Notification } from './notifications';

export interface NotificationRepository {
  create(notification: Omit<Notification, 'uid' | 'date'>): Promise<Notification>;
  findAll(): Promise<Notification[]>;
  findUnread(): Promise<Notification[]>;
  markAsRead(uid: string): Promise<void>;
}
