// src/hooks/useFileUploader.ts
import { useEffect, useRef, useState } from 'react';
import { Subject, from, merge, of } from 'rxjs';
import {
    catchError,
    concatMap,
    delay,
    map,
    startWith,
    tap
} from 'rxjs/operators';

// src/types.ts
export interface FileUploadState {
    url: string;
    fileName: string;
    status: 'loading' | 'success' | 'error';
    progress?: number; // Opcional para mostrar el progreso
    error?: string; // Mensaje de error
}

// La función simulada de API no cambia
const uploadFileApi = (file: File) => {
    const randomSuccess = Math.random() > 0.3;
    const randomDelay = Math.random() * 2000 + 1000;

    return of(file).pipe(
        delay(randomDelay),
        map(() => {
            if (!randomSuccess) {
                throw new Error(`Fallo simulado`);
            }
            return {
                url: `https://picsum.photos/200/300?random=${Math.random()}`,
                fileName: file.name,
                status: 'success' as const,
                progress: 100
            };
        }),
        catchError((error: Error) =>
            of({
                url: '',
                fileName: file.name,
                status: 'error' as const,
                error: error.message
            })
        ),
        startWith({
            url: '',
            fileName: file.name,
            status: 'loading' as const,
            progress: 0
        })
    );
};

export const useFileUploader = () => {
    const [fileStates, setFileStates] = useState<
        Map<string, FileUploadState>
    >(new Map());
    const fileStore = useRef<Map<string, File>>(new Map());

    // Subjects para iniciar cargas y reintentos
    const upload$ = useRef(new Subject<File[]>());
    const retry$ = useRef(new Subject<File>());

    useEffect(() => {
        const updateState = (newState: FileUploadState) => {
            setFileStates((currentStates) => {
                const newStates = new Map(currentStates);
                newStates.set(newState.fileName, newState);
                return newStates;
            });
        };

        // Observable que procesa un único archivo
        const processFile$ = (file: File) =>
            uploadFileApi(file).pipe(tap(updateState));

        // Stream para la carga inicial de una lista de archivos
        const initialUpload$ = upload$.current.pipe(
            concatMap((files) => from(files)), // Emite cada archivo de la lista
            concatMap(processFile$) // Procesa cada archivo uno por uno
        );

        // Stream para los reintentos de archivos individuales
        const retryUpload$ = retry$.current.pipe(concatMap(processFile$));

        // Se combinan ambos streams para que el componente reaccione a ambos
        const subscription = merge(
            initialUpload$,
            retryUpload$
        ).subscribe();

        return () => subscription.unsubscribe();
    }, []);

    const uploadFiles = (files: FileList) => {
        const fileArray = Array.from(files);
        const initialStates = new Map<string, FileUploadState>();

        fileArray.forEach((file) => {
            fileStore.current.set(file.name, file); // Guarda el archivo para un posible reintento
            initialStates.set(file.name, {
                url: '',
                fileName: file.name,
                status: 'loading',
                progress: 0
            });
        });

        setFileStates(initialStates);
        upload$.current.next(fileArray);
    };

    const retryUpload = (fileName: string) => {
        const fileToRetry = fileStore.current.get(fileName);
        if (fileToRetry) {
            retry$.current.next(fileToRetry); // Emite el archivo al stream de reintentos
        }
    };

    // Devuelve el estado como un array para facilitar el renderizado
    return {
        fileStates: Array.from(fileStates.values()),
        uploadFiles,
        retryUpload
    };
};

export const FileUploadSimulator: React.FC = () => {
    const { fileStates, uploadFiles, retryUpload } = useFileUploader();

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files && event.target.files.length > 0) {
            uploadFiles(event.target.files);
            // Limpia el valor para poder seleccionar los mismos archivos de nuevo
            event.target.value = '';
        }
    };

    const renderFileStatus = (file: FileUploadState) => {
        switch (file.status) {
            case 'loading':
                return <span>⏳ Cargando...</span>;
            case 'success':
                return <span style={{ color: 'green' }}>✅ Subido</span>;
            case 'error':
                return (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}
                    >
                        <span style={{ color: 'red' }}>
                            ❌ Error: {file.error}
                        </span>
                        <button onClick={() => retryUpload(file.fileName)}>
                            Reintentar
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <h2>Simulador de Carga con RxJS y Reintento</h2>
            <input type="file" multiple onChange={handleFileChange} />

            {fileStates.length > 0 && (
                <ul
                    style={{
                        listStyleType: 'none',
                        padding: 0,
                        marginTop: '20px'
                    }}
                >
                    {fileStates.map((file) => (
                        <li
                            key={file.fileName}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px',
                                borderBottom: '1px solid #eee'
                            }}
                        >
                            <span>{file.fileName}</span>
                            <span
                                style={{
                                    fontSize: '0.5rem'
                                }}
                            >
                                {file.url}
                            </span>
                            {renderFileStatus(file)}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};
