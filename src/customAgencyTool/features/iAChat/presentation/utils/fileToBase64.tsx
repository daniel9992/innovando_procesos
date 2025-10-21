// Types
interface MimeTypeConfig {
    type: string;
    extension: string;
    maxFileSize: number;
}

interface FileConfig {
    maxSize: number;
    maxFiles: number;
    allowedTypes: Set<MimeTypeConfig>;
}

// Constants
// const FILE_CATEGORIES = {
//   IMAGE: 'image',
//   VIDEO: 'video',
//   AUDIO: 'audio',
//   DOCUMENT: 'document'
// } as const;

const MAX_FILE_SIZE = 1024 * 1024 * 20; // 20 MB
const MAX_FILES = 10;

// Configuration of MIME types organized by category
export const allowedMIMETypes: Set<MimeTypeConfig> = new Set([
    // Imágenes
    { type: '.png', extension: 'image/png', maxFileSize: MAX_FILE_SIZE },
    { type: '.jpg', extension: 'image/jpeg', maxFileSize: MAX_FILE_SIZE },
    { type: '.jpeg', extension: 'image/jpeg', maxFileSize: MAX_FILE_SIZE },
    { type: '.webp', extension: 'image/webp', maxFileSize: MAX_FILE_SIZE },

    // Videos
    { type: '.flv', extension: 'video/x-flv', maxFileSize: MAX_FILE_SIZE },
    { type: '.mov', extension: 'video/quicktime', maxFileSize: MAX_FILE_SIZE },
    { type: '.mpeg', extension: 'video/mpeg', maxFileSize: MAX_FILE_SIZE },
    { type: '.mpegps', extension: 'video/mpeg', maxFileSize: MAX_FILE_SIZE },
    { type: '.mpg', extension: 'video/mpeg', maxFileSize: MAX_FILE_SIZE },
    { type: '.mp4', extension: 'video/mp4', maxFileSize: MAX_FILE_SIZE },
    { type: '.webm', extension: 'video/webm', maxFileSize: MAX_FILE_SIZE },
    { type: '.wmv', extension: 'video/x-ms-wmv', maxFileSize: MAX_FILE_SIZE },
    { type: '.3gpp', extension: 'video/3gpp', maxFileSize: MAX_FILE_SIZE },

    // Audio
    { type: '.aac', extension: 'audio/aac', maxFileSize: MAX_FILE_SIZE },
    { type: '.flac', extension: 'audio/flac', maxFileSize: MAX_FILE_SIZE },
    { type: '.mp3', extension: 'audio/mpeg', maxFileSize: MAX_FILE_SIZE },
    { type: '.m4a', extension: 'audio/mp4', maxFileSize: MAX_FILE_SIZE },
    { type: '.mpeg', extension: 'audio/mpeg', maxFileSize: MAX_FILE_SIZE },
    { type: '.mpga', extension: 'audio/mpeg', maxFileSize: MAX_FILE_SIZE },
    { type: '.mp4', extension: 'audio/mp4', maxFileSize: MAX_FILE_SIZE },
    { type: '.opus', extension: 'audio/ogg', maxFileSize: MAX_FILE_SIZE },
    { type: '.pcm', extension: 'audio/wav', maxFileSize: MAX_FILE_SIZE },
    { type: '.wav', extension: 'audio/wav', maxFileSize: MAX_FILE_SIZE },
    { type: '.webm', extension: 'audio/webm', maxFileSize: MAX_FILE_SIZE },

    // Documentos
    { type: '.pdf', extension: 'application/pdf', maxFileSize: MAX_FILE_SIZE },
    { type: '.txt', extension: 'text/plain', maxFileSize: MAX_FILE_SIZE }
]);

export const config: FileConfig = {
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    allowedTypes: allowedMIMETypes
};

/**
 * Converts a single file to Base64
 * @param file File to convert
 * @returns Promise with the string in Base64
 */
export const convertFileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.result) {
                const base64String = reader.result.toString();
                // Solo enviamos la parte del base64, sin el prefijo data:mime/type
                const base64Content = base64String.split(',')[1];
                if (base64Content) {
                    resolve(base64Content);
                } else {
                    reject(new Error('Invalid base64 content'));
                }
            } else {
                reject(new Error('Failed to read file'));
            }
        };
        reader.onerror = (error) => reject(error);

        reader.readAsDataURL(file);
    });
};

/**
 * Converts multiple files to Base64
 * @param files Array of files to convert
 * @returns Promise with array of strings in Base64
 */
export const convertFilesToBase64 = async (
    files: File[]
): Promise<string[]> => {
    try {
        const base64Promises = files.map((file) => convertFileToBase64(file));
        return await Promise.all(base64Promises);
    } catch (error) {
        throw new Error(`Error converting files to Base64: ${error}`);
    }
};

/**
 * Converts a base64 string to a File object
 * @param base64  The base64 string to convert
 * @returns Promise with the File object
 */
export const stringBase64ToFile = async (base64: string): Promise<File> => {
    const decoded = atob(base64);
    const file = new File([decoded], `file.${decoded.split('/')[1]}`, {
        type: 'application/octet-stream'
    });
    return file;
};

/**
 * Checks if a string is a valid base64 string
 * @param base64 The string to check
 * @returns True if the string is a valid base64 string, false otherwise
 */
export const isValidStringBase64 = (base64: string): boolean => {
    try {
        const decoded = atob(base64);
        return decoded.length > 0;
    } catch (error) {
        console.error('Error decoding base64 string:', error);
        return false;
    }
};

/**
 * Converts a file to a GenerativePart array
 * @param file File to convert
 * @returns Promise with array of GenerativePart objects *
 */
interface GenerativePart {
    data: string;
    mimeType: string;
}
export const fileToGenerativeParts = async (
    files: File | File[]
): Promise<GenerativePart[]> => {
    try {
        // Normalizar la entrada a un array
        const fileArray = Array.isArray(files) ? files : [files];

        // Convertir todos los archivos de una vez usando Promise.all
        const generativeParts = await Promise.all(
            fileArray.map(async (file): Promise<GenerativePart> => {
                const base64Data = await convertFileToBase64(file);
                return {
                    data: base64Data,
                    mimeType: file.type
                };
            })
        );

        return generativeParts;
    } catch (error) {
        throw new Error(`Error converting files to GenerativeParts: ${error}`);
    }
};

/**
 * Validates a single file
 * @param file File to validate
 * @returns Promise with validation result
 */
export const getFileExtension = (name: string): string => {
    return `.${name.split('.').pop() || ''}`;
};

interface FileValidationResult {
    isValid: boolean;
    message?: string;
}
export const isValidateFile = (file: File): FileValidationResult => {
    const errors: string[] = [];
    const fileExtension = getFileExtension(file.name);

    const mimeTypeConfig = Array.from(allowedMIMETypes).find(
        (config) => config.type === fileExtension
    );

    if (!mimeTypeConfig) {
        errors.push('Tipo de archivo no permitido');
    }

    if (file.size > MAX_FILE_SIZE) {
        errors.push('El archivo está cerca del límite de tamaño permitido');
    }

    if (mimeTypeConfig && file.size > mimeTypeConfig.maxFileSize) {
        errors.push('El archivo excede el tamaño máximo permitido');
    }

    return {
        isValid: errors.length === 0,
        message: errors.join(', ')
    };
};

/*



 Content part - includes text, image/video, or function call/response
 part types.
 @public
 
export declare type Part = 
        TextPart | 
        InlineDataPart | 
        FunctionCallPart | 
        FunctionResponsePart | 
        FileDataPart;

export declare interface TextPart {
    text: string;
    inlineData?: never;
    functionCall?: never;
    functionResponse?: never;
}

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

export declare interface FunctionCallPart {
    text?: never;
    inlineData?: never;
    functionCall: FunctionCall;
    functionResponse?: never;
}

export declare interface FunctionResponsePart {
    text?: never;
    inlineData?: never;
    functionCall?: never;
    functionResponse: FunctionResponse;
}

export declare interface FileDataPart {
    text?: never;
    inlineData?: never;
    functionCall?: never;
    functionResponse?: never;
    fileData: FileData = {mineType:string, fileUri:string};
}
*/
