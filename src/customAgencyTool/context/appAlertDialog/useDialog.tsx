import { useCallback, useContext } from 'react';
import { DialogContext } from './alertDialogContext';

/**
 *  useDialog
 *  Hook to access the DialogContext
 * @returns DialogContextType
 *  Example of use
 *  const { showDialog } = useDialog();
 *  const handleOnClick = async () => {
 * 		const result = await showDialog({
 * 			title: '¿Deseas continuar?',
 * 			message: (
 * 				<>
 * 					<p>Esta acción no se puede deshacer.</p>
 * 					<p>¿Estás seguro?</p>
 * 				</>
 * 			),
 * 			buttons: [
 * 				{ label: 'Cancelar', colorPalette: 'green', value: false },
 * 				{
 * 					label: 'Confirmar',
 * 					colorPalette: 'red',
 * 					isDestructive: true,
 * 					iconLeft: 'TRASH',
 * 					value: true,
 * 				},
 * 			],
 * 		});
 * 		console.log('Resultado:', result); // true or false
 * 	};
 */
export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

/**
 *  useConfirmDialog
 *  Hook to access the DialogContext
 * @returns DialogContextType
 *  Example of use
 *  const confirm = useConfirmDialog();
 *  const handleOnClick = async () => {
 * 		if (await confirm(
 *     "Confirmar acción",
 *     "¿Deseas continuar?",
 *     "Sí, continuar",
 *     "No, cancelar"
 *   )) {
 *     console.log("Acción confirmada");
 *   }
 * 	};
 */
export const useConfirmDialog = () => {
  const dialog = useDialog();

  return useCallback(
    async (
      title: string,
      message: string,
      confirmLabel = 'Confirmar',
      cancelLabel = 'Cancelar'
    ) => {
      return await dialog.showDialog({
        title,
        message,
        buttons: [
          {
            label: cancelLabel,
            value: false,
            variant: 'outline'
          },
          {
            label: confirmLabel,
            value: true,
            colorPalette: 'blue'
          }
        ]
      });
    },
    [dialog]
  );
};

/*
const dialog = useDialog();

  const handleClick = async () => {
    const result = await dialog.showDialog({
      title: "Confirmar acción",
      message: "¿Estás seguro de que deseas continuar?",
      buttons: [
        {
          label: "Cancelar",
          value: false,
          variant: "outline"
        },
        {
          label: "Confirmar",
          value: true,
          colorScheme: "blue"
        }
      ]
    });

    if (result === true) {
      // Usuario confirmó
      console.log("Acción confirmada");
    }
  };

  return <Button onClick={handleClick}>Mostrar Diálogo</Button>;
};
*/

/**
const confirm = useConfirmDialog();

  const handleAction = async () => {
    if (await confirm(
      "Confirmar acción",
      "¿Deseas continuar?",
      "Sí, continuar",
      "No, cancelar"
    )) {
      // Usuario confirmó
    }
 */
