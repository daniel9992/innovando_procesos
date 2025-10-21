import ErrorBoundary from '@pages/fallbacks/error/errorBoundary';
import type { MenuItemButon } from '@src/customAgencyTool/components/ui/myMenu';
import { Navigate, type RouteObject } from 'react-router';
import { CalendarRoutPath } from '../../calendar/presentation/routeCalendar';

const DashboardPage = () => {
    // Temporary
    return <Navigate replace to={CalendarRoutPath.CALENDAR_PAGE} />;
};
export const DashboardRoutPath = {
    DASHBOARD_PAGE: '/dashboard'
};

export const AsideMenuDashboard: MenuItemButon = {
    id: 'dashboard-id',
    leftIcon: 'HOME',
    label: 'Dashboard',
    type: 'item',
    isActive: true,
    allowRoles: ['ADMIN', 'USER_AUTH'],
    url: DashboardRoutPath.DASHBOARD_PAGE,
    onClick: () => console.log('DASHBOARD')
};

export const ManagementDashboardRoute: RouteObject[] = [
    {
        index: true,
        path: DashboardRoutPath.DASHBOARD_PAGE,
        element: <DashboardPage />,
        errorElement: <ErrorBoundary />
    }
];
