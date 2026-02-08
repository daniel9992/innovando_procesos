import { Notification } from '../domain/notifications';
import { NotificationRepository } from '../domain/notifications.repository';

export class GetAllNotifications {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(): Promise<Notification[]> {
    return this.notificationRepository.findAll();
  }
}
