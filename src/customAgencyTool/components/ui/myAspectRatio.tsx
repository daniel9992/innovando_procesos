import { type FC, type ReactNode } from 'react';

import { AspectRatio, type AspectRatioProps } from '@chakra-ui/react';

interface MyAspectRatioProps {
    // ratio?: number;
    children?: ReactNode;
}

export const MyAspectRatio: FC<MyAspectRatioProps & AspectRatioProps> = ({
    ratio = 2 / 1,
    children
}) => {
    return (
        <AspectRatio bg="bg.muted" ratio={ratio}>
            {children}
        </AspectRatio>
    );
};
