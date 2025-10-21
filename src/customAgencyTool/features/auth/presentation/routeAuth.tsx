import Fallback from '@src/customAgencyTool/pages/fallbacks/loading/fallback';
import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';
const ErrorBoundary = lazy(
    () => import('@pages/fallbacks/error/errorBoundary')
);

const Login = lazy(
    () =>
        import(
            '@src/customAgencyTool/features/auth/presentation/pages/login/loging.page'
        )
);
const Register = lazy(
    () =>
        import('@features/auth/presentation/pages/register/register.page')
);

const ResetPassByEmail = lazy(
    () =>
        import(
            '@features/auth/presentation/pages/sendPassResetByEmail/sendPassResetByEmail.page'
        )
);

export const AuthRoutePath = {
    LOGIN: '/login',
    REGISTER: '/register',
    RESET_PASS_BY_EMAIL: '/reset-pass-by-email'
};

export const ManagementAuthRoute: RouteObject[] = [
    {
        path: AuthRoutePath.LOGIN,
        element: (
            <Suspense fallback={<Fallback />}>
                <Login />
            </Suspense>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: AuthRoutePath.REGISTER,
        element: (
            <Suspense fallback={<Fallback />}>
                <Register />
            </Suspense>
        ),
        errorElement: <ErrorBoundary />
    },
    {
        path: AuthRoutePath.RESET_PASS_BY_EMAIL,
        element: (
            <Suspense fallback={<Fallback />}>
                <ResetPassByEmail />
            </Suspense>
        ),

        errorElement: <ErrorBoundary />
    }
];
