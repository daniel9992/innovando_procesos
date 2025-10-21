import { DeleteFileUseCase } from '../application/delete.useCase';
import { ListFilesUseCase } from '../application/listAll.useCase';
import { UploadFileUseCase } from '../application/uploadService.useCase';
import {
    FirebaseStorageFilesRepository,
    MyUploaderService
} from './firebaseStorageFilesRepository';

// Instanciamos las dependencias. En una app grande, usarías inyección de dependencias.
export const firebaseRepository = new FirebaseStorageFilesRepository();

export const uploadFileUseCase = new UploadFileUseCase(firebaseRepository);

export const listFilesUseCase = new ListFilesUseCase(firebaseRepository);

export const deleteFileUseCase = new DeleteFileUseCase(firebaseRepository);

export const firebaseStorageFilesRepository = new MyUploaderService();
