import type { MenuItemButon } from '@src/customAgencyTool/components/ui/myMenu';
import Fallback from '@src/customAgencyTool/pages/fallbacks/loading/fallback';
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

const ErrorBoundary = lazy(
    () => import('@pages/fallbacks/error/errorBoundary')
);

const CalendarLayout = lazy(() => import('./pages/layout'));

const CalendarPage = lazy(() => import('./home/calendar.page'));

export const CalendarRoutPath = {
    CALENDAR_PAGE: 'calendar'
};

export const AsideMenuCalendar: MenuItemButon = {
    id: 'calendar-id',
    leftIcon: 'CALENDAR',
    label: 'Calendar',
    type: 'item',
    isActive: true,
    allowRoles: ['ADMIN', 'USER_AUTH'],
    url: '/dashboard/' + +CalendarRoutPath.CALENDAR_PAGE
};

export const ManagementCalendarRoute: RouteObject[] = [
    {
        path: CalendarRoutPath.CALENDAR_PAGE,
        element: (
            <Suspense fallback={<Fallback />}>
                <CalendarLayout />
            </Suspense>
        ),
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <CalendarPage />
            }
        ]
    }
];
