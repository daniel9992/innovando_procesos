import {
    AbsoluteCenter,
    Box,
    HStack,
    Image,
    Text,
    VStack
} from '@chakra-ui/react';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type DragEvent,
    type FC
} from 'react';

// Componentes custom (asumimos que existen)
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { MyButton } from './myButton';

interface UploadImageButtonProps {
    type?: 'image' | 'file';
    title: string;
    height?: string;
    maxSizeInMB?: number;
    acceptedFileTypes?: string[];
    onFileChange?: (file: File | null) => void;
}

/**
 * Component to upload an image or file
 * Optional @param type. Type of file to upload. Default is ‘image’.
 * @param title Component title. Default is ‘Profile picture’.
 * @param height Height of the component. Default is ‘12rem’.
 * @param maxSizeInMB Maximum file size allowed. Default is 5MB.
 * @param acceptedFileTypes Allowed file types. Defaults to ‘image/png’, ‘image/jpeg’ and ‘image/gif’.
 * @param onFileChange Callback function to be executed when a file is selected or the image changes.
 */

export const MyFileImgUploadStandalone: FC<UploadImageButtonProps> = ({
    type = 'image',
    title,
    height = '12rem',
    maxSizeInMB = 5,
    acceptedFileTypes = ['image/png', 'image/jpeg', 'image/gif'],
    onFileChange = () => {}
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // El hook para prevenir memory leaks se mantiene. Es una práctica de React.
    useEffect(() => {
        if (!selectedFile || type !== 'image') {
            setPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile, type]);

    // La lógica de validación consolidada también se mantiene.
    const processAndSetFile = useCallback(
        (file: File | null) => {
            setError('');
            if (!file) {
                setSelectedFile(null);
                onFileChange(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            if (file.size > maxSizeInMB * 1024 * 1024) {
                setError(`El archivo debe ser menor a ${maxSizeInMB}MB.`);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            if (!acceptedFileTypes.includes(file.type)) {
                setError(
                    `Tipo de archivo no permitido. Use: ${acceptedFileTypes
                        .map((t) => t.split('/')[1])
                        .join(', ')}`
                );
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }
            setSelectedFile(file);
            onFileChange(file);
        },
        [acceptedFileTypes, maxSizeInMB, onFileChange]
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        processAndSetFile(event.target.files?.[0] ?? null);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        processAndSetFile(event.dataTransfer.files?.[0] ?? null);
    };

    const acceptAttr = acceptedFileTypes.join(',');
    const ruleText = acceptedFileTypes
        .map((t) => t.split('/')[1])
        .join(', ');

    return (
        // Usamos un Box como contenedor principal en lugar de Form.Root
        <Box width="100%">
            <Box
                position="relative"
                width="100%"
                height={height}
                border="2px dashed"
                // --- MEJORA: Estilo de borde condicional manejado manualmente ---
                borderColor={error ? 'red.500' : 'gray'}
                borderRadius="md"
                cursor="pointer"
                overflow="hidden"
                _hover={{
                    borderColor: error ? 'red.600' : 'blue.500'
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleChange}
                    accept={acceptAttr}
                    style={{ display: 'none' }}
                />

                {previewUrl && type === 'image' ? (
                    <>
                        <Image
                            src={previewUrl}
                            alt={selectedFile?.name || 'Previsualización'}
                            width="100%"
                            height="100%"
                            objectFit="cover"
                        />
                        <HStack position="absolute" top="2" right="2">
                            <MyButton
                                size="sm"
                                colorPalette="gray"
                                aria-label="Cambiar imagen"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                <SelectedIcons
                                    iconName="UPLOAD"
                                    size={20}
                                />
                            </MyButton>
                            <MyButton
                                size="sm"
                                colorPalette="red"
                                aria-label="Eliminar imagen"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    processAndSetFile(null);
                                }}
                            >
                                <SelectedIcons
                                    iconName="TRASH"
                                    size={20}
                                />
                            </MyButton>
                        </HStack>
                    </>
                ) : selectedFile && type === 'file' ? (
                    <>
                        <AbsoluteCenter as={VStack} p="4">
                            <SelectedIcons
                                iconName="FILE"
                                size={40}
                                color="fg.subtle"
                            />
                            <Text fontSize="sm" fontWeight="medium">
                                {selectedFile.name}
                            </Text>
                        </AbsoluteCenter>
                        <MyButton
                            size="sm"
                            colorPalette="red"
                            position="absolute"
                            top="2"
                            right="2"
                            aria-label="Eliminar archivo"
                            onClick={(e) => {
                                e.stopPropagation();
                                processAndSetFile(null);
                            }}
                        >
                            <SelectedIcons iconName="TRASH" size={20} />
                        </MyButton>
                    </>
                ) : (
                    <AbsoluteCenter as={VStack} p="4" textAlign="center">
                        <SelectedIcons
                            iconName="UPLOAD"
                            size={30}
                            color="fg.muted"
                        />
                        <Text fontWeight="medium">{title}</Text>
                        <Text color="fg.subtle" fontSize="sm">
                            Arrastra o haz clic para subir
                        </Text>
                        <Text
                            color="fg.subtle"
                            fontSize="xs"
                        >{`Tipos: ${ruleText} | Max: ${maxSizeInMB}MB`}</Text>
                    </AbsoluteCenter>
                )}
            </Box>

            {/* --- MEJORA: Mensaje de error renderizado condicionalmente --- */}
            {error && (
                <HStack color="red.500" mt="2" fontSize="sm">
                    <SelectedIcons iconName="ERROR" size={16} />
                    <Text>{error}</Text>
                </HStack>
            )}
        </Box>
    );
};
