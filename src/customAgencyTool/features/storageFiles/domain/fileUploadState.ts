// Define todos los estados posibles durante una subida de archivo.

export type UploadState =
    | { status: 'init' }
    | { status: 'loading' }
    | { status: 'progress'; progress: number }
    | { status: 'success'; url: string }
    | { status: 'error'; error: Error };

// Define la estructura de los datos de un archivo en el storage.
export interface FileMetadata {
    id: string; // Será la ruta completa del archivo, que funciona como ID único.
    name: string;
    url: string;

    date: Date;
    size: number;
    type: string;

    base64?: string;
    file?: File;
}
export interface FileMetadataLight {
    id: string; // Será la ruta completa del archivo, que funciona como ID único.
    name: string;
    url: string;
}
