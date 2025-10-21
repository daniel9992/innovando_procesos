// import { MyFlex } from '@src/customAgencyTool/components/ui';
// import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
// import { GetRamdom } from '@src/customAgencyTool/utils/stringUtils/getRamdom';
// import {
//     Chat,
//     ChatInput,
//     NewSessionButton,
//     SessionGroups,
//     SessionMessagePanel,
//     SessionMessages,
//     SessionMessagesHeader,
//     SessionsList,
//     type Conversation,
//     type Session
// } from 'reachat';
// import { useState } from 'react';

// const Home = () => {
//     const [sessionActiveId, setSessionActiveId] = useState<string | undefined>(
//         undefined
//     );
//     const [isLoading, setIsLoading] = useState<boolean>(false);
//     const [sessions, setSessions] = useState<Session[]>([]);

//     // Simular respuestas automáticas
//     const getAutoResponse = (message: string) => {
//         const responses = [
//             'Entiendo tu mensaje.',
//             'Gracias por tu consulta.',
//             'Estoy procesando tu solicitud.',
//             `Has enviado: "${message}"`,
//             '¿Puedo ayudarte en algo más?'
//         ];
//         return responses[Math.floor(Math.random() * responses.length)];
//     };

//     const handledOnNewSession = () => {
//         const tempSession: Session = {
//             id: GetRamdom(),
//             title: `Chat ${sessions.length + 1}`,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//             conversations: []
//         };
//         setIsLoading(true);
//         setSessions((prev) => [...prev, tempSession]);
//         setSessionActiveId(tempSession.id); // Activar la nueva sesión automáticamente
//         setTimeout(() => {
//             setIsLoading(false);
//         }, 500);
//     };

//     const haneldOnDeleteSession = (sessionId: string) => {
//         setIsLoading(true);
//         setSessions((prev) => prev.filter((s) => s.id !== sessionId));
//         if (sessionActiveId === sessionId) {
//             setSessionActiveId(undefined);
//         }
//         setTimeout(() => {
//             setIsLoading(false);
//         }, 500);
//     };

//     const handledOnSendMessage = (message: string) => {
//         if (!sessionActiveId || !message.trim()) return;

//         setIsLoading(true);
//         const newConversation: Conversation = {
//             id: GetRamdom(),
//             question: message,
//             response: '',
//             createdAt: GetToday(),
//             updatedAt: GetToday()
//         };

//         // Actualizar las sesiones con el mensaje del usuario
//         setSessions((prev) =>
//             prev.map((s) => {
//                 if (s.id === sessionActiveId) {
//                     return {
//                         ...s,
//                         updatedAt: GetToday(),
//                         conversations: [...s.conversations, newConversation]
//                     };
//                 }
//                 return s;
//             })
//         );

//         // Simular respuesta después de un delay
//         setTimeout(() => {
//             const autoResponse = getAutoResponse(message);
//             setSessions((prev) =>
//                 prev.map((s) => {
//                     if (s.id === sessionActiveId) {
//                         const updatedConversations = [...s.conversations];
//                         updatedConversations[
//                             updatedConversations.length - 1
//                         ].response = autoResponse;
//                         return {
//                             ...s,
//                             conversations: updatedConversations
//                         };
//                     }
//                     return s;
//                 })
//             );
//             setIsLoading(false);
//         }, 1000);
//     };

//     // Actualizar título de la sesión
//     const handleUpdateSessionTitle = (sessionId: string, newTitle: string) => {
//         setSessions((prev) =>
//             prev.map((s) => {
//                 if (s.id === sessionId) {
//                     return {
//                         ...s,
//                         title: newTitle,
//                         updatedAt: GetToday()
//                     };
//                 }
//                 return s;
//             })
//         );
//     };

//     return (
//         <div>
//             <h2>Chat Application</h2>
//             {sessionActiveId && <p>Active Session: {sessionActiveId}</p>}

//             <MyFlex w={'80vw'} h={'80vh'} bg={'gray'}>
//                 <Chat
//                     sessions={sessions}
//                     viewType="console"
//                     isLoading={isLoading}
//                     onNewSession={handledOnNewSession}
//                     onDeleteSession={haneldOnDeleteSession}
//                     onSelectSession={setSessionActiveId}
//                     onSendMessage={handledOnSendMessage}
//                 >
//                     <SessionsList>
//                         <NewSessionButton />
//                         <SessionGroups />
//                     </SessionsList>
//                     <SessionMessagePanel>
//                         <SessionMessagesHeader />
//                         <SessionMessages />
//                         <ChatInput />
//                     </SessionMessagePanel>
//                 </Chat>
//             </MyFlex>
//         </div>
//     );
// };

// export default Home;
