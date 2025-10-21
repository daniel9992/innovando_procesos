// El caso de uso que orquesta la subida.

import type { IStorageRepository } from './IStorageRepository';

// Depende de una abstracción (la interfaz), no de una implementación concreta.
export class UploadFileUseCase {
    constructor(private readonly uploadRepository: IStorageRepository) {}

    execute(file: File, path: string) {
        // Simplemente ejecuta el método del repositorio y devuelve el Observable.
        // Aquí podrías agregar más lógica de aplicación si fuera necesario (logs, etc.).
        return this.uploadRepository.upload(file, path);
    }
}
