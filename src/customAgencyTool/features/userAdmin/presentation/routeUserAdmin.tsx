import type { MenuItemButon } from '@src/customAgencyTool/components/ui/myMenu';
import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const Layout = lazy(() => import('./layout/layout'));

const UserAdminPage = lazy(() => import('./pages/home/userAdmin.page'));

const AddNewUserPage = lazy(() => import('./pages/addNewUser/addNewUser.page'));

export const UserAdminRoutPath = {
    USERADMIN_PAGE: 'useradmin',
    ADD_NEW_USER_PAGE: 'useradmin/add-new-user'
};

export const AsideMenuUserAdmin: MenuItemButon = {
    id: 'useradmin-id',
    leftIcon: 'UserAdmin',
    label: 'User Admin',
    type: 'item',
    isActive: false, // import.meta.env.VITE_REACT_ENV === 'development',
    allowRoles: ['ADMIN'],
    url: '/dashboard/' + UserAdminRoutPath.USERADMIN_PAGE
};

export const ManagementUserAdminRoute: RouteObject[] = [
    {
        path: UserAdminRoutPath.USERADMIN_PAGE,
        element: <Layout />,
        // errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <UserAdminPage />
            },
            {
                path: UserAdminRoutPath.ADD_NEW_USER_PAGE,
                element: <AddNewUserPage />
            }
        ]
    }
];
