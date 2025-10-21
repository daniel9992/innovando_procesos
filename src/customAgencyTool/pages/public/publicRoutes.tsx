import {
    AuthRoutePath,
    ManagementAuthRoute
} from '@src/customAgencyTool/features/auth/presentation/routeAuth';
import type { RouteObject } from 'react-router';

export const PublicRoutePath = {
    ...AuthRoutePath
};

export const ManagementPublicRoute: RouteObject[] = [...ManagementAuthRoute];
