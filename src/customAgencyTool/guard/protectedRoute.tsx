import { Navigate } from 'react-router';
import { useAppSelector } from '../app/hooks';
import { selectIsAuthReady } from '../features/auth/infrastructure/authSlice';
import AppLayout from '../layouts/appLayout';
import { PublicRoutePath } from '../pages/public/publicRoutes';

export const ProtectedRoute = () => {
  const selectedCurrentUser = useAppSelector(selectIsAuthReady);

  if (!selectedCurrentUser) {
    return <Navigate replace to={PublicRoutePath.LOGIN} />;
  }

  return <AppLayout />;
};
