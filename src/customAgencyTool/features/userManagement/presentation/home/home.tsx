import {
    MyButton,
    MyDragAndDropZone,
    MyFlex
} from '@src/customAgencyTool/components/ui';
import type {
    FileMetadataLight,
    UploadState
} from '@src/customAgencyTool/features/storageFiles/domain/fileUploadState';
import { firebaseStorageFilesRepository } from '@src/customAgencyTool/features/storageFiles/infrastructure/compositionRoot';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Un tipo para el mapa de progreso
type UploadProgressMap = { [fileName: string]: UploadState };

export const SimpleExample = () => {
    // 🧠 Usamos useMemo para asegurar que la instancia del repo no cambie en cada render
    const uploaderRepo = useMemo(() => firebaseStorageFilesRepository, []);

    // --- ESTADOS DEL COMPONENTE ---
    const [files, setFiles] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<UploadProgressMap>({});
    const [uploadResult, setUploadResult] = useState<
        FileMetadataLight[] | null
    >(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // ✅ CORRECTO: Este useEffect se encarga de escuchar el progreso globalmente.
    // Se monta una vez y se desmonta al final.
    useEffect(() => {
        console.log('🔌 Suscripción de progreso activada.');
        const progressSubscription = uploaderRepo.individualProgress$.subscribe(
            (progressMap) => {
                setUploadProgress(progressMap); // Actualizamos el estado para la UI
            }
        );

        return () => {
            console.log('🔌 Suscripción de progreso desactivada.');
            progressSubscription.unsubscribe();
        };
    }, [uploaderRepo]); // Dependemos de la instancia del repo

    // --- MANEJADORES DE EVENTOS ---

    // Función que se llama cuando el usuario suelta los archivos
    const handleOnDrop = useCallback((droppedFiles: FileList) => {
        const tempFiles = Array.from(droppedFiles);
        setFiles(tempFiles);
        // Limpiamos resultados anteriores al seleccionar nuevos archivos
        setUploadResult(null);
        setUploadError(null);
    }, []);

    // 🚀 MEJORA: La lógica de subida ahora está en un manejador de evento, no en un useEffect.
    // Esto le da el control al usuario.
    const handleUpload = () => {
        if (files.length === 0) return;

        setIsUploading(true);
        setUploadError(null);
        setUploadResult(null);

        uploaderRepo.uploadFiles(files, 'ducat_docs/q3').subscribe({
            next: (finalMetadata) => {
                console.log('✅✅✅ ¡Éxito!', finalMetadata);
                setUploadResult(finalMetadata);
            },
            error: (error) => {
                console.error('❌❌❌ ¡Error!', error);
                setUploadError(
                    error.message || 'Ocurrió un error desconocido.'
                );
                setIsUploading(false);
            },
            complete: () => {
                console.log('🏁 Proceso finalizado.');
                setIsUploading(false);
            }
        });
    };

    const handleClear = () => {
        setFiles([]);
        setUploadProgress({});
        setUploadResult(null);
        setUploadError(null);
    };

    // --- RENDERIZADO ---
    return (
        <MyDragAndDropZone onDrop={handleOnDrop}>
            <h2>Gestor de Archivos</h2>
            <>
                <MyFlex>
                    <p>Arrastra tus archivos aquí o haz clic.</p>
                </MyFlex>
            </>

            {files.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Archivos listos para subir:</h4>
                    <ul>
                        {files.map((file) => (
                            <li key={file.name}>{file.name}</li>
                        ))}
                    </ul>
                    <MyButton onClick={handleUpload} disabled={isUploading}>
                        {isUploading
                            ? 'Subiendo...'
                            : `Subir ${files.length} archivos`}
                    </MyButton>
                    <MyButton
                        onClick={handleClear}
                        disabled={isUploading}
                        style={{ marginLeft: '10px' }}
                    >
                        Limpiar
                    </MyButton>
                </div>
            )}

            {/* --- SECCIÓN DE PROGRESO Y RESULTADOS --- */}
            {isUploading && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Progreso:</h4>
                    {Object.entries(uploadProgress).map(([fileName, state]) => (
                        <p key={fileName}>
                            📄 {fileName}: {renderStatusMessage(state)}
                        </p>
                    ))}
                </div>
            )}

            {uploadError && (
                <p style={{ color: 'red', marginTop: '20px' }}>
                    Error: {uploadError}
                </p>
            )}

            {uploadResult && (
                <div style={{ marginTop: '20px', color: 'green' }}>
                    <p>¡Subida completada con éxito!</p>
                    <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
                </div>
            )}
        </MyDragAndDropZone>
    );
};

// Función helper para no ensuciar el JSX
const renderStatusMessage = (state: UploadState): string => {
    switch (state.status) {
        case 'init':
            return 'Pendiente...';
        case 'loading':
            return '🔄 Cargando...';
        case 'progress':
            return `⏳ ${state.progress}%`;
        case 'success':
            return '✅ Subido!';
        case 'error':
            return `❌ Error: ${state.error.message}`;
        default:
            return '';
    }
};

const UserManagementPage = () => {
    return <div>User Management</div>;
};

export default UserManagementPage;
