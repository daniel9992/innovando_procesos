import {
    AgendaRoutPath,
    ManagementAgendaRoute
} from '@src/customAgencyTool/features/agenda/presentation/routeAgenda';
import {
    CalendarRoutPath,
    ManagementCalendarRoute
} from '@src/customAgencyTool/features/calendar/presentation/routeCalendar';
import {
    DashboardRoutPath,
    ManagementDashboardRoute
} from '@src/customAgencyTool/features/dashboard/presentation/routeDashboard';
import {
    IAChatRootRoutPath,
    ManagementIAChatRoute
} from '@src/customAgencyTool/features/iAChat/presentation/routeIAChat';
import {
    ManagementSettingsRoute,
    SettingsRoutPath
} from '@src/customAgencyTool/features/settings/presentation/routeSettings';
import {
    ManagementUserAdminRoute,
    UserAdminRoutPath
} from '@src/customAgencyTool/features/userAdmin/presentation/routeUserAdmin';
import {
    ManagementUserManagementRoute,
    UserManagementRoutPath
} from '@src/customAgencyTool/features/userManagement/presentation/routeUserManagement';
import { ProtectedRoute } from '@src/customAgencyTool/guard/protectedRoute';
import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const ErrorBoundary = lazy(() => import('../fallbacks/error/errorBoundary'));

export const PrivateRoutePath = {
    ...DashboardRoutPath,
    ...AgendaRoutPath,
    ...CalendarRoutPath,
    ...SettingsRoutPath,
    ...UserAdminRoutPath,
    ...UserManagementRoutPath,
    ...IAChatRootRoutPath
};

export const ManagementPrivateRoute: RouteObject[] = [
    {
        path: PrivateRoutePath.DASHBOARD_PAGE,
        element: <ProtectedRoute />,
        errorElement: <ErrorBoundary />,
        children: [
            ...ManagementDashboardRoute,
            ...ManagementAgendaRoute,
            ...ManagementCalendarRoute,
            ...ManagementUserManagementRoute,
            ...ManagementUserAdminRoute,
            ...ManagementSettingsRoute,
            ...ManagementIAChatRoute
        ]
    }
];
