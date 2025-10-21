import type { MenuItemButon } from '@src/customAgencyTool/components/ui/myMenu';
import { SEARCH_WORD } from '@src/customAgencyTool/constants/words';
import ErrorBoundary from '@src/customAgencyTool/pages/fallbacks/error/errorBoundary';
import Fallback from '@src/customAgencyTool/pages/fallbacks/loading/fallback';
import { lazy, Suspense } from 'react';
import { type RouteObject } from 'react-router';

const Layout = lazy(() => import('./layout/layout'));

const AgendaPage = lazy(() => import('./pages/home/agenda.page'));

const SearchAgendaPage = lazy(
    () => import('./pages/searchAgenda/searchAgendaPage')
);

export const AgendaRoutPath = {
    AGENDA_PAGE: 'agenda',
    AGENDA_SEARCH: 'agendaSearch/' + SEARCH_WORD
};

export const AsideMenuAgenda: MenuItemButon = {
    id: 'agenda-id',
    leftIcon: 'AGENDAPAGE',
    label: 'Agenda',
    type: 'link',
    isActive: true,
    allowRoles: ['ADMIN', 'USER_AUTH'],
    url: '/dashboard/' + AgendaRoutPath.AGENDA_PAGE
};

export const ManagementAgendaRoute: RouteObject[] = [
    {
        path: AgendaRoutPath.AGENDA_PAGE,
        element: (
            <Suspense fallback={<Fallback />}>
                <Layout />
            </Suspense>
        ),
        errorElement: <ErrorBoundary />,
        children: [
            {
                index: true,
                element: <AgendaPage />
            },
            {
                path: AgendaRoutPath.AGENDA_SEARCH,
                element: <SearchAgendaPage />
            }
        ]
    }
];
