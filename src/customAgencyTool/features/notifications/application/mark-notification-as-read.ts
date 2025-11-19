import { NotificationRepository } from '../domain/notifications.repository';

export class MarkNotificationAsRead {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async execute(uid: string): Promise<void> {
    return this.notificationRepository.markAsRead(uid);
  }
}
