import { useState, useCallback } from 'react';

interface FileState {
    files: File[];
    uploadProgress: number;
    isUploading: boolean;
    error: Error | null;
}

export const useFiles = () => {
    const [state, setState] = useState<FileState>({
        files: [],
        uploadProgress: 0,
        isUploading: false,
        error: null
    });

    const uploadFiles = useCallback(async (files: File[]) => {
        setState((prev) => ({ ...prev, isUploading: true }));
        try {
            // Aquí iría la lógica de subida de archivos
            setState((prev) => ({
                ...prev,
                files: [...prev.files, ...files],
                isUploading: false
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                error: error as Error,
                isUploading: false
            }));
        }
    }, []);

    const removeFile = useCallback((index: number) => {
        setState((prev) => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    }, []);

    return {
        ...state,
        uploadFiles,
        removeFile
    };
};
