import { Notification } from '../domain/notifications';
import { NotificationRepository } from '../domain/notifications.repository';
import { db } from '@src/customAgencyTool/services/firebase';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';

export class NotificationRepositoryImpl implements NotificationRepository {
  private readonly notificationsCollection = collection(db, 'notifications');

  async create(notification: Omit<Notification, 'uid' | 'date'>): Promise<Notification> {
    const newNotificationData = {
      ...notification,
      date: new Date(),
      isRead: false,
    };
    const docRef = await addDoc(this.notificationsCollection, newNotificationData);
    return {
      ...newNotificationData,
      uid: docRef.id,
    };
  }

  async findAll(): Promise<Notification[]> {
    const querySnapshot = await getDocs(this.notificationsCollection);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        ...data,
        date: data.date.toDate(),
      } as Notification;
    });
  }

  async findUnread(): Promise<Notification[]> {
    const q = query(this.notificationsCollection, where('isRead', '==', false));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          ...data,
          date: data.date.toDate(),
        } as Notification;
    });
  }

  async markAsRead(uid: string): Promise<void> {
    const notificationDoc = doc(this.notificationsCollection, uid);
    await updateDoc(notificationDoc, { isRead: true });
  }
}
