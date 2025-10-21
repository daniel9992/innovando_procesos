import {
    CloseButton,
    Dialog,
    useBreakpointValue,
    type UseDialogProps
} from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { type ReactNode } from 'react';
import LoadingSpinnerWithText from '../loading/loadingSpinnerWithText';
import { MyButton } from './myButton';
import { MyFlex } from './myFlex';
import { PortalWrapper } from './portalWrapperProps';

export interface DialogButtonProps {
    label: string;
    colorPalette?: string;
    variant?: 'solid' | 'outline' | 'ghost';
    onClick: () => void;
    iconLeft?: string;
    iconRight?: string;
    isDisabled?: boolean;
    isLoading?: boolean;
}

interface MyDialogProps extends Omit<UseDialogProps, 'children'> {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    header: string | ReactNode;
    body: string | ReactNode;
    buttons?: Array<DialogButtonProps>;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
    closeOnOverlayClick?: boolean;
    showCloseButton?: boolean;
    headerActions?: ReactNode;
    placement?: 'top' | 'center' | 'bottom';
    height?: string;
    iconHeader?: string;
    isScreenLoading?: boolean;
    withOutPortal?: boolean;
    maxHeight?: string;
}

export const MyDialog = ({
    isOpen,
    onClose,
    header,
    body,
    buttons = [],
    size = 'lg',
    closeOnOverlayClick = true,
    showCloseButton = true,
    isScreenLoading = false,
    headerActions,
    placement = 'center',
    height = 'auto',
    iconHeader,
    withOutPortal = false,
    maxHeight = '75vh',
    ...props
}: MyDialogProps) => {
    const breakDefault = useBreakpointValue({
        base: 'full',
        md: size
    });

    type TypeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

    const sizeBreakpoint = breakDefault
        ? (breakDefault as TypeSize)
        : (size as TypeSize);

    return (
        <Dialog.Root
            // open={isOpen}
            // onOpenChange={(e) => onClose(e.open)}
            // size={sizeBreakpoint}
            // placement={placement}
            // // alertdialog - no permite cerrar el dialo si se selecciona algo fuera del dialog
            // modal={false} // me permite seleccionar algo fuera del Dialog sin que se cierre
            // {...props}

            // - last version
            // lazyMount
            // role="dialog"
            trapFocus
            open={isOpen}
            onOpenChange={(e) => onClose(e.open)}
            size={sizeBreakpoint}
            placement={placement}
            modal={false}
            {...props}
        >
            <PortalWrapper withOutPortal={withOutPortal}>
                <Dialog.Backdrop
                    onClick={() => closeOnOverlayClick && onClose(false)}
                />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header
                            alignContent={'center'}
                            alignItems={'center'}
                        >
                            {iconHeader && (
                                <SelectedIcons
                                    iconName={iconHeader}
                                    size={'25px'}
                                />
                            )}
                            <Dialog.Title>{header}</Dialog.Title>
                            {headerActions}
                            {showCloseButton && (
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton
                                        size="sm"
                                        position="absolute"
                                        right="4"
                                        top="4"
                                    />
                                </Dialog.CloseTrigger>
                            )}
                        </Dialog.Header>

                        <Dialog.Body
                            height={height}
                            //
                            maxHeight={maxHeight}
                            overflowY={'auto'}
                            paddingTop={3}
                        >
                            {isScreenLoading ? (
                                <MyFlex
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    h={'50vh'}
                                >
                                    <LoadingSpinnerWithText
                                        text={'Cargando...'}
                                    />
                                </MyFlex>
                            ) : (
                                <>
                                    {typeof body === 'string' ? (
                                        <div
                                            style={{
                                                whiteSpace: 'pre-line'
                                            }}
                                        >
                                            {body}
                                        </div>
                                    ) : (
                                        body
                                    )}
                                </>
                            )}
                        </Dialog.Body>
                        <Dialog.Footer gap="3">
                            {buttons.map((button, index) => (
                                <MyButton
                                    key={`dialog-button-${index}`}
                                    colorPalette={button.colorPalette}
                                    variant={button.variant || 'solid'}
                                    onClick={button.onClick}
                                    isDisabled={button.isDisabled}
                                    loading={button.isLoading}
                                >
                                    {button.iconLeft ? (
                                        <SelectedIcons
                                            iconName={button.iconLeft}
                                        />
                                    ) : undefined}
                                    {button.label}
                                    {button.iconRight ? (
                                        <SelectedIcons
                                            iconName={button.iconRight}
                                        />
                                    ) : undefined}
                                </MyButton>
                            ))}
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </PortalWrapper>
        </Dialog.Root>
    );
};

MyDialog.displayName = 'MyDialog';

// import {
//     CloseButton,
//     Dialog,
//     Portal,
//     useBreakpointValue,
//     type UseDialogProps
// } from '@chakra-ui/react';
// import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
// import {
//     forwardRef,
//     useImperativeHandle,
//     useState,
//     type ReactNode
// } from 'react';
// import { MyButton } from './myButton';

// export interface DialogButtonProps {
//     label: string;
//     colorPalette?: string;
//     variant?: 'solid' | 'outline' | 'ghost';
//     onClick: () => void;
//     iconLeft?: string;
//     iconRight?: string;
//     isDisabled?: boolean;
//     isLoading?: boolean;
// }

// interface MyDialogProps extends Omit<UseDialogProps, 'children'> {
//     onBeforeOpen?: () => Promise<boolean>;
//     onOpen?: () => void;
//     onClose?: () => void;
//     header: string | ReactNode;
//     body: string | ReactNode;
//     buttons?: Array<DialogButtonProps>;
//     size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
//     closeOnOverlayClick?: boolean;
//     showCloseButton?: boolean;
//     headerActions?: ReactNode;
//     placement?: 'top' | 'center' | 'bottom';
//     height?: string;
//     iconHeader?: string;
// }

// export interface MyDialogRef {
//     open: () => Promise<void>;
//     close: () => void;
//     toggle: () => void;
// }

// export const MyDialog = forwardRef<MyDialogRef, MyDialogProps>(
//     (
//         {
//             onBeforeOpen,
//             onOpen,
//             onClose,
//             header,
//             body,
//             buttons = [],
//             size = 'lg',
//             closeOnOverlayClick = true,
//             showCloseButton = true,
//             headerActions,
//             placement = 'center',
//             height = 'auto',
//             iconHeader,
//             ...props
//         },
//         ref
//     ) => {
//         const [isOpen, setIsOpen] = useState(false);

//         const breakDefault = useBreakpointValue({
//             base: 'full',
//             md: size
//         });

//         type TypeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
//         const sizeBreakpoint = breakDefault
//             ? (breakDefault as TypeSize)
//             : (size as TypeSize);

//         useImperativeHandle(ref, () => ({
//             open: async () => {
//                 if (onBeforeOpen) {
//                     const canOpen = await onBeforeOpen();
//                     if (!canOpen) return;
//                 }
//                 setIsOpen(true);
//                 onOpen?.();
//             },
//             close: () => {
//                 setIsOpen(false);
//                 onClose?.();
//             },
//             toggle: () => {
//                 setIsOpen((prev) => {
//                     const newState = !prev;
//                     if (newState) {
//                         onOpen?.();
//                     } else {
//                         onClose?.();
//                     }
//                     return newState;
//                 });
//             }
//         }));

//         return (
//             <Dialog.Root
//                 lazyMount
//                 open={isOpen}
//                 onOpenChange={(e) => {
//                     if (!e.open) {
//                         setIsOpen(false);
//                         onClose?.();
//                     }
//                 }}
//                 size={sizeBreakpoint}
//                 placement={placement}
//                 modal={false}
//                 {...props}
//             >
//                 <Portal>
//                     <Dialog.Backdrop
//                         onClick={() => {
//                             if (closeOnOverlayClick) {
//                                 setIsOpen(false);
//                                 onClose?.();
//                             }
//                         }}
//                     />
//                     <Dialog.Positioner>
//                         <Dialog.Content>
//                             <Dialog.Header
//                                 alignContent={'center'}
//                                 alignItems={'center'}
//                             >
//                                 {iconHeader && (
//                                     <SelectedIcons
//                                         iconName={iconHeader}
//                                         size={'25px'}
//                                     />
//                                 )}
//                                 <Dialog.Title>{header}</Dialog.Title>
//                                 {headerActions}
//                                 {showCloseButton && (
//                                     <Dialog.CloseTrigger asChild>
//                                         <CloseButton
//                                             size="sm"
//                                             position="absolute"
//                                             right="4"
//                                             top="4"
//                                         />
//                                     </Dialog.CloseTrigger>
//                                 )}
//                             </Dialog.Header>

//                             <Dialog.Body height={height}>
//                                 {typeof body === 'string' ? (
//                                     <div style={{ whiteSpace: 'pre-line' }}>
//                                         {body}
//                                     </div>
//                                 ) : (
//                                     body
//                                 )}
//                             </Dialog.Body>

//                             <Dialog.Footer gap="3">
//                                 {buttons.map((button, index) => (
//                                     <MyButton
//                                         key={`dialog-button-${index}`}
//                                         colorPalette={button.colorPalette}
//                                         variant={button.variant || 'solid'}
//                                         onClick={button.onClick}
//                                         isDisabled={button.isDisabled}
//                                         loading={button.isLoading}
//                                     >
//                                         {button.iconLeft ? (
//                                             <SelectedIcons
//                                                 iconName={button.iconLeft}
//                                             />
//                                         ) : undefined}
//                                         {button.label}
//                                         {button.iconRight ? (
//                                             <SelectedIcons
//                                                 iconName={button.iconRight}
//                                             />
//                                         ) : undefined}
//                                     </MyButton>
//                                 ))}
//                             </Dialog.Footer>
//                         </Dialog.Content>
//                     </Dialog.Positioner>
//                 </Portal>
//             </Dialog.Root>
//         );
//     }
// );

// MyDialog.displayName = 'MyDialog';

// const dialogRef = useRef<MyDialogRef>(null);

// // Abrir el diálogo
// dialogRef.current?.open();

// // Cerrar el diálogo
// dialogRef.current?.close();

// // Alternar estado
// dialogRef.current?.toggle();

// return (
//     <MyDialog
//         ref={dialogRef}
//         header="Título"
//         body="Contenido"
//         onBeforeOpen={async () => true}
//         onOpen={() => console.log('Abierto')}
//         onClose={() => console.log('Cerrado')}
//     />
// );
