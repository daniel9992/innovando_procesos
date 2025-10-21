import type { IStorageRepository } from './IStorageRepository';

export class DeleteFileUseCase {
    constructor(private readonly storageRepository: IStorageRepository) {}

    execute(url: string): Promise<void> {
        return this.storageRepository.delete(url);
    }
}
