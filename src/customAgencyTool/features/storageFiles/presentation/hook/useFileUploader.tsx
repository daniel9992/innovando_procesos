import { useEffect, useRef, useState } from 'react';

import { Subject, Subscription } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import type { UploadState } from '../../domain/fileUploadState';
import { uploadFileUseCase } from '../../infrastructure/compositionRoot';

const FILE_PATH = 'ducat_docs/001-someTestFile'; // La carpeta en Firebase Storage

export const useFileUploader = () => {
    const [uploadState, setUploadState] = useState<UploadState>({
        status: 'init'
    });
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    const uploadFile = (file: File) => {
        // Si hay una subida anterior, la cancelamos antes de empezar una nueva.
        if (subscription) {
            subscription.unsubscribe();
        }

        const newSubscription = uploadFileUseCase
            .execute(file, FILE_PATH)
            .subscribe({
                next: (state) => setUploadState(state),
                error: (errorState) => setUploadState(errorState)
            });

        setSubscription(newSubscription);
    };

    const cancelUpload = () => {
        if (subscription) {
            subscription.unsubscribe();
            setSubscription(null);
        }
    };

    // Limpieza al desmontar el componente
    useEffect(() => {
        return () => {
            subscription?.unsubscribe();
        };
    }, [subscription]);

    return { uploadState, uploadFile, cancelUpload };
};

// Estado para cada archivo individual en la lista de subida
export interface FileUploadProgress {
    id: string; // Un ID único para cada archivo
    file: File;
    state: UploadState;
}

export const useMultiFileUploader = (pathPath: string) => {
    const [uploads, setUploads] = useState<Map<string, FileUploadProgress>>(
        new Map()
    );

    // Usamos useRef para los Subjects para que no se recreen en cada render
    const uploadRequest$ = useRef(new Subject<FileUploadProgress>());

    const updateUploadState = (id: string, state: UploadState) => {
        setUploads((prevMap) => {
            const newMap = new Map(prevMap);
            const currentUpload = newMap.get(id);
            if (currentUpload) {
                newMap.set(id, { ...currentUpload, state });
            }
            return newMap;
        });
    };

    useEffect(() => {
        const subscription = uploadRequest$.current
            .pipe(
                // Usamos mergeMap para procesar subidas en paralelo (con un límite de 3 a la vez)
                mergeMap((uploadProgress) => {
                    const { id, file } = uploadProgress;
                    return uploadFileUseCase.execute(file, pathPath).pipe(
                        tap((state) => updateUploadState(id, state)), // Actualiza el estado en cada emisión
                        catchError((error) => {
                            // El error ya se maneja en el observable de 'upload', pero aquí lo atrapamos por si acaso
                            updateUploadState(id, {
                                status: 'error',
                                error: error as Error
                            });
                            return []; // No propagar el error para no detener el stream principal
                        })
                    );
                }, 3)
            )
            .subscribe();

        return () => subscription.unsubscribe();
    }, [pathPath]);

    const uploadFiles = (files: File[]) => {
        const newUploads = new Map<string, FileUploadProgress>();
        for (const file of files) {
            // Creamos un ID único combinando nombre y última modificación
            const id = `${file.name}-${file.lastModified}`;
            const newUpload: FileUploadProgress = {
                id,
                file,
                state: { status: 'loading' } // Estado inicial
            };
            newUploads.set(id, newUpload);
            // Enviamos cada archivo a la cola de subida de RxJS
            uploadRequest$.current.next(newUpload);
        }
        setUploads(newUploads);
    };

    const retryUpload = (id: string) => {
        const uploadToRetry = new Map(uploads).get(id);
        if (uploadToRetry) {
            uploadRequest$.current.next(uploadToRetry);
        }
    };

    // Convertimos el Map a un Array para que sea más fácil de renderizar
    const uploadList = Array.from(uploads.values());

    const clearUploads = () => {
        console.log('Clearing uploads...');
        uploads.clear();
        uploadList.length = 0;
    };

    return { uploadList, uploadFiles, retryUpload, clearUploads };
};
