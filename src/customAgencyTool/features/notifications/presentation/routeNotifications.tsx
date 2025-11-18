import type { MenuItemButon } from '@src/customAgencyTool/components/ui/myMenu';
import ErrorBoundary from '@src/customAgencyTool/pages/fallbacks/error/errorBoundary';
import Fallback from '@src/customAgencyTool/pages/fallbacks/loading/fallback';
import { lazy, Suspense } from 'react';
import { type RouteObject } from 'react-router';

const Layout = lazy(() => import('./layout/layout'));

const NotificationsPage = lazy(() => import('./pages/notifications.page'));

export const NotificationsRoutPath = {
    NOTIFICATIONS_PAGE: 'notifications'
};

export const AsideMenuNotifications: MenuItemButon = {
    id: 'notifications-id',
    leftIcon: 'NOTIFICATIONS',
    label: 'Notifications',
    type: 'link',
    isActive: true,
    allowRoles: ['ADMIN', 'USER_AUTH'],
    url: '/dashboard/' + NotificationsRoutPath.NOTIFICATIONS_PAGE
};

export const ManagementNotificationsRoute: RouteObject[] = [
    {
        path: NotificationsRoutPath.NOTIFICATIONS_PAGE,
        element: (
            <Suspense fallback={<Fallback />}>
                <Layout />
            </Suspense>
        ),
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <NotificationsPage />
            }
        ]
    }
];
