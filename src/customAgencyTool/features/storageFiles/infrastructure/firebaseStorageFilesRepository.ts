import { storage } from '@src/customAgencyTool/core';
import {
    deleteObject,
    getDownloadURL,
    listAll,
    ref,
    uploadBytesResumable
} from 'firebase/storage'; // Asume que 'storage' está inicializado
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import type { IStorageRepository } from '../application/IStorageRepository';
import type { FileMetadataLight, UploadState } from '../domain/fileUploadState';

// La implementación específica para Firebase de nuestro contrato de repositorio.
export class FirebaseStorageFilesRepository implements IStorageRepository {
    upload(file: File, path: string): Observable<UploadState> {
        const storageRef = ref(storage, `${path}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        return new Observable<UploadState>((subscriber) => {
            // 1. Emitir el estado inicial
            subscriber.next({ status: 'loading' });

            const unsubscribe = uploadTask.on(
                'state_changed',
                // --- Observer para 'next' (progreso) ---
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    subscriber.next({
                        status: 'progress',
                        progress: Math.round(progress)
                    });
                },
                // --- Observer para 'error' ---
                (error) => {
                    // CAMBIO PRINCIPAL: En lugar de emitir un objeto de estado,
                    // se notifica un error real al observable. Esta es la
                    // convención en RxJS.
                    subscriber.error(error);
                },
                // --- Observer para 'complete' (éxito) ---
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(
                            uploadTask.snapshot.ref
                        );
                        subscriber.next({
                            status: 'success',
                            url: downloadURL
                        });
                        subscriber.complete(); // Notifica que el flujo ha terminado exitosamente.
                    } catch (error) {
                        // Si falla la obtención de la URL, también es un error terminal.
                        subscriber.error(error as Error);
                    }
                }
            );

            // La función de limpieza se ejecuta al desuscribirse para cancelar la subida.
            return () => unsubscribe();
        });
    }

    async readAll(path: string): Promise<FileMetadataLight[]> {
        console.log('ReadAll file:', path);

        const listRef = ref(storage, path);
        const response = await listAll(listRef);

        // Mapeamos cada item para obtener su URL y metadatos
        const promises = response.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            return {
                id: itemRef.fullPath, // La ruta completa es el mejor ID
                name: itemRef.name,
                url
            };
        });

        return Promise.all(promises);
    }

    async delete(id: string): Promise<void> {
        try {
            console.log('delete', id);
            const fileRef = ref(storage, id);
            await deleteObject(fileRef);
        } catch (e) {
            console.log('error', e);
            throw e;
        }
    }
}

//-----------------------------------------------------------------
//-----------------------------------------------------------------
//-----------------------------------------------------------------

// Un tipo para mapear el nombre del archivo a su estado de subida
export type UploadProgressMap = { [fileName: string]: UploadState };

export class MyUploaderService {
    private storageRepo = new FirebaseStorageFilesRepository();

    // 1. Usamos un BehaviorSubject para emitir el estado de progreso actual.
    // El UI se puede suscribir a este observable para mostrar el progreso de cada archivo.
    public readonly individualProgress$ =
        new BehaviorSubject<UploadProgressMap>({});

    // Nuestro nuevo método para subir múltiples archivos
    uploadFiles(files: File[], path: string): Observable<FileMetadataLight[]> {
        if (!files || files.length === 0) {
            // Si no hay archivos, retornamos un observable que completa inmediatamente
            return of([]);
        }

        // Reseteamos el estado de progreso
        const progressMap: UploadProgressMap = {};
        files.forEach((file) => {
            progressMap[file.name] = { status: 'init' };
        });
        this.individualProgress$.next(progressMap);

        // 2. Creamos un array de observables, uno para cada subida de archivo.
        const uploadTasks$: Observable<UploadState>[] = files.map((file) => {
            // Usamos el operador 'tap' para un "efecto secundario": actualizar nuestro
            // BehaviorSubject de progreso sin alterar el flujo del observable.
            return this.storageRepo.upload(file, path).pipe(
                tap((state) => {
                    // Actualizamos el mapa de progreso y lo emitimos
                    const currentProgress = this.individualProgress$.getValue();
                    this.individualProgress$.next({
                        ...currentProgress,
                        [file.name]: state
                    });
                })
            );
        });

        // 3. Usamos 'forkJoin' para ejecutar todas las subidas en paralelo.
        // Solo emitirá un valor (un array con el último estado de cada observable)
        // cuando TODOS los observables se hayan completado.
        return forkJoin(uploadTasks$).pipe(
            map((finalStates) => {
                // El resultado de forkJoin es un array de los últimos estados emitidos.
                // Deberían ser todos de tipo 'success'.
                const metadata: FileMetadataLight[] = [];
                finalStates.forEach((state, index) => {
                    if (state.status === 'success') {
                        metadata.push({
                            id: `${path}/${files[index].name}`,
                            name: files[index].name,
                            url: state.url
                        });
                    }
                });
                return metadata;
            }),
            catchError((error) => {
                // Si CUALQUIER subida falla, forkJoin emitirá un error.
                console.error('Una o más subidas fallaron', error);
                // Propagamos el error para que el suscriptor pueda manejarlo.
                throw error;
            })
        );
    }

    async readAll(path: string): Promise<FileMetadataLight[]> {
        return this.storageRepo.readAll(path);
    }

    async deleteFile(id: string): Promise<void> {
        return this.storageRepo.delete(id);
    }
}
