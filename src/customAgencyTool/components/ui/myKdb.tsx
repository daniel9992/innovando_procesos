import { Kbd, type KbdProps } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

export const MyKdb: FC<Props & KbdProps> = ({ children, ...props }) => {
    return (
        <Kbd px={3} {...props}>
            {children}
        </Kbd>
    );
};
