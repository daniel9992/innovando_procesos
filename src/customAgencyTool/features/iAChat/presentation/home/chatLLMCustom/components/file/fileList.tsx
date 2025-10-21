// // components/file/FileList.tsx

// import { MyButton, MyFlex } from '@src/customAgencyTool/components/ui';
// import type { ConversationFile } from 'reachat';
// import { useState, type FC } from 'react';
// import FileIcon from './fileIcon';

// interface FileListProps {
//     /**
//      * Array of files to display
//      */
//     files: ConversationFile[];

//     /**
//      * Callback when a file is clicked
//      */
//     onFileClick?: (file: ConversationFile) => void;

//     /**
//      * Callback when delete button is clicked
//      */
//     onDeleteFile?: (fileIndex: number) => void;

//     /**
//      * Custom class for the container
//      */
//     className?: string;

//     /**
//      * Whether the files are deletable
//      */
//     isDeletable?: boolean;

//     /**
//      * Whether the files are clickable
//      */
//     isClickable?: boolean;
// }

// interface FileItemProps {
//     file: ConversationFile;
//     index: number;
//     onDelete?: (index: number) => void;
//     onClick?: (file: ConversationFile) => void;
//     isDeletable?: boolean;
//     isClickable?: boolean;
// }

// const FileItem: FC<FileItemProps> = ({
//     file,
//     index,
//     onDelete,
//     onClick,
//     isDeletable = true,
//     isClickable = true
// }) => {
//     return (
//         <MyFlex
//             p={0}
//             _hover={{
//                 backgroundColor: isClickable ? 'bg.muted' : 'transparent',
//                 textDecoration: isClickable ? 'underline' : 'none',
//                 color: isClickable ? 'gray.500' : 'inherit'
//             }}
//             cursor={isClickable ? 'pointer' : 'default'}
//             onClick={() => isClickable && onClick?.(file)}
//             gap={0}
//         >
//             <FileIcon file={file} />
//             {isDeletable && (
//                 <MyButton
//                     variant={'plain'}
//                     aria-label="Delete"
//                     icon={'TRASH'}
//                     size={'xs'}
//                     p={0}
//                     m={0}
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         onDelete?.(index);
//                     }}
//                 />
//             )}
//         </MyFlex>
//     );
// };

// export const FileList: FC<FileListProps> = ({
//     files,
//     onFileClick,
//     onDeleteFile,
//     className,
//     isDeletable = true,
//     isClickable = true
// }) => {
//     if (!files.length) return null;

//     return (
//         <MyFlex
//             direction={'row'}
//             p={0}
//             gap={3}
//             align={'center'}
//             flexWrap={'wrap'}
//             className={className}
//         >
//             {files.map((file, index) => (
//                 <FileItem
//                     key={`file-item-${index}-${file.name}`}
//                     file={file}
//                     index={index}
//                     onDelete={onDeleteFile}
//                     onClick={onFileClick}
//                     isDeletable={isDeletable}
//                     isClickable={isClickable}
//                 />
//             ))}
//         </MyFlex>
//     );
// };

// // Hook personalizado para manejar la lista de archivos (opcional)
// export const useFileList = (initialFiles: ConversationFile[] = []) => {
//     const [files, setFiles] = useState<ConversationFile[]>(initialFiles);

//     const addFiles = (newFiles: ConversationFile[]) => {
//         setFiles((prev) => [...prev, ...newFiles]);
//     };

//     const removeFile = (index: number) => {
//         setFiles((prev) => prev.filter((_, i) => i !== index));
//     };

//     const clearFiles = () => {
//         setFiles([]);
//     };

//     const updateFile = (
//         index: number,
//         updatedFile: Partial<ConversationFile>
//     ) => {
//         setFiles((prev) =>
//             prev.map((file, i) =>
//                 i === index ? { ...file, ...updatedFile } : file
//             )
//         );
//     };

//     return {
//         files,
//         addFiles,
//         removeFile,
//         clearFiles,
//         updateFile
//     };
// };

// // Tipos de exportación
// export type { FileItemProps, FileListProps };

// export default FileList;
