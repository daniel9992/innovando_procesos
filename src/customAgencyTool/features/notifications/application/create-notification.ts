import { Notification } from '../domain/notifications';
import { NotificationRepository } from '../domain/notifications.repository';

export class CreateNotification {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(notification: Omit<Notification, 'uid' | 'date'>): Promise<Notification> {
    return this.notificationRepository.create(notification);
  }
}
