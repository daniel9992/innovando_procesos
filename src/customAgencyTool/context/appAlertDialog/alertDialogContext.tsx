import { MyDialog } from '@src/customAgencyTool/components/ui/myDialog';
import { createContext, useCallback, useState } from 'react';

type DialogValue = string | boolean | null;

interface DialogButton {
  label: string;
  value: DialogValue;
  colorPalette?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  iconLeft?: string;
  iconRight?: string;
}

interface DialogOptions {
  title: string;
  message: string | React.ReactNode;
  buttons: DialogButton[];
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => Promise<DialogValue>;
}

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);

interface DialogProviderProps {
  children: React.ReactNode;
}

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    options: DialogOptions | null;
  }>({
    isOpen: false,
    options: null
  });

  const [resolver, setResolver] = useState<
    ((value: DialogValue) => void) | null
  >(null);

  const showDialog = useCallback(
    (options: DialogOptions): Promise<DialogValue> => {
      return new Promise((resolve) => {
        setDialogState({
          isOpen: true,
          options
        });
        setResolver(() => resolve);
      });
    },
    []
  );

  const handleClose = (value: DialogValue) => {
    setDialogState((prev) => ({ ...prev, isOpen: false }));
    resolver?.(value);
    setResolver(null);
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      {dialogState.options && (
        <MyDialog
          isOpen={dialogState.isOpen}
          onClose={() => handleClose(null)}
          header={dialogState.options.title}
          body={dialogState.options.message}
          size={dialogState.options.size}
          closeOnOverlayClick={dialogState.options.closeOnOverlayClick}
          buttons={dialogState.options.buttons.map((button) => ({
            label: button.label,
            colorPalette: button.colorPalette,
            variant: button.variant,
            iconLeft: button.iconLeft,
            iconRight: button.iconRight,
            onClick: () => handleClose(button.value)
          }))}
        />
      )}
    </DialogContext.Provider>
  );
};

// import {
// 	AlertDialog,
// 	AlertDialogBody,
// 	AlertDialogContent,
// 	AlertDialogFooter,
// 	AlertDialogHeader,
// 	AlertDialogOverlay,
// 	Button,
// 	Text,
// } from '@chakra-ui/react';
// import { MyText } from '@src/customAgencyTool/components/ui';
// import { MyDialog, type DialogButtonProps } from '@src/customAgencyTool/components/ui/myDialog';
// import { typeIcons } from '@tool/utils/iconSelected/iconTypes';
// import { SelectedIcons } from '@tool/utils/iconSelected/setIcon';
// import React, {
// 	createContext,
// 	type ReactNode,
// 	useCallback,
// 	useRef,
// 	useState,
// } from 'react';

// // Interfaces

// type ButtonValue = string | boolean | null;

// export interface DialogOptions {
//   title: string;
//   message: string | ReactNode;
//   buttons: DialogButtonProps[];
// }

// export interface DialogContextType {
// 	showDialog: (options: DialogOptions) => Promise<ButtonValue>;
// }

// export const DialogContext = createContext<DialogContextType | undefined>(
// 	undefined
// );

// interface DialogState extends DialogOptions {
// 	isOpen: boolean;
// }

// interface DialogProviderProps {
// 	children: React.ReactNode;
// }

// export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
// 	const [dialogState, setDialogState] = useState<DialogState>({
// 		isOpen: false,
// 		title: '',
// 		message: '',
// 		buttons: [],
// 	});

// 	const cancelRef = useRef<HTMLButtonElement>(null);
// 	const [resolver, setResolver] = useState<
// 		((value: ButtonValue) => void) | null
// 	>(null);

// 	const showDialog = useCallback(
// 		(options: DialogOptions): Promise<ButtonValue> => {
// 			return new Promise((resolve) => {
// 				setDialogState({
// 					isOpen: true,
// 					...options,
// 				});
// 				setResolver(() => resolve);
// 			});
// 		},
// 		[]
// 	);

// 	const handleClose = (value: ButtonValue) => {
// 		setDialogState((prev) => ({ ...prev, isOpen: false }));
// 		resolver?.(value);
// 	};

// 	return (
// 		<MyDialog
// 			isOpen={dialogState.isOpen}
// 			onClose={() => handleClose(null)}
// 			header={dialogState.title}
// 			body={
// 				typeof dialogState.message === 'string' ? (
// 				<MyText>{dialogState.message}</MyText>
// 			) : (
// 				dialogState.message
// 			)}
// 			buttons={dialogState.buttons}

// 		/>
// 		// <DialogContext.Provider value={{ showDialog }}>
// 		// 	{children}
// 		// 	<AlertDialog
// 		// 		isOpen={dialogState.isOpen}
// 		// 		leastDestructiveRef={cancelRef}
// 		// 		onClose={() => handleClose(null)}
// 		// 		isCentered
// 		// 	>
// 		// 		<AlertDialogOverlay>
// 		// 			<AlertDialogContent>
// 		// 				<AlertDialogHeader fontSize='lg' fontWeight='bold'>
// 		// 					{dialogState.title}
// 		// 				</AlertDialogHeader>
// 		// 				<AlertDialogBody>
// 							// {typeof dialogState.message === 'string' ? (
// 							// 	<Text>{dialogState.message}</Text>
// 							// ) : (
// 							// 	dialogState.message
// 							// )}
// 		// 				</AlertDialogBody>
// 		// 				<AlertDialogFooter>
// 		// 					{dialogState.buttons.map((btn, idx) => (
// 		// 						<Button
// 		// 							key={`dialog-btn-${idx}`}
// 		// 							onClick={() => handleClose(btn.value)}
// 		// 							colorScheme={btn.colorScheme}
// 		// 							variant={btn.isDestructive ? 'solid' : 'outline'}
// 		// 							ml={idx > 0 ? 3 : 0}
// 		// 							ref={idx === 0 ? cancelRef : undefined}
// 		// 							leftIcon={
// 		// 								btn.iconLeft ? (
// 		// 									<SelectedIcons iconName={btn.iconLeft} />
// 		// 								) : undefined
// 		// 							}
// 		// 							rightIcon={
// 		// 								btn.iconRight ? (
// 		// 									<SelectedIcons iconName={btn.iconRight} />
// 		// 								) : undefined
// 		// 							}
// 		// 						>
// 		// 							{btn.label}
// 		// 						</Button>
// 		// 					))}
// 		// 				</AlertDialogFooter>
// 		// 			</AlertDialogContent>
// 		// 		</AlertDialogOverlay>
// 		// 	</AlertDialog>
// 		// </DialogContext.Provider>
// 	);
// };
