import { CreateNotification } from '../application/create-notification';
import { GetAllNotifications } from '../application/get-all-notifications';
import { GetUnreadNotifications } from '../application/get-unread-notifications';
import { MarkNotificationAsRead } from '../application/mark-notification-as-read';
import { NotificationService } from '../application/notification-service';
import { NotificationRepositoryImpl } from './notification-repository-impl';

const notificationRepository = new NotificationRepositoryImpl();

export const createNotification = new CreateNotification(notificationRepository);
export const getAllNotifications = new GetAllNotifications(notificationRepository);
export const getUnreadNotifications = new GetUnreadNotifications(notificationRepository);
export const markNotificationAsRead = new MarkNotificationAsRead(notificationRepository);

export const notificationService = new NotificationService();
