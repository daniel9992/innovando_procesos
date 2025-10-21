import { Observable } from 'rxjs';
import type { FileMetadataLight, UploadState } from '../domain/fileUploadState';

// El contrato que cualquier repositorio de almacenamiento (Firebase, S3, etc.) debe cumplir.
export interface IStorageRepository {
    /**
     *  Sube un archivo a una ruta específica.
     */
    upload(file: File, path: string): Observable<UploadState>;

    /**
     * Obtiene una lista con los metadatos de todos los archivos en una ruta específica.
     */
    readAll(path: string): Promise<FileMetadataLight[]>;

    /**
     * Elimina un archivo específico usando su ruta completa como ID.
     */
    delete(url: string): Promise<void>;
}
