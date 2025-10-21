import { Portal } from '@chakra-ui/react';
import { type ReactNode, memo } from 'react';

interface PortalWrapperProps {
    children: ReactNode;
    withOutPortal: boolean;
}

// Componentes auxiliares memoizados
export const PortalWrapper = memo(
    ({ children, withOutPortal }: PortalWrapperProps) => {
        return withOutPortal ? <>{children}</> : <Portal>{children}</Portal>;
    }
);

PortalWrapper.displayName = 'PortalWrapper';
