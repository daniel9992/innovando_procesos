// // components/file/FileInput.tsx

// import { MyButton, MyFileUpload } from '@src/customAgencyTool/components/ui';
// import { cn } from 'reablocks';
// import { ChatContext } from 'reachat';
// import {
//     type ChangeEvent,
//     type FC,
//     useContext,
//     useEffect,
//     useRef,
//     useState
// } from 'react';

// interface FileInputProps {
//     /**
//      * Array of allowed file extensions.
//      */
//     allowedFiles?: string[];

//     /**
//      * Indicates whether a file upload is in progress.
//      */
//     isLoading?: boolean;

//     /**
//      * Disables the file input when true.
//      */
//     disabled?: boolean;

//     /**
//      * Custom icon for the attach button.
//      */
//     attachIcon?: string;

//     /**
//      * Maximum number of files that can be uploaded at once.
//      */
//     maxFiles?: number;

//     /**
//      * Callback function triggered when files are selected.
//      */
//     onFileUpload: (files: File[]) => void;
// }

// export const FileInput: FC<FileInputProps> = ({
//     allowedFiles = [],
//     onFileUpload,
//     isLoading = false,
//     disabled = false,
//     attachIcon = 'Upload',
//     maxFiles = 10
// }) => {
//     const { theme } = useContext(ChatContext);
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const { files, handleFiles, clearFiles } = useFileInput({
//         maxFiles,
//         allowedTypes: allowedFiles,
//         onFileSelect: onFileUpload
//     });

//     useEffect(() => {
//         if (files) {
//             onFileUpload(files);
//         }
//     }, [files, onFileUpload]);

//     const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//         const files = event.target.files;
//         if (!files) return;

//         // Convert FileList to Array
//         const fileArray = Array.from(files);

//         // Validate number of files
//         if (fileArray.length > maxFiles) {
//             console.warn(`Maximum ${maxFiles} files allowed`);
//             return;
//         }

//         // Validate file types if allowedFiles is provided
//         if (allowedFiles.length > 0) {
//             const validFiles = fileArray.filter((file) => {
//                 const extension = `.${file.name
//                     .split('.')
//                     .pop()
//                     ?.toLowerCase()}`;
//                 return allowedFiles.includes(extension);
//             });

//             if (validFiles.length !== fileArray.length) {
//                 console.warn(
//                     'Some files were rejected due to invalid file type'
//                 );
//             }

//             onFileUpload(validFiles);
//         } else {
//             onFileUpload(fileArray);
//         }

//         // Reset input value to allow selecting the same file again
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     return (
//         <div className={cn(theme?.input?.upload)}>
//             <MyFileUpload
//                 icon={attachIcon}
//                 text="Cargar archivos"
//                 accept={allowedFiles}
//                 // onChangeEvent={handleFileChange}
//                 onChange={handleFiles}
//                 isDisabled={isLoading || disabled}
//                 loading={isLoading}
//                 maxFiles={maxFiles}
//                 ref={fileInputRef}
//             />

//             {files.length > 0 && (
//                 <MyButton
//                     variant={'ghost'}
//                     aria-label="Delete"
//                     icon={'OutlineClear'}
//                     // colorPalette={'delete'}
//                     size={'xs'}
//                     p={0}
//                     m={0}
//                     onClick={clearFiles}
//                 >
//                     Borrar archivos
//                 </MyButton>
//             )}
//         </div>
//     );
// };

// // Custom hook para manejar la lógica de archivos (opcional)
// export const useFileInput = (options: {
//     maxFiles?: number;
//     allowedTypes?: string[];
//     onFileSelect?: (files: File[]) => void;
// }) => {
//     const [files, setFiles] = useState<File[]>([]);
//     const [error, setError] = useState<string | null>(null);

//     const handleFiles = (newFiles: File[]) => {
//         if (options.maxFiles && newFiles.length > options.maxFiles) {
//             setError(`Maximum ${options.maxFiles} files allowed`);
//             return;
//         }

//         if (options.allowedTypes) {
//             const invalidFiles = newFiles.filter((file) => {
//                 const extension = `.${file.name
//                     .split('.')
//                     .pop()
//                     ?.toLowerCase()}`;
//                 return !options.allowedTypes?.includes(extension);
//             });

//             if (invalidFiles.length > 0) {
//                 setError('Some files have invalid types');
//                 return;
//             }
//         }

//         setFiles((prevFiles) => [...prevFiles, ...newFiles]);
//         setError(null);
//         options.onFileSelect?.(newFiles);
//     };

//     const clearFiles = () => {
//         setFiles([]);
//         setError(null);
//     };

//     return {
//         files,
//         error,
//         handleFiles,
//         clearFiles
//     };
// };

// export default FileInput;
