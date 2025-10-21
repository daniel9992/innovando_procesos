import { useEffect, type FC, type HTMLAttributes, type ReactNode } from 'react';
import { MyFlex } from '../ui';

interface DivContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
}

export const DivContainer: FC<DivContainerProps> = ({ children, ...props }) => {
    /**
     *  ? -----------------------------
     *  * Scroll to top - UseEffect
     *  ? -----------------------------
     */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // const bgColor = useColorModeValue('#f1f7ff', '#1A365D');

    // const pxBreakpoint = useBreakpointValue({ base: 0, md: 5 });

    return (
        <MyFlex
            direction={'column'}
            overflow={'auto'}
            // px={pxBreakpoint}
            px={3}
            pt={2}
            pb={5}
            my={2}
            borderRadius={10}
            // bg={bgColor}
            bg={'bg.panel'}
            boxShadow="xl"
            minHeight={'98vh'}
            width={{
                base: '100%',
                lg: '94vw'
            }}
            maxWidth={'2000px'}
            {...props}
        >
            {children}
        </MyFlex>
    );
};
