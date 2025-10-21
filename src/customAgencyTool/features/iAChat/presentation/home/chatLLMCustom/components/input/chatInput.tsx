// // components/chat/ChatInput/ChatInput.tsx

// import {
//     MyButton,
//     MyDrawer,
//     MyFileUpload,
//     MyFlex,
//     MyTextArea
// } from '@src/customAgencyTool/components/ui';
// import { ChatContext } from 'reachat';
// import {
//     forwardRef,
//     useContext,
//     useEffect,
//     useImperativeHandle,
//     useRef,
//     useState
// } from 'react';
// import FileList from '../file/fileList';

// export interface ChatInputProps {
//     /**
//      * Default value for the input field
//      */
//     defaultValue?: string;

//     /**
//      * Allowed file types for upload
//      */
//     allowedFiles?: string[];

//     /**
//      * Placeholder text for the input
//      */
//     placeholder?: string;

//     /**
//      * Icon to show for send
//      */
//     sendIcon?: string;

//     /**
//      * Icon to show for stop
//      */
//     stopIcon?: string;

//     /**
//      * Icon to show for attach
//      */
//     attachIcon?: string;

//     /**
//      * Maximum number of files allowed
//      */
//     maxFiles?: number;

//     /**
//      * Whether to show suggestions drawer
//      */
//     showSuggestions?: boolean;

//     /**
//      * Custom suggestions content
//      */
//     suggestionsContent?: React.ReactNode;

//     /**
//      * Callback when files are added
//      */
//     onFilesAdded?: (files: File[]) => void;
// }

// export interface ChatInputRef {
//     focus: () => void;
//     clear: () => void;
// }

// export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(
//     (
//         {
//             defaultValue = '',
//             allowedFiles = [],
//             placeholder = 'Type your message...',
//             sendIcon = 'FillSendFill',
//             stopIcon = 'FillSendXFill',
//             attachIcon = 'Upload',
//             maxFiles = 10,
//             showSuggestions = true,
//             suggestionsContent,
//             onFilesAdded
//         },
//         ref
//     ) => {
//         const {
//             isLoading,
//             disabled,
//             sendMessage,
//             stopMessage,
//             activeSessionId
//         } = useContext(ChatContext);

//         const [message, setMessage] = useState<string>(defaultValue);
//         const [showDrawer, setShowDrawer] = useState(false);
//         const [files, setFiles] = useState<File[]>([]);
//         const inputRef = useRef<HTMLTextAreaElement>(null);

//         // Exponer métodos a través de ref
//         useImperativeHandle(ref, () => ({
//             focus: () => {
//                 inputRef.current?.focus();
//             },
//             clear: () => {
//                 setMessage('');
//                 setFiles([]);
//             }
//         }));

//         // Enfocar el input cuando cambia la sesión activa
//         useEffect(() => {
//             if (inputRef.current) {
//                 inputRef.current.focus();
//             }
//         }, [activeSessionId]);

//         const handleSendMessage = () => {
//             if (message.trim() || files.length > 0) {
//                 sendMessage?.(message, files);
//                 setMessage('');
//                 setFiles([]);
//             }
//         };

//         const handleKeyPress = (
//             e: React.KeyboardEvent<HTMLTextAreaElement>
//         ) => {
//             if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage();
//             }
//         };

//         const handleFileUpload = (uploadedFiles: FileList | null) => {
//             if (!uploadedFiles) return;

//             const newFiles = Array.from(uploadedFiles);
//             if (files.length + newFiles.length > maxFiles) {
//                 // Aquí podrías mostrar una notificación de error
//                 console.warn(`Maximum ${maxFiles} files allowed`);
//                 return;
//             }

//             setFiles((prev) => [...prev, ...newFiles]);
//             onFilesAdded?.(newFiles);
//         };

//         const handleRemoveFile = (index: number) => {
//             setFiles((prev) => prev.filter((_, i) => i !== index));
//         };

//         return (
//             <MyFlex direction="column" gap={2}>
//                 {/* Lista de archivos */}
//                 {files.length > 0 && (
//                     <FileList
//                         //
//                         files={files}
//                         onDelete={handleRemoveFile}
//                     />
//                 )}

//                 {/* Área de entrada */}
//                 <MyTextArea
//                     ref={inputRef}
//                     value={message}
//                     defaultValue={defaultValue}
//                     onChange={(e) => setMessage(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     placeholder={placeholder}
//                     isDisabled={isLoading || disabled}
//                     size="sm"
//                     resize="none"
//                     rows={3}
//                 />

//                 {/* Barra de acciones */}
//                 <MyFlex
//                     direction="row"
//                     justify="space-between"
//                     align="center"
//                     px={5}
//                 >
//                     <MyFlex direction="row" gap={2}>
//                         {/* Upload de archivos */}
//                         {allowedFiles.length > 0 && (
//                             <MyFileUpload
//                                 icon={attachIcon}
//                                 accept={allowedFiles}
//                                 onChangeEvent={(e) =>
//                                     handleFileUpload(e.target.files)
//                                 }
//                                 isDisabled={isLoading || disabled}
//                                 loading={isLoading}
//                                 maxFiles={maxFiles}
//                             />
//                         )}

//                         {/* Drawer de sugerencias */}
//                         {showSuggestions && (
//                             <MyDrawer
//                                 isOpen={showDrawer}
//                                 onOpenChange={setShowDrawer}
//                                 trigger={
//                                     <MyButton
//                                         size="xs"
//                                         variant="outline"
//                                         isDisabled={disabled}
//                                         leftIcon="SAVE"
//                                         onClick={() => setShowDrawer(true)}
//                                     />
//                                 }
//                                 header="Suggestions"
//                             >
//                                 {suggestionsContent}
//                             </MyDrawer>
//                         )}
//                     </MyFlex>

//                     {/* Botones de acción */}
//                     <MyFlex direction="row" gap={2}>
//                         {isLoading && (
//                             <MyButton
//                                 size="xs"
//                                 variant="ghost"
//                                 onClick={stopMessage}
//                                 isDisabled={disabled}
//                                 leftIcon={stopIcon}
//                             >
//                                 Stop
//                             </MyButton>
//                         )}
//                         <MyButton
//                             size="xs"
//                             variant="ghost"
//                             onClick={handleSendMessage}
//                             isDisabled={
//                                 isLoading ||
//                                 disabled ||
//                                 (!message.trim() && !files.length)
//                             }
//                             leftIcon={sendIcon}
//                         >
//                             Send
//                         </MyButton>
//                     </MyFlex>
//                 </MyFlex>
//             </MyFlex>
//         );
//     }
// );

// // Hook personalizado para manejar el estado del input
// export const useChatInput = (initialValue: string = '') => {
//     const [message, setMessage] = useState(initialValue);
//     const [files, setFiles] = useState<File[]>([]);
//     const [isComposing, setIsComposing] = useState(false);

//     const clearInput = () => {
//         setMessage('');
//         setFiles([]);
//     };

//     const addFiles = (newFiles: File[]) => {
//         setFiles((prev) => [...prev, ...newFiles]);
//     };

//     const removeFile = (index: number) => {
//         setFiles((prev) => prev.filter((_, i) => i !== index));
//     };

//     return {
//         message,
//         files,
//         isComposing,
//         setMessage,
//         setIsComposing,
//         clearInput,
//         addFiles,
//         removeFile
//     };
// };

// export default ChatInput;
