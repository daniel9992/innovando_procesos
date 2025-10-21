import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react';
import { forwardRef, type ReactNode, type RefObject } from 'react';

export interface TooltipProps extends ChakraTooltip.RootProps {
    showArrow?: boolean;
    portalled?: boolean;
    portalRef?: RefObject<HTMLElement>;
    content: ReactNode;
    contentProps?: ChakraTooltip.ContentProps;
    isDisabled?: boolean;
    placement?:
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-start'
        | 'top-end'
        | 'bottom-start'
        | 'bottom-end'
        | 'right-start'
        | 'right-end'
        | 'left-start'
        | 'left-end';
}

export const MyTooltip = forwardRef<HTMLDivElement, TooltipProps>(
    function Tooltip(props, ref) {
        const {
            showArrow = true,
            children,
            isDisabled,
            portalled = true,
            content,
            contentProps,
            portalRef,
            placement = 'bottom',
            ...rest
        } = props;

        if (isDisabled) return children;

        //bg="gray.100" color="gray.800"
        return (
            <ChakraTooltip.Root
                positioning={{ placement: placement }}
                {...rest}
            >
                <ChakraTooltip.Trigger asChild>
                    {children}
                </ChakraTooltip.Trigger>
                <Portal disabled={!portalled} container={portalRef}>
                    <ChakraTooltip.Positioner>
                        <ChakraTooltip.Content ref={ref} {...contentProps}>
                            {showArrow && (
                                <ChakraTooltip.Arrow>
                                    <ChakraTooltip.ArrowTip />
                                </ChakraTooltip.Arrow>
                            )}
                            {content}
                        </ChakraTooltip.Content>
                    </ChakraTooltip.Positioner>
                </Portal>
            </ChakraTooltip.Root>
        );
    }
);
