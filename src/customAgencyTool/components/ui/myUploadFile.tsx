import { Button, FileUpload, VStack } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { useState, type FC } from 'react';
import { MyFlex } from './myFlex';
import { MyText } from './myText';

// Constantes para los tipos de archivo
export const ALLOWED_FILE_TYPES = {
    IMAGES: ['image/png', 'image/jpeg', 'image/jpg'] as const,
    PDF: ['application/pdf'] as const,
    EXCEL: ['application/vnd.ms-excel'] as const
} as const;

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface FileUploadProps {
    label?: string;
    accept?: readonly string[];
    maxFiles?: number;
    onChange?: (files: File[]) => void;
    onError?: (error: string) => void;
    disabled?: boolean;
    display?: 'none' | 'flex';
}

export const MyUploadFile: FC<FileUploadProps> = ({
    label = 'Subir archivo',
    accept = ALLOWED_FILE_TYPES.IMAGES,
    maxFiles = 1,
    onChange,
    onError,
    disabled = false,
    display = 'flex'
}) => {
    // Estado para manejar el mensaje de error de validación
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Limpia el error anterior al seleccionar nuevos archivos
        setValidationError(null);

        const files = event.target.files;
        if (!files?.length) return;

        const fileArray = Array.from(files);

        // Validación de tipo de archivo
        const invalidFiles = fileArray.filter(
            (file) => !accept.includes(file.type)
        );
        if (invalidFiles.length > 0) {
            const errorMsg = `Error: Tipos permitidos: ${accept
                .map((type) => type.split('/')[1].toUpperCase())
                .join(', ')}`;
            setValidationError(errorMsg); // Muestra los tipos permitidos como error
            onError?.('Error en el tipo de archivo'); // Muestra el error en el mensaje
            return;
        }

        // Validación de tamaño de archivo
        const oversizedFiles = fileArray.filter(
            (file) => file.size > MAX_FILE_SIZE_BYTES
        );
        if (oversizedFiles.length > 0) {
            const errorMsg = `Error: El tamaño máximo es de ${MAX_FILE_SIZE_MB}MB`;
            setValidationError(errorMsg);
            onError?.(errorMsg);
            return;
        }

        // Si todo es correcto
        onChange?.(fileArray);
    };

    // const getFileTypeLabel = () => {
    //     const types = accept
    //         .map((type) => type.split('/')[1].toUpperCase())
    //         .join(', ');
    //     return `Tipos permitidos: ${types}`;
    // };

    return (
        <VStack align="start" display={display}>
            <FileUpload.Root accept={[...accept]}>
                <FileUpload.HiddenInput
                    onChange={handleFileChange}
                    disabled={disabled}
                    multiple={maxFiles > 1}
                />
                <FileUpload.Trigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        colorScheme={validationError ? 'red' : 'gray'}
                        disabled={disabled}
                    >
                        <SelectedIcons iconName="UPLOAD" />
                        {label}
                    </Button>
                </FileUpload.Trigger>
            </FileUpload.Root>

            {/* Renderizado condicional del mensaje */}
            <MyFlex
                direction={'row'}
                gap={2}
                align={'center'}
                justifyContent={'space-between'}
                display={validationError ? 'flex' : 'none'}
            >
                <MyText
                    fontSize="xs"
                    // Cambia el color del texto si hay un error
                    color={validationError ? 'red.500' : 'gray.500'}
                >
                    {
                        validationError && // Muestra el error si existe
                            validationError
                        // : // Si no, muestra la información normal
                        //   `${getFileTypeLabel()} (Máx. ${MAX_FILE_SIZE_MB}MB)`}
                    }
                </MyText>
                {validationError && (
                    <Button
                        aria-label="Clear"
                        colorPalette={'red'}
                        variant={'ghost'}
                        size={'2xs'}
                        onClick={() => setValidationError(null)}
                    >
                        <SelectedIcons iconName="X" />
                    </Button>
                )}
            </MyFlex>
        </VStack>
    );
};
