import type { MenuItemButon } from '@src/customAgencyTool/components/ui/myMenu';
import ErrorBoundary from '@src/customAgencyTool/pages/fallbacks/error/errorBoundary';
import Fallback from '@src/customAgencyTool/pages/fallbacks/loading/fallback';
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

const Layout = lazy(() => import('./layout/layout'));

const SettingsPage = lazy(() => import('./pages/setting.page'));

export const SettingsRoutPath = {
    SETTINGS_PAGE: 'settings'
};

export const AsideMenuSettings: MenuItemButon = {
    id: 'settings-id',
    leftIcon: 'SETTINGS',
    label: 'Settings',
    type: 'item',
    isActive: true,
    allowRoles: ['ADMIN'], //'USER_AUTH'
    url: '/dashboard/' + SettingsRoutPath.SETTINGS_PAGE
};

export const ManagementSettingsRoute: RouteObject[] = [
    {
        path: SettingsRoutPath.SETTINGS_PAGE,
        element: (
            <Suspense fallback={<Fallback />}>
                <Layout />
            </Suspense>
        ),
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <SettingsPage />
            }
        ]
    }
];
