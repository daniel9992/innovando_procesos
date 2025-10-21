import { storage } from '@src/customAgencyTool/core';
import type { FileDataPart, InlineDataPart } from 'firebase/ai';
import {
    deleteObject,
    getDownloadURL,
    listAll,
    ref,
    uploadBytes
} from 'firebase/storage';
import {
    convertFilesToBase64,
    convertFileToBase64,
    fileToGenerativeParts,
    isValidStringBase64,
    stringBase64ToFile
} from '../../presentation/utils/fileToBase64';

interface UploadOptions {
    IS_STORAGE_URL: boolean;
    IS_DOWNLOAD_URL: boolean;
}

export class ChatStorageService {
    private static readonly CHAT_BUCKET_PATH =
        '/chatSessionCollection/{uid}/{sessionId}/{fileName}';
    private static readonly MAX_FILE_SIZE_MB = 19; // 19 MB
    private static readonly MAX_FILE_SIZE_BYTES =
        ChatStorageService.MAX_FILE_SIZE_MB * 1024 * 1024;

    private async uploadFilesUsinInlineParts(
        files: File[]
    ): Promise<InlineDataPart[]> {
        /**
         export declare interface InlineDataPart {
                text?: never;
                inlineData: GenerativeContentBlob = {mineType:string, data:string};
                functionCall?: never;
                functionResponse?: never;
                /**
                 * Applicable if `inlineData` is a video.
                 /
                videoMetadata?: VideoMetadata;
            }
         */
        // stringBase64ToFile
        const preInlineParts = await fileToGenerativeParts(files);

        const inlineParts: InlineDataPart[] = preInlineParts.map((part) => {
            return {
                inlineData: {
                    data: part.data,
                    mimeType: part.mimeType
                }
            };
        });

        return inlineParts;
    }

    private async uploadFilesUsinFileParts(
        files: File[],
        userUID: string,
        sessionId: string,
        options?: UploadOptions
    ): Promise<FileDataPart[]> {
        const { IS_STORAGE_URL, IS_DOWNLOAD_URL } = options ?? {};
        /*
        export declare interface FileDataPart {
            text?: never;
            inlineData?: never;
            functionCall?: never;
            functionResponse?: never;
            fileData: FileData = {mineType:string, fileUri:string};
        }
        */
        // -- NEW ---
        /**
        Error en sendMessage: 
        FirebaseError: AI: Error fetching from 
        https://firebasevertexai.googleapis.com/v1beta/projects/smart-world-logistics/models/gemini-2.5-flash:streamGenerateContent?alt=sse: 
        [400 ] Unsupported file uri: 
        https://firebasestorage.googleapis.com/v0/b/smart-world-logistics.appspot.com/o/chatSessionCollectio...
         
         + Rule on Storage:
            - allow read;
        
        */
        /**
            Error en sendMessage: 
            FirebaseError: AI: Error fetching from 
            https://firebasevertexai.googleapis.com/v1beta/projects/smart-world-logistics/models/gemini-2.5-flash:streamGenerateContent?alt=sse: 
            [400 ] Unsupported file uri: 
            gs://smart-world-logistics.appspot.com/chatSessionCollection/tER7Mp5o1ZMqw4Wu6epx8Ul8ZjG2/h1tXEkPxKI.
        */
        const uploadPromises = files.map(async (file) => {
            try {
                const bucketPath = ChatStorageService.CHAT_BUCKET_PATH.replace(
                    '{uid}',
                    userUID
                )
                    .replace('{sessionId}', sessionId)
                    .replace('{fileName}', `${Date.now()}-${file.name}`);

                const storageRef = ref(storage, bucketPath);
                const uploadResult = await uploadBytes(storageRef, file);
                const mimeType = uploadResult.metadata.contentType;

                if (!mimeType)
                    throw new Error(
                        'MimeType no encontrada del archivo ' + file.name
                    );

                console.log('Archivo subido exitosamente.');

                // 2. Obtener la URL de descarga (HTTPS)
                let downloadUrlStr = '';

                if (IS_STORAGE_URL) {
                    const storageUrl = uploadResult.ref.toString();
                    downloadUrlStr = storageUrl;
                }
                if (IS_DOWNLOAD_URL) {
                    const downloadURL = await getDownloadURL(uploadResult.ref);
                    console.log('URL de descarga obtenida:', downloadURL);
                    downloadUrlStr = downloadURL;
                }

                // 3. Construir la parte de la imagen con la URL HTTPS
                const imagePart: FileDataPart = {
                    fileData: {
                        mimeType: mimeType,
                        fileUri: downloadUrlStr // ¡Esta es la clave!
                    }
                };

                return imagePart;
            } catch (error) {
                console.error(error);
                throw new Error('Error al subir archivo');
            }
        });

        return Promise.all(uploadPromises);
    }

    public async uploadFiles(
        files: File[],
        userUID: string,
        sessionId: string
    ) {
        try {
            // 0. Validar tamaño de archivo
            const filesSize = files.map((file) => file.size);

            const sumeFilesSize = filesSize.reduce((a, b) => a + b, 0);

            if (sumeFilesSize > ChatStorageService.MAX_FILE_SIZE_BYTES) {
                const errorMsg = `Error: El tamaño máximo es de ${ChatStorageService.MAX_FILE_SIZE_MB}MB`;
                throw new Error(errorMsg);
            }

            // 1. Subir archivos uploadFilesUsinFileParts
            const uploadOptions = {
                IS_STORAGE_URL: true,
                IS_DOWNLOAD_URL: false
            };
            const filesParts = await this.uploadFilesUsinFileParts(
                files,
                userUID,
                sessionId,
                uploadOptions
            );

            // 2. Generar Base64 de cada archivo subido
            const filesBase64 = await this.uploadFilesUsinInlineParts(files);

            // 4. generar retorno
            return {
                fileDataParts: filesParts,
                inlineDataParts: filesBase64
            };
        } catch (error) {
            console.error(error);
            throw new Error('Error al subir archivo');
        }
    }

    public async readAllFiles(userUID: string, sessionId: string) {
        try {
            // Leemos todos los archivos en la ruta
            const bucketPath = ChatStorageService.CHAT_BUCKET_PATH.replace(
                '{uid}',
                userUID
            )
                .replace('{sessionId}', sessionId)
                .replace('/{fileName}', '');

            const listRef = ref(storage, bucketPath);
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
        } catch (error) {
            console.error('Error al leer el evento', error);
            throw new Error('Error al leer el evento');
        }
    }

    public async deleteSession(
        userUID: string,
        sessionId: string
    ): Promise<void> {
        try {
            const bucketPath = ChatStorageService.CHAT_BUCKET_PATH.replace(
                '{uid}',
                userUID
            )
                .replace('{sessionId}', sessionId)
                .replace('/{fileName}', '');

            const directoryRef = ref(storage, bucketPath);

            const result = await listAll(directoryRef);

            const deletePromises = result.items.map((itemRef) => {
                return deleteObject(itemRef);
            });

            await Promise.all(deletePromises);
        } catch (error) {
            console.error('Error al eliminar el evento', error);
            throw new Error('Error al eliminar el evento');
        }
    }

    public async deleteFileConversation(
        userUID: string,
        sessionId: string,
        fileDataParts: FileDataPart[]
    ): Promise<void> {
        try {
            // -- NEW ---
            console.log('userUID', userUID);
            console.log('sessionId', sessionId);
            const deletePromises = fileDataParts.map(async (part) => {
                const docRef = ref(storage, part.fileData.fileUri);
                await deleteObject(docRef);
            });

            await Promise.all(deletePromises);

            // -- OLD ---
            //  inlineParts: InlineDataPart[]
            // const example = [
            //     {
            //         inlineParts: {
            //             mimeType: 'application/pdf',
            //             data:
            //                 'gs://smart-world-logistics.appspot.com/chatSessionCollection/xfCi9riNgqv4wjacskr8J8s7hLOs/gLmIjyeS1j8Xw3Xreknj/1759255139135-some-file-4.pdf'
            //         }
            //     }
            // ];

            // let bucketPath = ChatStorageService.CHAT_BUCKET_PATH.replace(
            //     '{uid}',
            //     userUID
            // ).replace('{sessionId}', sessionId);

            // const dataUrl = inlineParts
            //     .map((part) => {
            //         return part.inlineData.data;
            //     })
            //     .filter((item) => item);

            // dataUrl.forEach(async (part) => {
            //     const fileName = part.split('/').pop();

            //     // Eliminamos el archivo
            //     bucketPath = bucketPath.replace('{fileName}', `${fileName}`);

            //     const delteRef = ref(storage, bucketPath);
            //     deleteObject(delteRef);
            // });
        } catch (error) {
            console.error('Error al eliminar el evento', error);
            throw new Error('Error al eliminar el evento');
        }
    }

    public async readFileInlineDataPart(inlinePart: InlineDataPart) {
        try {
            const fileData = inlinePart.inlineData.data;

            if (isValidStringBase64(fileData)) {
                // 1. convertir de base64 a URL Object
                const fileURIObject = await stringBase64ToFile(fileData);

                const url = URL.createObjectURL(fileURIObject);

                return url;
            } else {
                throw new Error('Invalid file data');
            }
        } catch (error) {
            console.error('Error al leer el evento', error);
            throw new Error('Error al leer el evento');
        }
    }
    public async readFileFileDataPart(filePart: FileDataPart) {
        try {
            const path = filePart.fileData.fileUri;

            console.log('path', path);

            const storageRef = ref(storage, path);

            const fileUrl = await getDownloadURL(storageRef);

            return fileUrl;
        } catch (error) {
            console.error('Error al leer el evento', error);
            throw new Error('Error al leer el evento');
        }
    }

    public async readFileURLToReturnBase64(filePart: FileDataPart) {
        try {
            const fileURL = filePart.fileData.fileUri;

            const mimeType = filePart.fileData.mimeType;

            const fileBlob = await fetch(fileURL).then((res) => res.blob());

            const fileObj = new File([fileBlob], filePart.fileData.fileUri, {
                type: mimeType
            });

            // Convertimos el objeto File a Base64
            const fileBase64 = await convertFileToBase64(fileObj);

            return fileBase64;
        } catch (error) {
            console.error('Error al leer el evento', error);
            throw new Error('Error al leer el evento');
        }
    }

    public async readFilesURLToReturnBase64(fileParts: FileDataPart[]) {
        try {
            const fileURLs = fileParts.map(
                (filePart) => filePart.fileData.fileUri
            );

            const mimeTypes = fileParts.map(
                (filePart) => filePart.fileData.mimeType
            );

            const fileBlobs = await Promise.all(
                fileURLs.map(async (fileURL) => {
                    const res = await fetch(fileURL);
                    return res.blob();
                })
            );

            const fileObjs = fileBlobs.map((fileBlob, index) => {
                return new File([fileBlob], fileURLs[index], {
                    type: mimeTypes[index]
                });
            });

            // Convertimos el objeto File a Base64
            const fileBase64 = await convertFilesToBase64(fileObjs);

            return fileBase64;
        } catch (error) {
            console.error('Error al leer el evento', error);
            throw new Error('Error al leer el evento');
        }
    }

    public async readFileToInlineDataPart(fileParts: FileDataPart[]) {
        try {
            const fileURLs = fileParts.map(
                (filePart) => filePart.fileData.fileUri
            );

            const mimeTypes = fileParts.map(
                (filePart) => filePart.fileData.mimeType
            );

            const fileBlobs = await Promise.all(
                fileURLs.map(async (fileURL) => {
                    const res = await fetch(fileURL);
                    return res.blob();
                })
            );

            const fileObjs = fileBlobs.map((fileBlob, index) => {
                return new File([fileBlob], fileURLs[index], {
                    type: mimeTypes[index]
                });
            });
            const inlineDataParts = await Promise.all(
                fileObjs.map(async (fileObj) => {
                    const fileBase64 = await convertFileToBase64(fileObj);
                    const result: InlineDataPart = {
                        inlineData: {
                            data: fileBase64,
                            mimeType: fileObj.type
                        }
                    };
                    return result;
                })
            );

            return inlineDataParts;
        } catch (error) {
            console.error('Error al leer el evento', error);
            throw new Error('Error al leer el evento');
        }
    }
}
