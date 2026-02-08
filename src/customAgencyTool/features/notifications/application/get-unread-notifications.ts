import { Notification } from '../domain/notifications';
import { NotificationRepository } from '../domain/notifications.repository';

export class GetUnreadNotifications {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(): Promise<Notification[]> {
    return this.notificationRepository.findUnread();
  }
}
