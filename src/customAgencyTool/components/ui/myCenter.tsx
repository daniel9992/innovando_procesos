import { Center, type CenterProps } from '@chakra-ui/react';
import { forwardRef, type ReactNode } from 'react';

interface Params extends CenterProps {
  children?: ReactNode;
}

/**
 * Flex Horizontal
 * @param props
 * @returns
 */
export const MyCenter = forwardRef<HTMLDivElement, Params>(({ children, ...props }, ref) => {
  return (
    <Center
      ref={ref}
      direction={{
        base: 'column',
        md: 'row'
      }}
      gap={2}
      p={2}
      borderRadius={'10px'}
      {...props}
    >
      {children}
    </Center>
  );
});
