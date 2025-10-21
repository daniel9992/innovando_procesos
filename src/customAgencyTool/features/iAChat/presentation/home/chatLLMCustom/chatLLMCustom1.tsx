// import { Menu as MenuChakra } from '@chakra-ui/react';
// import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
// import {
//     MyButton,
//     MyDivider,
//     MyDrawer,
//     MyFileUpload,
//     MyFlex,
//     MyHeading,
//     MyText,
//     MyTextArea
// } from '@src/customAgencyTool/components/ui';
// import { useNotificationAdapter } from '@src/customAgencyTool/context/toastAppNotification/useNotificationAdapter';
// import { ShowDate } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
// import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
// import { GetRamdom } from '@src/customAgencyTool/utils/stringUtils/getRamdom';
// import { cn, Ellipsis, Portal } from 'reablocks';
// import {
//     Chat,
//     ChatContext,
//     SessionGroups,
//     SessionListItem,
//     SessionMessage,
//     SessionMessagePanel,
//     SessionMessages,
//     SessionMessagesHeader,
//     SessionsGroup,
//     SessionsList,
//     type ConversationFile,
//     type MessageActionsProps,
//     type MessageQuestionProps,
//     type MessageResponseProps,
//     type MessageSourceProps,
//     type Session,
//     type SessionListItemProps
// } from 'reachat';
// import {
//     forwardRef,
//     useCallback,
//     useContext,
//     useEffect,
//     useImperativeHandle,
//     useRef,
//     useState,
//     type ChangeEvent,
//     type FC,
//     type KeyboardEvent,
//     type PropsWithChildren,
//     type ReactElement,
//     type ReactNode
// } from 'react';
// import { BsFillSendFill, BsFillSendXFill } from 'react-icons/bs';
// import { FaCopy, FaRegThumbsDown, FaRegThumbsUp } from 'react-icons/fa';
// import { SlRefresh } from 'react-icons/sl';
// import {
//     fakeSessions,
//     sessionsWithFiles,
//     sessionWithCSVFiles,
//     sessionWithSources
// } from '../expamples/examples';

// interface ShowIconPerFileProps {
//     file: ConversationFile;
// }
// const ShowIconPerFile: FC<ShowIconPerFileProps> = ({ file }) => {
//     const splitText = file.name.split('.');
//     const prefix = '.' + splitText[splitText.length - 1];

//     const Wrapper: FC<{
//         children: ReactNode;
//     }> = ({ children }) => {
//         return (
//             <MyFlex direction={'row'} gap={2} p={0} px={2} align={'center'}>
//                 {children}
//             </MyFlex>
//         );
//     };
//     const text = (name: string) => {
//         return (
//             <MyText fontSize={'xs'} fontWeight={'semibold'}>
//                 {name}
//             </MyText>
//         );
//     };

//     const imageFormats = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.bmp'];
//     if (imageFormats.includes(prefix)) {
//         return (
//             <Wrapper>
//                 <SelectedIcons iconName={'Image'} />
//                 {text(file.name)}
//             </Wrapper>
//         );
//     }
//     const videoFormats = ['.mp4', '.mov', '.avi', '.wmv', '.flv', '.webm'];
//     if (videoFormats.includes(prefix)) {
//         return (
//             <Wrapper>
//                 <SelectedIcons iconName={'Video'} />
//                 {text(file.name)}
//             </Wrapper>
//         );
//     }
//     const audioFormats = ['.mp3', '.wav', '.aac', '.flac', '.ogg'];
//     if (audioFormats.includes(prefix)) {
//         return (
//             <Wrapper>
//                 <SelectedIcons iconName={'Audio'} />
//                 {text(file.name)}
//             </Wrapper>
//         );
//     }
//     const pdfFormats = ['.pdf'];
//     if (pdfFormats.includes(prefix)) {
//         return (
//             <Wrapper>
//                 <SelectedIcons iconName={'PDF1'} />
//                 {text(file.name)}
//             </Wrapper>
//         );
//     }
//     const wordFormats = ['.doc', '.docx', '.rtf', '.txt', '.odt'];
//     if (wordFormats.includes(prefix)) {
//         return (
//             <Wrapper>
//                 <SelectedIcons iconName={'Word'} />
//                 {text(file.name)}
//             </Wrapper>
//         );
//     }
//     const excelFormats = ['.xls', '.xlsx', '.csv', '.ods'];
//     if (excelFormats.includes(prefix)) {
//         return (
//             <Wrapper>
//                 <SelectedIcons iconName={'Excel'} />
//                 {text(file.name)}
//             </Wrapper>
//         );
//     }
//     const powerpointFormats = ['.ppt', '.pptx', '.odp'];
//     if (powerpointFormats.includes(prefix)) {
//         return (
//             <Wrapper>
//                 <SelectedIcons iconName={'Powerpoint'} />
//                 {text(file.name)}
//             </Wrapper>
//         );
//     }
//     const codeFormats = ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.cs'];
//     if (codeFormats.includes(prefix)) {
//         return (
//             <Wrapper>
//                 <SelectedIcons iconName={'Code'} />
//                 {text(file.name)}
//             </Wrapper>
//         );
//     }
//     const textFormats = ['.txt', '.rtf', '.odt'];
//     if (textFormats.includes(prefix)) {
//         return (
//             <Wrapper>
//                 <SelectedIcons iconName={'Text'} />
//                 {text(file.name)}
//             </Wrapper>
//         );
//     }

//     return (
//         <Wrapper>
//             <SelectedIcons iconName={'File'} />
//             {text(file.name)}
//         </Wrapper>
//     );
// };

// const CustomMessagesHeader: FC<any> = () => {
//     const { activeSession } = useContext(ChatContext);

//     return (
//         <MyFlex
//             direction={'column'}
//             p={0}
//             gap={0}
//             _open={{
//                 animation: 'fade-in 300ms ease-out'
//             }}
//             _closed={{
//                 animation: 'fadeOut 300ms ease-in'
//             }}
//         >
//             <MyText fontSize={'xs'} fontWeight={'semibold'} color={'gray.400'}>
//                 {activeSession &&
//                     ShowDate(
//                         activeSession.createdAt as Date,
//                         'D [de] MMMM [del] YYYY hh:mm:ss',
//                         'es'
//                     )}
//             </MyText>
//             <MyHeading fontSize={'xl'} fontWeight={'semibold'}>
//                 {activeSession?.title}
//             </MyHeading>
//         </MyFlex>
//     );
// };

// const CustomMessageQuestion: FC<MessageQuestionProps> = ({
//     question,
//     files
// }) => (
//     <MyFlex
//         direction={'column'}
//         gap={2}
//         p={0}
//         _open={{
//             animation: 'fade-in 300ms ease-out'
//         }}
//         _closed={{
//             animation: 'fadeOut 300ms ease-in'
//         }}
//     >
//         <MyText
//             fontWeight={'semibold'}
//             // color={'blue.500'}
//             //className="text-lg font-semibold text-blue-500"
//         >
//             <span
//                 style={{
//                     color: '#1361ce'
//                 }}
//             >
//                 This is my question:{' '}
//             </span>
//             {question}
//         </MyText>
//         {/* <MessageFiles files={files}>
//             <CustomMessageFile />
//         </MessageFiles> */}
//         {files && Array.isArray(files) && files.length > 0 && (
//             <CustomMNessageFiles files={files} />
//         )}
//     </MyFlex>
// );

// const CustomMessageResponse: FC<MessageResponseProps> = ({
//     response,
//     isLoading
// }) => {
//     if (isLoading) {
//         return (
//             <div>
//                 <LoadingWithText text="Cargando..." />
//             </div>
//         );
//     }

//     return (
//         <MyText
//             // p={2}
//             py={2}
//             px={2}
//             mb={2}
//             borderLeft={'2px solid blue'}
//             // color={'blue.500'}
//             //className="border-l border-blue-500 pl-2"
//         >
//             This is the response: <strong>{response}</strong>
//         </MyText>
//     );
// };

// interface MessageFilesProps extends PropsWithChildren {
//     /**
//      * Files to render.
//      */
//     files: ConversationFile[];
// }

// const CustomMNessageFiles: FC<MessageFilesProps> = ({ files }) => {
//     return (
//         <MyFlex direction={'row'} gap={2} p={0} align={'center'}>
//             {files.map((file) => (
//                 <CustomMessageFile
//                     //
//                     key={`custom-message-file-${file.name}`}
//                     name={file.name}
//                 />
//             ))}
//         </MyFlex>
//     );
// };

// const CustomMessageFile: FC<ConversationFile> = ({ name, type, url }) => (
//     <MyFlex direction={'column'} gap={2} p={0}>
//         <MyText
//             fontSize={'xs'}
//             fontWeight={'semibold'}
//             color={'gray.700'}
//             boxShadow={'md'}
//             borderRadius={'md'}
//             p={1}
//             px={3}
//             mb={2}
//         >
//             {name || type}
//         </MyText>
//         {url}
//     </MyFlex>
// );

// const CustomMessageSource: FC<MessageSourceProps> = ({ title, url, image }) => {
//     const { theme, isCompact } = useContext(ChatContext);

//     return (
//         <figure
//             className={isCompact ? '' : ''}
//             // className={cn(theme?.messages?.message?.sources?.source?.base, {
//             //     [theme.messages.message.sources.source.companion]: isCompact
//             // })}
//             onClick={() => {
//                 if (url) {
//                     window.open(url, '_blank');
//                 }
//             }}
//         >
//             {image && (
//                 <img
//                     src={image}
//                     alt={title}
//                     className={cn(
//                         theme?.messages?.message?.sources?.source?.image
//                     )}
//                 />
//             )}
//             {(title || url) && (
//                 <figcaption>
//                     {title && (
//                         <span
//                             className={cn(
//                                 theme?.messages?.message?.sources?.source?.title
//                             )}
//                         >
//                             <Ellipsis
//                                 value={title}
//                                 //limit={limit}
//                             />
//                         </span>
//                     )}
//                     {url && (
//                         <a
//                             href={url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className={cn(
//                                 theme?.messages?.message?.sources?.source?.url
//                             )}
//                         >
//                             {url}
//                         </a>
//                     )}
//                 </figcaption>
//             )}
//         </figure>
//     );
// };

// const CustomSessionListItem: FC<SessionListItemProps> = ({
//     session,
//     ...rest
// }) => {
//     return (
//         <MyFlex
//             direction={'row'}
//             gap={2}
//             p={0}
//             mt={1}
//             align={'center'}
//             className="noSelect"
//             justifyContent={'space-between'}
//             borderRadius={'sm'}
//             _hover={{
//                 backgroundColor: 'bg.muted'
//             }}
//             cursor={'pointer'}
//             {...rest}
//         >
//             <MyFlex
//                 //
//                 direction={'row'}
//                 p={0}
//                 align={'center'}
//             >
//                 <SelectedIcons iconName={'Comment'} />
//                 <MyText
//                     truncate
//                     lineClamp="2"
//                     fontSize={'sm'}
//                     p={0}
//                     className="truncate"
//                 >
//                     {session.title}
//                 </MyText>
//             </MyFlex>
//             <MyFlex direction={'row'} p={0} align={'center'}>
//                 <MenuChakra.Root>
//                     <MenuChakra.Trigger asChild>
//                         <MyButton
//                             size="xs"
//                             icon="MENU_DOTS"
//                             variant={'plain'}
//                             onClick={(e) => {
//                                 e.stopPropagation();
//                             }}
//                         />
//                     </MenuChakra.Trigger>
//                     <Portal>
//                         <MenuChakra.Positioner>
//                             <MenuChakra.Content>
//                                 <MenuChakra.Item value="rename">
//                                     <SelectedIcons iconName={'EDIT'} />
//                                     Rename
//                                 </MenuChakra.Item>
//                                 <MenuChakra.Item value="delete">
//                                     <SelectedIcons
//                                         iconName={'TRASH'}
//                                         color={'red'}
//                                     />
//                                     Delete
//                                 </MenuChakra.Item>
//                             </MenuChakra.Content>
//                         </MenuChakra.Positioner>
//                     </Portal>
//                 </MenuChakra.Root>
//             </MyFlex>
//         </MyFlex>
//     );
// };

// const CustomMessageActions: FC<MessageActionsProps> = ({
//     children,
//     ...props
// }) => {
//     const { theme } = useContext(ChatContext);
//     const {
//         question,
//         response,
//         copyIcon = <FaCopy />,
//         thumbsUpIcon = <FaRegThumbsUp />,
//         thumbsDownIcon = <FaRegThumbsDown />,
//         refreshIcon = <SlRefresh />,
//         onCopy,
//         onUpvote,
//         onDownvote,
//         onRefresh
//     } = props;
//     const { sendNotification } = useNotificationAdapter();

//     const handleCopy = (text: string) => {
//         navigator.clipboard
//             .writeText(text)
//             .then(() => {
//                 console.log('Text copied to clipboard');
//             })
//             .catch((err) => {
//                 console.error('Could not copy text: ', err);
//             });
//         sendNotification({
//             title: `Texto copiado`,
//             message: `El texto se ha copiado al portapapeles`,
//             status: 'info',
//             position: 'top-right'
//         });
//     };

//     return (
//         (copyIcon || thumbsDownIcon || thumbsUpIcon || refreshIcon) && (
//             <div className={cn(theme?.messages?.message?.footer?.base)}>
//                 {children || (
//                     <>
//                         {copyIcon && (
//                             <MyButton
//                                 variant="ghost"
//                                 aria-label="Copy question and response"
//                                 className={cn(
//                                     theme?.messages?.message?.footer?.copy
//                                 )}
//                                 onClick={
//                                     onCopy
//                                         ? onCopy
//                                         : () =>
//                                               handleCopy(
//                                                   `${question}\n${response}`
//                                               )
//                                 }
//                             >
//                                 {copyIcon}
//                             </MyButton>
//                         )}
//                         {thumbsUpIcon && (
//                             <MyButton
//                                 variant="ghost"
//                                 aria-label="Upvote"
//                                 className={cn(
//                                     theme?.messages?.message?.footer?.upvote
//                                 )}
//                                 onClick={onUpvote}
//                             >
//                                 {thumbsUpIcon}
//                             </MyButton>
//                         )}
//                         {thumbsDownIcon && (
//                             <MyButton
//                                 variant="ghost"
//                                 aria-label="Downvote"
//                                 className={cn(
//                                     theme?.messages?.message?.footer?.downvote
//                                 )}
//                                 onClick={onDownvote}
//                             >
//                                 {thumbsDownIcon}
//                             </MyButton>
//                         )}
//                         {refreshIcon && (
//                             <MyButton
//                                 variant="ghost"
//                                 aria-label="Refresh"
//                                 className={cn(
//                                     theme?.messages?.message?.footer?.refresh
//                                 )}
//                                 onClick={onRefresh}
//                             >
//                                 {refreshIcon}
//                             </MyButton>
//                         )}
//                     </>
//                 )}
//             </div>
//         )
//     );
// };

// interface FileInputProps {
//     /**
//      * Array of allowed file extensions.
//      */
//     allowedFiles: string[] | undefined;

//     /**
//      * Indicates whether a file upload is in progress.
//      */
//     isLoading: boolean | undefined;

//     /**
//      * Disables the file input when true.
//      */
//     disabled: boolean | undefined;

//     /**
//      * Custom icon for the attach button.
//      */
//     attachIcon: string;

//     /**
//      * Callback function triggered when a file is selected.
//      */
//     onFileUpload: (event: ChangeEvent<HTMLInputElement>) => void;
// }

// export const CustomFileInput: FC<FileInputProps> = ({
//     allowedFiles = [],
//     onFileUpload,
//     isLoading,
//     disabled,
//     attachIcon = 'Upload' //<AttachIcon />
// }) => {
//     const { theme } = useContext(ChatContext);
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     return (
//         <div ref={fileInputRef} className={cn(theme?.input?.upload)}>
//             <MyFileUpload
//                 icon={attachIcon}
//                 text=""
//                 accept={allowedFiles}
//                 onChangeEvent={onFileUpload}
//                 isDisabled={isLoading || disabled}
//                 loading={isLoading}
//                 maxFiles={10}
//             />
//         </div>
//     );
// };

// interface ChatInputProps {
//     /**
//      * Default value for the input field.
//      */
//     defaultValue?: string;

//     /**
//      * Allowed file types for upload.
//      */
//     allowedFiles?: string[];

//     /**
//      * Placeholder text for the input field.
//      */
//     placeholder?: string;

//     /**
//      * Icon to show for send.
//      */
//     sendIcon?: ReactElement;

//     /**
//      * Icon to show for stop.
//      */
//     stopIcon?: ReactElement;

//     /**
//      * Icon to show for attach.
//      */
//     attachIcon?: string;
// }

// export interface ChatInputRef {
//     /**
//      * Focus the input.
//      */
//     focus: () => void;
// }

// export const CustomChatInput = forwardRef<ChatInputRef, ChatInputProps>(
//     (
//         {
//             allowedFiles = [],
//             placeholder,
//             defaultValue,
//             sendIcon = <BsFillSendFill />,
//             stopIcon = <BsFillSendXFill />,
//             attachIcon = 'Upload'
//         },
//         ref
//     ) => {
//         const {
//             theme,
//             isLoading,
//             disabled,
//             sendMessage,
//             stopMessage,
//             fileUpload,
//             activeSessionId
//         } = useContext(ChatContext);
//         const [message, setMessage] = useState<string>('');
//         const inputRef = useRef<HTMLTextAreaElement | null>(null);
//         const [showDrawer, setShowDrawer] = useState(false);
//         const [files, setFiles] = useState<ConversationFile[]>([]);

//         useEffect(() => {
//             if (inputRef.current) {
//                 inputRef.current.focus();
//             }
//         }, [activeSessionId, inputRef]);

//         useImperativeHandle(ref, () => ({
//             focus: () => {
//                 inputRef.current?.focus();
//             }
//         }));

//         const handleSendMessage = () => {
//             if (message.trim()) {
//                 sendMessage?.(message);
//                 setMessage('');
//             }
//         };

//         const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
//             if (e.key === 'Enter' && !e.shiftKey) {
//                 e.preventDefault();
//                 handleSendMessage();
//             }
//         };

//         const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
//             const files = event.target.files;
//             if (!files) {
//                 return;
//             }
//             // FileList to file[]
//             const arrayFiles = Array.from(files);

//             setFiles(arrayFiles);

//             // const file = event.target.files?.[0];
//             // if (file && fileUpload) {
//             //     fileUpload(file);
//             // }
//         };

//         const handledOnClick = (files: ConversationFile) => {
//             // this handled on click will show the file content
//             // to show on a modal
//             console.log('handledOnClick', files);
//         };

//         return (
//             <MyFlex
//                 //
//                 direction={'column'}
//                 bento
//             >
//                 <MyFlex
//                     direction={'row'}
//                     p={0}
//                     gap={3}
//                     align={'center'}
//                     flexWrap={'wrap'}
//                 >
//                     {files.map((file, index) => (
//                         <MyFlex
//                             p={0}
//                             _hover={{
//                                 backgroundColor: 'bg.muted',
//                                 // color: 'fg.emphasis',
//                                 textDecoration: 'underline',
//                                 color: 'gray.500'
//                             }}
//                             cursor={'pointer'}
//                             key={`custom-message-file-${file.name}`}
//                             onClick={() => {
//                                 handledOnClick(file);
//                             }}
//                             gap={0}
//                         >
//                             <ShowIconPerFile
//                                 key={`custom-message-file-${index}`}
//                                 file={file}
//                             />
//                             <MyButton
//                                 variant={'plain'}
//                                 aria-label="Delete"
//                                 icon={'TRASH'}
//                                 // colorPalette={'delete'}
//                                 size={'xs'}
//                                 p={0}
//                                 m={0}
//                                 onClick={() => {
//                                     setFiles(
//                                         files.filter((_, i) => i !== index)
//                                     );
//                                 }}
//                             />
//                         </MyFlex>
//                     ))}
//                 </MyFlex>
//                 <MyTextArea
//                     ref={inputRef}
//                     className={cn(theme?.input?.input)}
//                     autoFocus
//                     value={message}
//                     defaultValue={defaultValue}
//                     onKeyPress={handleKeyPress}
//                     placeholder={placeholder}
//                     disabled={isLoading || disabled}
//                     onChange={(e) => setMessage(e.target.value)}
//                 />
//                 <MyFlex
//                     direction={'row'}
//                     gap={3}
//                     p={0}
//                     px={5}
//                     align={'center'}
//                     justifyContent={'space-between'}
//                 >
//                     <MyFlex direction={'row'} gap={2} p={0}>
//                         {allowedFiles.length > 0 && (
//                             <CustomFileInput
//                                 allowedFiles={allowedFiles}
//                                 onFileUpload={handleFileUpload}
//                                 isLoading={isLoading}
//                                 disabled={disabled}
//                                 attachIcon={attachIcon}
//                             />
//                         )}

//                         <MyDrawer
//                             isOpen={showDrawer}
//                             onOpenChange={(isOpen) => setShowDrawer(isOpen)}
//                             trigger={
//                                 <MyButton
//                                     aria-label="Suggestions"
//                                     size={'xs'}
//                                     variant={'outline'}
//                                     disabled={disabled}
//                                     leftIcon="SAVE"
//                                     // className={cn(theme?.input?.actions?.upload)}
//                                     className={cn(theme?.input?.actions?.send)}
//                                     onClick={() => setShowDrawer(true)}
//                                 />
//                             }
//                             header="Suggestions"
//                         >
//                             Body
//                         </MyDrawer>
//                     </MyFlex>
//                     <MyFlex p={0}>
//                         {isLoading && (
//                             <MyButton
//                                 aria-label="Stop"
//                                 size={'xs'}
//                                 variant={'ghost'}
//                                 className={cn(theme?.input?.actions?.stop)}
//                                 onClick={stopMessage}
//                                 disabled={disabled}
//                             >
//                                 {stopIcon}
//                             </MyButton>
//                         )}
//                         <MyButton
//                             aria-label="Send"
//                             size={'xs'}
//                             variant={'ghost'}
//                             className={cn(theme?.input?.actions?.send)}
//                             onClick={handleSendMessage}
//                             disabled={isLoading || disabled}
//                         >
//                             {sendIcon}
//                         </MyButton>
//                     </MyFlex>
//                 </MyFlex>
//             </MyFlex>
//         );
//     }
// );

// interface NewSessionButtonProps extends PropsWithChildren {
//     /**
//      * Text for the new session button.
//      */
//     newSessionText?: string | ReactNode;
// }

// export const NewSessionButtonCustom: FC<NewSessionButtonProps> = ({
//     children,
//     newSessionText = 'New Session'
// }) => {
//     const { createSession, disabled } = useContext(ChatContext);

//     if (!children) {
//         return (
//             <MyFlex
//                 direction={'row'}
//                 gap={2}
//                 p={0}
//                 align={'center'}
//                 flex={1}
//                 width={'100%'}
//             >
//                 <MyButton
//                     leftIcon="ADD"
//                     onClick={createSession}
//                     width={'100%'}
//                     isDisabled={disabled}
//                 >
//                     {newSessionText}
//                 </MyButton>
//             </MyFlex>
//         );
//     }

//     return (
//         <>
//             <MyFlex
//                 direction={'row'}
//                 gap={2}
//                 p={0}
//                 align={'center'}
//                 flex={1}
//                 width={'100%'}
//                 onClick={createSession}
//             >
//                 {children}
//             </MyFlex>
//         </>
//     );
// };

// const ChatLLMCustom = () => {
//     const [sessions, setSessions] = useState<Session[]>([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [activeSessionId, setActiveSessionId] = useState<string>();

//     const handleNewMessage = useCallback(
//         async (message: string) => {
//             console.log('handleNewMessage', message);

//             const sessionId = activeSessionId || GetRamdom();

//             console.log('handleNewMessage', sessionId);

//             setIsLoading(true);
//             try {
//                 setSessions((prevSessions) => {
//                     const sessionIndex = prevSessions.findIndex(
//                         (s) => s.id === sessionId
//                     );
//                     if (sessionIndex === -1) {
//                         // Create a new session
//                         return [
//                             ...prevSessions,
//                             {
//                                 id: sessionId,
//                                 title: message.slice(0, 30),
//                                 createdAt: new Date(),
//                                 updatedAt: new Date(),
//                                 conversations: [
//                                     {
//                                         id: Date.now().toString(),
//                                         question: message,
//                                         response:
//                                             'Sorry, I couldnt generate a response.',
//                                         createdAt: new Date(),
//                                         updatedAt: new Date()
//                                     }
//                                 ]
//                             }
//                         ];
//                     } else {
//                         // Add to existing session
//                         const updatedSessions = [...prevSessions];
//                         updatedSessions[sessionIndex] = {
//                             ...updatedSessions[sessionIndex],
//                             updatedAt: new Date(),
//                             conversations: [
//                                 ...updatedSessions[sessionIndex].conversations,
//                                 {
//                                     id: Date.now().toString(),
//                                     question: message,
//                                     response:
//                                         'Sorry, I couldnt generate a response.',
//                                     createdAt: new Date(),
//                                     updatedAt: new Date()
//                                 }
//                             ]
//                         };
//                         return updatedSessions;
//                     }
//                 });

//                 setActiveSessionId(sessionId);
//             } catch (error) {
//                 console.error('Error calling OpenAI API:', error);
//             } finally {
//                 setIsLoading(false);
//             }
//         },
//         [activeSessionId]
//     );

//     const handleDeleteSession = useCallback((sessionId: string) => {
//         setSessions((prevSessions) =>
//             prevSessions.filter((s) => s.id !== sessionId)
//         );
//     }, []);

//     return (
//         <div className="dark:bg-gray-950 bg-white h-full">
//             <p>Active Session ID: {activeSessionId || 'No active session'}</p>
//             <Chat
//                 sessions={[
//                     ...fakeSessions,
//                     ...sessionsWithFiles,
//                     ...sessionWithSources,
//                     ...sessionWithCSVFiles,
//                     ...sessions
//                 ]}
//                 activeSessionId={activeSessionId}
//                 isLoading={isLoading}
//                 onStopMessage={() => console.log('onStopMessage')}
//                 onFileUpload={(file) => console.log(file)}
//                 onDeleteSession={handleDeleteSession}
//                 onSendMessage={handleNewMessage}
//                 onSelectSession={setActiveSessionId}
//                 onNewSession={() => {
//                     setActiveSessionId(undefined);
//                 }}
//             >
//                 <SessionsList>
//                     <NewSessionButtonCustom />
//                     {/* <NewSessionButton /> */}
//                     <MyDivider my={2} />
//                     <SessionGroups>
//                         {(groups) =>
//                             groups.map(({ heading, sessions }) => (
//                                 <SessionsGroup
//                                     heading={heading}
//                                     key={`sessions-group-${heading}`}
//                                 >
//                                     {sessions.map((s) => (
//                                         <SessionListItem
//                                             key={`session-list-item-${s.id}`}
//                                             session={s}
//                                         >
//                                             <CustomSessionListItem
//                                                 session={s}
//                                             />
//                                         </SessionListItem>
//                                     ))}
//                                 </SessionsGroup>
//                             ))
//                         }
//                     </SessionGroups>
//                 </SessionsList>

//                 <SessionMessagePanel>
//                     <SessionMessagesHeader>
//                         <CustomMessagesHeader />
//                     </SessionMessagesHeader>

//                     <SessionMessages>
//                         {(conversations) =>
//                             conversations.map((conversation, index) => (
//                                 <SessionMessage
//                                     conversation={conversation}
//                                     isLast={index === conversations.length - 1}
//                                     key={`Session-Message-${conversation.id}`}
//                                 >
//                                     {/* <MessageQuestion
//                                          question={conversation.question}
//                                          files={conversation.files}
//                                      >
//                                          <CustomMessageQuestion />
//                                      </MessageQuestion> */}
//                                     <CustomMessageQuestion
//                                         question={conversation.question}
//                                         files={conversation.files}
//                                     />

//                                     {/* <MessageResponse
//                                          response={conversation.response}
//                                      >
//                                          <CustomMessageResponse />
//                                      </MessageResponse> */}
//                                     {conversation.response && (
//                                         <CustomMessageResponse
//                                             response={conversation.response}
//                                         />
//                                     )}

//                                     {/* <MessageSources
//                                              sources={conversation.sources}
//                                          >
//                                              <CustomMessageSource />
//                                          </MessageSources> */}

//                                     {conversation.sources &&
//                                         conversation.sources.map((source) => (
//                                             <CustomMessageSource
//                                                 key={`Custom-Message-Source-${source.title}`}
//                                                 title={source.title}
//                                                 url={source.url}
//                                                 image={source.image}
//                                             />
//                                         ))}

//                                     {/* <MessageActions
//                                          question={conversation.question}
//                                          response={conversation.response}
//                                      /> */}
//                                     <CustomMessageActions
//                                         question={conversation.question}
//                                         response={conversation.response}
//                                     />

//                                     <br />
//                                 </SessionMessage>
//                             ))
//                         }
//                     </SessionMessages>

//                     <CustomChatInput
//                         allowedFiles={[
//                             '.pdf',
//                             '.docx',
//                             '.csv',
//                             '.jpg',
//                             '.jpeg',
//                             '.png',
//                             '.gif',
//                             '.svg',
//                             '.bmp',
//                             '.tiff',
//                             '.tif'
//                         ]}
//                         placeholder="Send a message"
//                     />
//                 </SessionMessagePanel>
//             </Chat>
//         </div>
//     );
// };

// export default ChatLLMCustom;
