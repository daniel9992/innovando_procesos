import { useCallback, useState } from 'react';
import type { FileMetadataLight } from '../../domain/fileUploadState';
import {
    deleteFileUseCase,
    listFilesUseCase
} from '../../infrastructure/compositionRoot';

export const useFileManager = () => {
    const [files, setFiles] = useState<FileMetadataLight[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Opcional: para mostrar un spinner en el item específico que se está borrando
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const listFiles = useCallback(async (path: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const fileList = await listFilesUseCase.execute(path);
            setFiles(fileList);
        } catch (e) {
            setError(e as Error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteFile = useCallback(async (id: string) => {
        setDeletingId(id);
        setError(null);
        try {
            await deleteFileUseCase.execute(id);
            // Actualiza el estado local para reflejar el borrado SIN volver a llamar a la API.
            // Esto da una respuesta instantánea en la UI.
            setFiles((currentFiles) =>
                currentFiles.filter((file) => file.id !== id)
            );
        } catch (e) {
            setError(e as Error);
        } finally {
            setDeletingId(null);
        }
    }, []);

    return {
        files,
        isLoading,
        error,
        deletingId,
        listFiles,
        deleteFile
    };
};
