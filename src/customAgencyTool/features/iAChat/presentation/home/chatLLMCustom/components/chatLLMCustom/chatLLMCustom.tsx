// import {
//     MyButton,
//     MyDivider,
//     MyFlex
// } from '@src/customAgencyTool/components/ui';
// import { Chat, type Session } from 'reachat';
// import { useEffect, type FC } from 'react';
// import { DEFAULT_CONFIG } from '../..';
// import { useChat } from '../../hooks/useChat';
// import { useChatActions } from '../../hooks/useChatActions';
// import { useFiles } from '../../hooks/useFiles';
// import { useMessages } from '../../hooks/useMessages';
// import type { Message } from '../../types/chat';
// import FileList from '../file/fileList';
// import ChatInput from '../input/chatInput';
// import MessageActions from '../message/messageActions';
// import MessageQuestion from '../message/messageQuestion';
// import MessageResponse from '../message/messageResponse/messageResponse';
// import MessageSource from '../message/messageSource';
// import SessionHeader from '../session/sessionHeader';
// import SessionListItem from '../session/sessionListItem';

// interface ChatLLMCustomProps {
//     initialSessions?: Session[];
//     config?: typeof DEFAULT_CONFIG;
// }

// const ChatLLMCustom: FC<ChatLLMCustomProps> = ({
//     initialSessions = [],
//     config = DEFAULT_CONFIG
// }) => {
//     // Hooks personalizados
//     const {
//         sessions,
//         activeSessionId,
//         createSession,
//         deleteSession,
//         setActiveSession
//     } = useChat();

//     const { messages, sendMessage, isLoading } = useMessages(activeSessionId);

//     const { files, uploadFiles, removeFile } = useFiles();

//     const chatActions = useChatActions();

//     // Efecto para cargar sesiones iniciales
//     useEffect(() => {
//         if (initialSessions.length > 0) {
//             initialSessions.forEach((session) => {
//                 // Lógica para cargar sesiones iniciales
//             });
//         }
//     }, [initialSessions]);

//     // Handlers
//     const handleNewSession = () => {
//         const newSession = createSession();
//         setActiveSession(newSession.id);
//     };

//     const handleSelectSession = (session: Session) => {
//         setActiveSession(session.id);
//     };

//     const handleDeleteSession = (session: Session) => {
//         deleteSession(session.id);
//     };

//     const handleSendMessage = async (content: string, files?: File[]) => {
//         if (files?.length) {
//             await uploadFiles(files);
//         }
//         await sendMessage(content);
//     };

//     const renderMessage = (message: Message) => {
//         if (message.type === 'question') {
//             return (
//                 <MessageQuestion
//                     question={message.content}
//                     files={message.files}
//                     onFileClick={(file) => console.log('File clicked:', file)}
//                 />
//             );
//         }

//         if (message.sources?.length) {
//             return (
//                 <>
//                     <MessageResponse
//                         response={message.content}
//                         isLoading={isLoading}
//                     />
//                     {message.sources.map((source, index) => (
//                         <MessageSource
//                             key={`source-${index}`}
//                             source={source}
//                             variant="default"
//                         />
//                     ))}
//                 </>
//             );
//         }

//         return (
//             <MessageResponse response={message.content} isLoading={isLoading} />
//         );
//     };

//     return (
//         <Chat
//             sessions={sessions}
//             activeSessionId={activeSessionId}
//             isLoading={isLoading}
//             onStopMessage={() => {
//                 /* Implementar lógica de stop */
//             }}
//             // onFileUpload={uploadFiles}
//             // onDeleteSession={handleDeleteSession}
//             onSendMessage={handleSendMessage}
//             // onSelectSession={handleSelectSession}
//             onNewSession={handleNewSession}
//         >
//             <MyFlex direction="column" height="100vh">
//                 {/* Panel de sesiones */}
//                 <MyFlex
//                     direction="column"
//                     width="300px"
//                     p={4}
//                     borderRight="1px solid"
//                     borderColor="gray.200"
//                 >
//                     <MyButton
//                         onClick={handleNewSession}
//                         leftIcon="ADD"
//                         width="100%"
//                     >
//                         Nueva Sesión
//                     </MyButton>
//                     <MyDivider my={2} />
//                     {sessions.map((session) => (
//                         <SessionListItem
//                             key={session.id}
//                             session={session}
//                             isActive={session.id === activeSessionId}
//                             onSelect={() => handleSelectSession(session)}
//                             onDelete={() => handleDeleteSession(session)}
//                         />
//                     ))}
//                 </MyFlex>

//                 {/* Panel principal */}
//                 <MyFlex direction="column" flex={1}>
//                     {/* Encabezado de sesión */}
//                     <SessionHeader />

//                     {/* Lista de mensajes */}
//                     <MyFlex direction="column" flex={1} p={4} overflowY="auto">
//                         {messages.map((message, index) => (
//                             <MyFlex
//                                 key={message.id + index}
//                                 direction="column"
//                                 gap={2}
//                                 mb={4}
//                             >
//                                 {renderMessage(message)}
//                                 <MessageActions
//                                     question={message.content}
//                                     response={
//                                         message.type === 'response'
//                                             ? message.content
//                                             : ''
//                                     }
//                                     onCopy={() =>
//                                         chatActions.onCopy(message.content)
//                                     }
//                                     onUpvote={() =>
//                                         chatActions.onUpvote(message.id)
//                                     }
//                                     onDownvote={() =>
//                                         chatActions.onDownvote(message.id)
//                                     }
//                                     onRefresh={() =>
//                                         chatActions.onRefresh(message.id)
//                                     }
//                                 />
//                             </MyFlex>
//                         ))}
//                     </MyFlex>

//                     {/* Input de chat */}
//                     <MyFlex p={4} borderTop="1px solid" borderColor="gray.200">
//                         {files.length > 0 && (
//                             <FileList files={files} onDelete={removeFile} />
//                         )}
//                         <ChatInput
//                             allowedFiles={config.allowedFileTypes}
//                             maxFiles={config.maxFiles}
//                             placeholder="Escribe tu mensaje..."
//                             onSend={handleSendMessage}
//                             showSuggestions
//                             suggestionsContent={
//                                 <MyFlex direction="column" p={4}>
//                                     {/* Contenido de sugerencias */}
//                                 </MyFlex>
//                             }
//                         />
//                     </MyFlex>
//                 </MyFlex>
//             </MyFlex>
//         </Chat>
//     );
// };

// export default ChatLLMCustom;
