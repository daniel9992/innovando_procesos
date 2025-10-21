import type { MenuItemButon } from '@src/customAgencyTool/components/ui/myMenu';
import ErrorBoundary from '@src/customAgencyTool/pages/fallbacks/error/errorBoundary';
import { lazy } from 'react';
import { type RouteObject } from 'react-router';

const Layout = lazy(() => import('./layout/layout'));
const Home = lazy(() => import('./home/home'));

export const IAChatRootRoutPath = {
    IACHAT: 'iachat'
};

export const AsideMenuIAChat: MenuItemButon = {
    id: 'iaChat-id',
    leftIcon: 'IaChat', //'Hubot',
    label: 'IA Chat',
    type: 'item',
    isActive: true,
    allowRoles: ['ADMIN', 'USER_AUTH'],
    url: '/dashboard/' + IAChatRootRoutPath.IACHAT
};

export const ManagementIAChatRoute: RouteObject[] = [
    {
        path: IAChatRootRoutPath.IACHAT,
        element: <Layout />,
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <Home />
            }
        ]
    }
];
