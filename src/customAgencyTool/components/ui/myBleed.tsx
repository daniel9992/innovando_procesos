import { Bleed, type BleedProps } from '@chakra-ui/react';
import { type FC, type ReactNode } from 'react';

interface Props extends BleedProps {
    children?: ReactNode;
}

export const MyBleed: FC<Props> = ({ children, ...props }) => {
    return <Bleed {...props}>{children}</Bleed>;
};
