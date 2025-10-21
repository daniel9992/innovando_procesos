import { MyButton } from '@src/customAgencyTool/components/ui';
import React, { useEffect } from 'react';
import type { UploadState } from '../domain/fileUploadState';
import { useFileManager } from './hook/useFileManager';
import { useMultiFileUploader } from './hook/useFileUploader';

// Pequeño componente para renderizar el estado de un solo archivo
const FileStatus: React.FC<{
    state: UploadState;
    onRetry: () => void;
}> = ({ state, onRetry }) => {
    switch (state.status) {
        case 'init':
            return <span>Starting...</span>;
        case 'loading':
            return <span>⏳ Preparando...</span>;
        case 'progress':
            return (
                <progress
                    value={state.progress}
                    max="100"
                    style={{ width: '100px', verticalAlign: 'middle' }}
                />
            );
        case 'success':
            return <span style={{ color: 'green' }}>✅ Completado</span>;
        case 'error':
            return (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}
                >
                    <span style={{ color: 'red' }}>❌ Error</span>
                    <button onClick={onRetry}>Reintentar</button>
                </div>
            );
        default:
            return null;
    }
};

export const FullFileManager: React.FC = () => {
    const {
        //
        uploadList,
        uploadFiles,
        retryUpload,
        clearUploads
    } = useMultiFileUploader('ducat_docs/001-someTestFile');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            uploadFiles(Array.from(event.target.files));
        }
    };

    return (
        <>
            <div
                style={{
                    fontFamily: 'sans-serif',
                    border: '1px solid #ccc',
                    padding: '20px',
                    borderRadius: '8px'
                }}
            >
                <h2>Carga Múltiple de Archivos</h2>
                <input type="file" multiple onChange={handleFileChange} />

                <MyButton onClick={clearUploads}>Clear Uploads</MyButton>

                {uploadList.length > 0 && (
                    <ul
                        style={{
                            listStyle: 'none',
                            padding: 0,
                            marginTop: '20px'
                        }}
                    >
                        {uploadList.map(({ id, file, state }) => (
                            <li
                                key={id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px',
                                    borderBottom: '1px solid #eee'
                                }}
                            >
                                <span
                                    style={{
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {file.name}
                                </span>
                                <FileStatus
                                    state={state}
                                    onRetry={() => retryUpload(id)}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ComponentToUseUseFileManager />
        </>
    );
};

export const ComponentToUseUseFileManager: React.FC = () => {
    const FILE_PATH = 'ducat_docs/001-someTestFile'; // La carpeta en Firebase Storage
    // 1. Usamos AMBOS hooks en el mismo componente
    const {
        //
        files,
        isLoading,
        error,
        deletingId,
        listFiles,
        deleteFile
    } = useFileManager();

    // 2. Efecto para cargar la lista inicial de archivos
    useEffect(() => {
        listFiles(FILE_PATH);
    }, [listFiles]);

    return (
        <div
            style={{
                fontFamily: 'sans-serif',
                border: '1px solid #ccc',
                padding: '20px',
                borderRadius: '8px'
            }}
        >
            <hr style={{ margin: '25px 0' }} />

            {/* SECCIÓN DE LISTADO Y BORRADO */}
            <h2>Archivos en Storage</h2>
            <MyButton onClick={() => listFiles(FILE_PATH)} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Refrescar Lista'}
            </MyButton>

            {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

            <ul
                style={{
                    listStyle: 'none',
                    padding: 0,
                    marginTop: '15px'
                }}
            >
                {files.map((file) => (
                    <li
                        key={file.id}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '8px',
                            borderBottom: '1px solid #eee'
                        }}
                    >
                        <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {file.name}
                        </a>
                        <button
                            onClick={() => deleteFile(file.id)}
                            disabled={deletingId === file.id}
                            style={{ minWidth: '80px' }}
                        >
                            {deletingId === file.id ? 'Borrando...' : 'Borrar'}
                        </button>
                    </li>
                ))}
            </ul>
            {!isLoading && files.length === 0 && (
                <p>No se encontraron archivos.</p>
            )}
        </div>
    );
};
