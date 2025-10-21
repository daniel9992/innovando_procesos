import type { RouteObject } from 'react-router';
import { ManagementPrivateRoute } from '../pages/private/privateRoutes';
import { ManagementPublicRoute } from '../pages/public/publicRoutes';

export const routeManagementCustomAgencyTool: RouteObject[] = [
  ...ManagementPrivateRoute,
  ...ManagementPublicRoute
];
