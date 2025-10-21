import { Box, type BoxProps } from '@chakra-ui/react';
import { forwardRef, type ReactNode } from 'react';

interface Params extends BoxProps {
    children?: ReactNode;
}

/**
 * Flex Horizontal
 * @param props
 * @returns
 */

export const MyBox = forwardRef<HTMLDivElement, Params>(
    ({ children, ...props }, ref) => {
        return (
            <Box
                ref={ref}
                direction={{
                    base: 'column',
                    md: 'row'
                }}
                gap={2}
                p={1}
                borderRadius={'10px'}
                {...props}
            >
                {children}
            </Box>
        );
    }
);
