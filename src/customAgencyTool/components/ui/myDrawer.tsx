import {
    CloseButton,
    Drawer,
    useBreakpointValue,
    type DrawerRootProps
} from '@chakra-ui/react';
import {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState,
    type ReactNode
} from 'react';
import { PortalWrapper } from './portalWrapperProps';

// Interfaz para los métodos expuestos
export interface DrawerHandles {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: boolean;
}

export interface MyDrawerProps
    extends Omit<DrawerRootProps, 'open' | 'onOpenChange' | 'children'> {
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    trigger?: ReactNode;
    header?: ReactNode;
    children?: ReactNode;
    footer?: ReactNode;
    offset?: string;
    withOutPortal?: boolean;
    onBeforeOpen?: () => Promise<boolean> | boolean;
    onAfterOpen?: () => void;
    onBeforeClose?: () => Promise<boolean> | boolean;
    onAfterClose?: () => void;
}
/**
 *  MyDrawer
 *  @param isOpen boolean to control the drawer state
 *  @param onOpenChange callback to update the drawer state, return true to close the drawer
 *  @param trigger element to open the drawer
 *  @param header element to show in the header
 *  @param children element to show in the body
 *  @param footer element to show in the footer
 *  @param offset offset for the drawer
 *  @param withOutPortal boolean to render the drawer outside the portal
 *  @param onBeforeOpen callback to validate if the drawer can be opened
 *  @param onAfterOpen callback to run after the drawer is opened
 *  @param onBeforeClose callback to validate if the drawer can be closed
 *  @param onAfterClose callback to run after the drawer is closed
 */
export const MyDrawer = forwardRef<DrawerHandles, MyDrawerProps>(
    (
        {
            isOpen: controlledIsOpen,
            onOpenChange,
            offset = '1rem',
            withOutPortal = false,
            trigger,
            header,
            children,
            footer,
            onBeforeOpen,
            onAfterOpen,
            onBeforeClose,
            onAfterClose,
            ...props
        },
        ref
    ) => {
        const [internalIsOpen, setInternalIsOpen] = useState(false);

        const isControlled = controlledIsOpen !== undefined;

        const open = isControlled ? controlledIsOpen : internalIsOpen;

        const offsetBreakpoint = useBreakpointValue({
            base: '0',
            md: offset
        });

        const handleOpen = useCallback(async () => {
            if (onBeforeOpen) {
                const canOpen = await onBeforeOpen();
                if (!canOpen) return;
            }

            if (!isControlled) {
                setInternalIsOpen(true);
            }
            onOpenChange?.(true);
            onAfterOpen?.();
        }, [isControlled, onBeforeOpen, onOpenChange, onAfterOpen]);

        const handleClose = useCallback(async () => {
            if (onBeforeClose) {
                const canClose = await onBeforeClose();
                if (!canClose) return;
            }

            if (!isControlled) {
                setInternalIsOpen(false);
            }
            onOpenChange?.(false);
            onAfterClose?.();
        }, [isControlled, onBeforeClose, onOpenChange, onAfterClose]);

        const handleToggle = useCallback(async () => {
            if (open) {
                await handleClose();
            } else {
                await handleOpen();
            }
        }, [open, handleClose, handleOpen]);

        const handleOpenChange = useCallback(
            async (details: { open: boolean }) => {
                if (details.open) {
                    await handleOpen();
                } else {
                    await handleClose();
                }
            },
            [handleOpen, handleClose]
        );

        // Exponemos los métodos a través del ref
        useImperativeHandle(
            ref,
            () => ({
                open: handleOpen,
                close: handleClose,
                toggle: handleToggle,
                isOpen: open
            }),
            [handleOpen, handleClose, handleToggle, open]
        );

        return (
            <Drawer.Root
                // open={open}
                // onOpenChange={handleOpenChange}
                // modal={false}
                // {...props}
                // - last version
                lazyMount
                trapFocus
                modal={false}
                open={open}
                onOpenChange={handleOpenChange}
                {...props}
            >
                {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}

                <PortalWrapper withOutPortal={withOutPortal}>
                    <Drawer.Backdrop />
                    <Drawer.Positioner padding={offsetBreakpoint}>
                        <Drawer.Content
                            rounded="md"
                            role="dialog"
                            aria-modal="true"
                        >
                            {header && (
                                <Drawer.Header>
                                    <Drawer.Title>{header}</Drawer.Title>
                                </Drawer.Header>
                            )}

                            <Drawer.Body>{children}</Drawer.Body>

                            {footer && <Drawer.Footer>{footer}</Drawer.Footer>}

                            <Drawer.CloseTrigger
                                asChild
                                position="absolute"
                                top="3"
                                right="4"
                            >
                                <CloseButton
                                    size="sm"
                                    aria-label="Cerrar drawer"
                                />
                            </Drawer.CloseTrigger>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </PortalWrapper>
            </Drawer.Root>
        );
    }
);

// Ejemplo de uso con hook personalizado
// export const useDrawer = () => {
//     const drawerRef = useRef<DrawerHandles>(null);

//     const openDrawer = useCallback(() => {
//         drawerRef.current?.open();
//     }, []);

//     const closeDrawer = useCallback(() => {
//         drawerRef.current?.close();
//     }, []);

//     const toggleDrawer = useCallback(() => {
//         drawerRef.current?.toggle();
//     }, []);

//     const isDrawerOpen = useCallback(() => {
//         return drawerRef.current?.isOpen ?? false;
//     }, []);

//     return {
//         drawerRef,
//         openDrawer,
//         closeDrawer,
//         toggleDrawer,
//         isDrawerOpen
//     };
// };
