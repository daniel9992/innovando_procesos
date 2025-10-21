import type { FileMetadataLight } from '../domain/fileUploadState';
import type { IStorageRepository } from './IStorageRepository';

export class ListFilesUseCase {
    constructor(private readonly storageRepository: IStorageRepository) {}

    execute(path: string): Promise<FileMetadataLight[]> {
        return this.storageRepository.readAll(path);
    }
}
