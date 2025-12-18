import { db } from '@src/customAgencyTool/services/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Notification } from '../domain/notifications';

type UnreadCountListener = (count: number) => void;
type NotificationsListener = (notifications: Notification[]) => void;

export class NotificationService {
  private unreadCount = 0;
  private notifications: Notification[] = [];
  private unreadCountListeners: UnreadCountListener[] = [];
  private notificationsListeners: NotificationsListener[] = [];
  private unsubscribeFromUnread: () => void;
  private unsubscribeFromAll: () => void;

  constructor() {
    const unreadQuery = query(collection(db, 'notifications'), where('isRead', '==', false));
    this.unsubscribeFromUnread = onSnapshot(unreadQuery, (snapshot) => {
      this.unreadCount = snapshot.size;
      this.notifyUnreadCount();
    });

    const allQuery = collection(db, 'notifications');
    this.unsubscribeFromAll = onSnapshot(allQuery, (snapshot) => {
      this.notifications = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          ...data,
          date: data.date.toDate(),
        } as Notification;
      });
      this.notifyNotifications();
    });
  }

  public subscribeToUnreadCount(listener: UnreadCountListener): () => void {
    this.unreadCountListeners.push(listener);
    listener(this.unreadCount);
    return () => this.unsubscribeFromUnreadCount(listener);
  }

  public unsubscribeFromUnreadCount(listener: UnreadCountListener): void {
    this.unreadCountListeners = this.unreadCountListeners.filter(l => l !== listener);
  }

  private notifyUnreadCount(): void {
    this.unreadCountListeners.forEach(listener => listener(this.unreadCount));
  }

  public subscribeToNotifications(listener: NotificationsListener): () => void {
    this.notificationsListeners.push(listener);
    listener(this.notifications);
    return () => this.unsubscribeFromNotifications(listener);
  }

  public unsubscribeFromNotifications(listener: NotificationsListener): void {
    this.notificationsListeners = this.notificationsListeners.filter(l => l !== listener);
  }

  private notifyNotifications(): void {
    this.notificationsListeners.forEach(listener => listener(this.notifications));
  }

  public getUnreadCount(): number {
    return this.unreadCount;
  }

  public cleanup(): void {
    this.unsubscribeFromUnread();
    this.unsubscribeFromAll();
  }
}
