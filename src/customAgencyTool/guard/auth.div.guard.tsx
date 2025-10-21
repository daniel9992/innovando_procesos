import type { FC, ReactNode } from 'react';
import { useAppSelector } from '../app/hooks';
import { selectCurrentRole } from '../features/auth/infrastructure/authSlice';

export interface InterfaceAuthDicGuardProps {
  role: string[];
  children: ReactNode;
}

const AuthDivGuard: FC<InterfaceAuthDicGuardProps> = ({
  role,
  children
}) => {
  const currentUserRole = useAppSelector(selectCurrentRole);

  const find = role.findIndex((values) => values === currentUserRole);

  if (find === -1) {
    return <></>;
  }

  return <>{children}</>;
};

export default AuthDivGuard;
