import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const Notifications = lazy(() => import('./Notifications').then(module => ({ default: module.Notifications })));

export const NotificationsRoutPath = {
  NOTIFICATIONS_PAGE: '/notifications',
};

export const ManagementNotificationsRoute: RouteObject[] = [
  {
    path: NotificationsRoutPath.NOTIFICATIONS_PAGE,
    element: <Notifications />,
  },
];
