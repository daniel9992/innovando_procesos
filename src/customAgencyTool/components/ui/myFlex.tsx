import { Flex, type FlexProps } from '@chakra-ui/react';
import { forwardRef, type ReactNode } from 'react';

export interface FlexParams extends FlexProps {
    bento?: boolean;
    children?: ReactNode;
}

/**
 * Flex Horizontal
 * @param props
 * @returns
 */

export const MyFlex = forwardRef<HTMLDivElement, FlexParams>(
    ({ bento = false, children, ...props }, ref) => {
        return (
            <Flex
                ref={ref}
                direction={{
                    base: 'column',
                    md: 'row'
                }}
                gap={2}
                p={1}
                borderRadius={'10px'}
                border={bento ? '1px solid #ccc' : 'none'}
                {...props}
            >
                {children}
            </Flex>
        );
    }
);
