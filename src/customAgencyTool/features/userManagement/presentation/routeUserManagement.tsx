import type { MenuItemButon } from '@src/customAgencyTool/components/ui/myMenu';
import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const Layout = lazy(() => import('./layout/layout'));

const UserManagementPage = lazy(() => import('./home/home'));

export const UserManagementRoutPath = {
    USERMANAGMEN_PAGE: 'usermanagement'
};

export const AsideMenuUserManagement: MenuItemButon = {
    id: 'usermanagement-id',
    leftIcon: 'USER',
    label: 'User Management',
    type: 'item',
    isActive: false,
    allowRoles: ['ADMIN', 'USER_AUTH'],
    url: '/dashboard/' + UserManagementRoutPath.USERMANAGMEN_PAGE
};

export const ManagementUserManagementRoute: RouteObject[] = [
    {
        path: UserManagementRoutPath.USERMANAGMEN_PAGE,
        element: <Layout />,
        // errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <UserManagementPage />
            }
        ]
    }
];
