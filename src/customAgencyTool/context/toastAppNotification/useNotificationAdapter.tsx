import { useContext } from 'react';
import {
  NotificationContext,
  type NotificationContextType
} from './notificationProvider';

export const useNotificationAdapter = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationAdapter must be used within a NotificationProvider'
    );
  }
  return context;
};
