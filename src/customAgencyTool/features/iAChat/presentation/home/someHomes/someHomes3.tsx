// import {
//     useAppDispatch,
//     useAppSelector
// } from '@src/customAgencyTool/app/hooks';
// import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
// import {
//     MyButton,
//     MyFlex,
//     MyHeading,
//     MyMenu,
//     MyText
// } from '@src/customAgencyTool/components/ui';
// import type { MenuItemButon } from '@src/customAgencyTool/components/ui/myMenu';
// import { useDialog } from '@src/customAgencyTool/context/appAlertDialog/useDialog';
// import {
//     model,
//     storage
// } from '@src/customAgencyTool/core/services/firebase.server';
// import { selectCurrentUser } from '@src/customAgencyTool/features/auth/infrastructure/authSlice';
// import {
//     GetToday,
//     ShowDate
// } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
// import { GetRamdom } from '@src/customAgencyTool/utils/stringUtils/getRamdom';
// import type { Content, Part } from 'firebase/ai';
// import { ref, uploadBytes } from 'firebase/storage';
// import { type FormikHelpers } from 'formik';
// import { AnimatePresence, motion } from 'motion/react';
// import { SessionGroups } from 'reachat';
// import {
//     useCallback,
//     useEffect,
//     useMemo,
//     useRef,
//     useState,
//     type FC,
//     type ReactNode
// } from 'react';
// import type { createSession } from 'react-router';
// import type {
//     ChatHistory,
//     StreamResponse
// } from '../../../domain/chatGenerate.model';
// import type {
//     ICustomChatConversation,
//     ICustomChatSession
// } from '../../../domain/customChat.model';
// import {
//     createConversation,
//     deleteConversation,
//     deleteSession,
//     updateSession
// } from '../../../infrastructure/chat.reducer';
// import { ChatStreamManager } from '../../../infrastructure/chatGenerativeModel/chatStreamManager';
// import {
//     chatConversationObsRepository,
//     chatSessionObsRepository
// } from '../../../infrastructure/compositionRoot';
// import { groupSessionsByDate } from '../../utils/grouping';
// import MyChatInput, { type IMyChat } from '../chat/components/myChatInput';
// import DialogToRename from '../components/dialogToRename';
// import ShowResponseMarkDown from '../components/showResponseMarkDown/showResponseMarkDown';
// import { mockDataConversations, mockDataSessions } from '../mockDataChat';

// interface ISelectedSession {
//     sessionId: string;
//     sessionTitle?: string;
//     showDrawer: boolean;
// }
// const initialState: ISelectedSession = {
//     sessionId: '',
//     showDrawer: false
// };

// const Home = () => {
//     const dispatch = useAppDispatch();
//     const currentUser = useAppSelector(selectCurrentUser);
//     /**
//      *  ? -----------------------------
//      *  *  Sessions
//      *  ? -----------------------------
//      */
//     const [sessionActiveId, setSessionActiveId] = useState<string | undefined>(
//         undefined
//     );
//     const chatSessionObservable = chatSessionObsRepository;
//     const [sessions, setSessions] = useState<ICustomChatSession[]>([]);
//     const [isEnableSessions, setIsEnableSessions] = useState(false);
//     const [isLoadingSessions, setIsLoadingSessions] = useState(false);
//     const [hasMoreSessions, setHasMoreSessions] = useState(true);

//     const loadMoreSessions = useCallback(async () => {
//         chatSessionObservable.loadMore();
//     }, [chatSessionObservable]);

//     useEffect(() => {
//         const dataSub = chatSessionObservable.data$.subscribe(setSessions);
//         const loadingSub =
//             chatSessionObservable.loading$.subscribe(setIsLoadingSessions);
//         const hasMoreSub =
//             chatSessionObservable.hasMore$.subscribe(setHasMoreSessions);

//         return () => {
//             dataSub.unsubscribe();
//             loadingSub.unsubscribe();
//             hasMoreSub.unsubscribe();
//         };
//     }, [chatSessionObservable]);

//     useEffect(() => {
//         chatSessionObservable.get([
//             {
//                 direction: 'asc',
//                 field: 'uid',
//                 value: currentUser.uid,
//                 operator: '=='
//             }
//         ]);
//     }, [chatSessionObservable, currentUser]);

//     const activeSession = useMemo(() => {
//         if (!sessionActiveId) {
//             return undefined;
//         }
//         return sessions.find((session) => session.id === sessionActiveId);
//     }, [sessionActiveId, sessions]);

//     const groupedSessions = useMemo(() => {
//         return groupSessionsByDate(sessions);
//     }, [sessions]);

//     const handledOnNewSessionOnClick = useCallback(() => {
//         const today = GetToday();

//         const tempSession: ICustomChatSession = {
//             id: '',
//             uid: currentUser.uid,
//             title: `Chat ${sessions.length + 1}`,
//             createdAt: today,
//             updatedAt: today,
//             conversations: []
//         };

//         dispatch(createSession({ values: tempSession }))
//             .then((result) => {
//                 console.log('Session created', result);
//                 const newSession = result.payload as ICustomChatSession;

//                 setSessionActiveId(newSession.id); // Activar la nueva sesión automáticamente
//             })
//             .catch((error) => {
//                 console.error('Error al crear la sesión', error);
//             });
//     }, [dispatch, currentUser, sessions]);

//     const handledOnNewSession = useCallback((): Promise<ICustomChatSession> => {
//         return new Promise((resolve, reject) => {
//             const today = GetToday();

//             const tempSession: ICustomChatSession = {
//                 id: '',
//                 uid: currentUser.uid,
//                 title: `Chat ${sessions.length + 1}`,
//                 createdAt: today,
//                 updatedAt: today,
//                 conversations: []
//             };

//             dispatch(createSession({ values: tempSession }))
//                 .then((result) => {
//                     console.log('Session created', result);
//                     const newSession = result.payload as ICustomChatSession;

//                     setSessions((prev) => [...prev, newSession]);
//                     setSessionActiveId(newSession.id); // Activar la nueva sesión automáticamente

//                     resolve(newSession);
//                 })
//                 .catch((error) => {
//                     console.error('Error al crear la sesión', error);
//                     reject(error);
//                 });
//         });
//     }, [dispatch, currentUser, sessions]);

//     /**
//      *  ? -----------------------------
//      *  *  Rename Session
//      *  ? -----------------------------
//      */
//     const [selectedSession, setSelectedSession] =
//         useState<ISelectedSession>(initialState);

//     const handledOnRenameSession = (
//         sessionId: string,
//         title: string | undefined
//     ) => {
//         setSelectedSession({
//             sessionId,
//             sessionTitle: title || '',
//             showDrawer: true
//         });
//     };

//     const hanledRenameSession = (sessionId: string, newTitle: string) => {
//         setSelectedSession(initialState);

//         const tempSession = sessions.find(
//             (session) => session.id === sessionId
//         );
//         if (!tempSession) {
//             return;
//         }
//         const copySession = { ...tempSession };
//         copySession.title = newTitle;
//         copySession.updatedAt = GetToday();
//         copySession.conversations = [];

//         dispatch(updateSession({ values: copySession })).then(() => {
//             console.log('Session updated');

//             setSessions((prev) => {
//                 return prev.map((session) => {
//                     if (session.id === sessionId) {
//                         return {
//                             ...session,
//                             title: newTitle,
//                             updatedAt: GetToday()
//                         };
//                     }
//                     return session;
//                 });
//             });
//         });
//     };
//     /**
//      *  ? -----------------------------
//      *  *  Delete Session
//      *  ? -----------------------------
//      */
//     const { showDialog } = useDialog();

//     const hanledDeleteSession = async (
//         sessionId: string,
//         newTitle: string | undefined
//     ) => {
//         const session = sessions.find((session) => session.id === sessionId);
//         if (!session) {
//             return;
//         }

//         const askResult = await showDialog({
//             title: `¿Estás seguro que quieres eliminar la sesión`,
//             message: (
//                 <div>
//                     <MyText>
//                         <span style={{ color: 'gray' }}>Sesión:</span>{' '}
//                         {newTitle || ''}
//                     </MyText>
//                     <br />
//                     <p>
//                         Esta sesión será eliminada de la lista de sesiones y
//                         también de la base de datos.
//                     </p>
//                     <br />
//                     <p>
//                         Si no quieres eliminar la sesión, puedes cancelar la
//                         operación.
//                     </p>
//                 </div>
//             ),
//             buttons: [
//                 {
//                     label: 'Cancelar',
//                     variant: 'outline',
//                     value: false
//                 },
//                 {
//                     label: 'Eliminar',
//                     colorPalette: 'red',
//                     iconLeft: 'TRASH',
//                     value: true
//                 }
//             ]
//         });

//         if (askResult === true) {
//             dispatch(deleteSession({ values: session })).then(() => {
//                 console.log('Session deleted');

//                 setSessions((prev) => {
//                     return prev.filter((session) => session.id !== sessionId);
//                 });

//                 setSelectedSession(initialState);
//             });
//         }
//     };

//     /**
//      *  ? -----------------------------
//      *  *  Conversations
//      *  ? -----------------------------
//      */

//     const chatConversationObservable = chatConversationObsRepository;
//     const [conversations, setConversations] = useState<
//         ICustomChatConversation[]
//     >([]);
//     const [isLoadingConversations, setIsLoadingConversations] = useState(false);
//     const [hasMoreConversations, setHasMoreConversations] = useState(true);

//     const loadMoreConversations = useCallback(async () => {
//         chatConversationObservable.loadMore();
//     }, [chatConversationObservable]);

//     useEffect(() => {
//         const dataSub =
//             chatConversationObservable.data$.subscribe(setConversations);
//         const loadingSub = chatConversationObservable.loading$.subscribe(
//             setIsLoadingConversations
//         );
//         const hasMoreSub = chatConversationObservable.hasMore$.subscribe(
//             setHasMoreConversations
//         );

//         return () => {
//             dataSub.unsubscribe();
//             loadingSub.unsubscribe();
//             hasMoreSub.unsubscribe();
//         };
//     }, [chatConversationObservable]);

//     useEffect(() => {
//         if (!sessionActiveId) {
//             return;
//         }
//         chatConversationObservable.get([
//             {
//                 direction: 'asc',
//                 field: 'sessionToBelongsTo',
//                 value: sessionActiveId,
//                 operator: '=='
//             }
//         ]);
//     }, [chatConversationObservable, sessionActiveId]);

//     const conversationPerSession = useMemo(() => {
//         if (!sessionActiveId) {
//             return [];
//         }
//         return conversations;
//     }, [sessionActiveId, conversations]);

//     const handledOnDeleteConversation = useCallback(
//         (conversation: ICustomChatConversation) => {
//             dispatch(deleteConversation({ values: conversation })).then(() => {
//                 console.log('Conversation deleted');

//                 setConversations((prev) => {
//                     return prev.filter((item) => item.id !== conversation.id);
//                 });
//             });

//             setConversations((prev) => {
//                 return prev.filter((item) => item.id !== conversation.id);
//             });
//         },
//         [setConversations, dispatch]
//     );

//     /**
//      *  ? -----------------------------
//      *  *  IA Model
//      *  ? -----------------------------
//      */
//     const adapterConversationToChatHistory = useCallback(
//         (conversation: ICustomChatConversation) => {
//             const history: ChatHistory = [];
//             const user: Content = {
//                 role: 'user',
//                 parts: [{ text: conversation.question }]
//             };
//             history.push(user);
//             const model: Content = {
//                 role: 'model',
//                 parts: [{ text: conversation.response || '' }]
//             };
//             if (conversation.response) {
//                 history.push(model);
//             }
//             const withOutEmpty = history.filter(
//                 (item) => item.parts.length > 0
//             );
//             const withOutDuplicates = withOutEmpty.filter(
//                 (item, index, self) => {
//                     return (
//                         index ===
//                         self.findIndex(
//                             (t) => t.parts[0].text === item.parts[0].text
//                         )
//                     );
//                 }
//             );

//             return withOutDuplicates;
//         },
//         []
//     );

//     const chatModelManager = useMemo(() => {
//         if (!sessionActiveId) {
//             return undefined;
//         }
//         const savedHistory: ChatHistory = conversationPerSession
//             .map(adapterConversationToChatHistory)
//             .flat();

//         return new ChatStreamManager(model, savedHistory);
//     }, [
//         sessionActiveId,
//         conversationPerSession,
//         adapterConversationToChatHistory
//     ]);

//     const [response, setResponse] = useState<string>('');
//     const [isStreaming, setIsStreaming] = useState(false);
//     const [error, setError] = useState<Error | null>(null);
//     const [status, setStatus] = useState<string>('idle');
//     const [streamResponse, setStreamResponse] = useState<StreamResponse>();

//     useEffect(() => {
//         if (!chatModelManager) {
//             return;
//         }
//         const subscription = chatModelManager.getStream().subscribe({
//             next: (streamResponse) => {
//                 setStreamResponse(streamResponse);
//                 setResponse((prev) => prev + streamResponse.text);
//                 setIsStreaming(!streamResponse.isComplete);
//                 setStatus(streamResponse.status || 'idle');
//                 if (streamResponse.error) {
//                     console.error('streamResponse.error', streamResponse.error);
//                     setError(streamResponse.error);
//                 }
//             }
//         });

//         return () => subscription.unsubscribe();
//     }, [chatModelManager]);

//     interface ManageLastPrompt {
//         prompt: IMyChat;
//         activeSessionId: string;
//     }
//     const [theLastPrompt, setTheLastPrompt] = useState<ManageLastPrompt>();

//     useEffect(() => {
//         if (!streamResponse) {
//             return;
//         }

//         if (streamResponse.isComplete) {
//             console.log('streamResponse', streamResponse);
//             const newConversation: ICustomChatConversation = {
//                 id: '',
//                 sessionToBelongsTo: theLastPrompt?.activeSessionId || '',
//                 createdAt: GetToday(),
//                 updatedAt: GetToday(),
//                 question: theLastPrompt?.prompt.message || '',
//                 response: response
//             };

//             // save the conversation
//             dispatch(createConversation({ values: newConversation })).then(
//                 () => {
//                     console.log('Conversation created');
//                     setConversations((prev) => [...prev, newConversation]);
//                 }
//             );
//         }
//     }, [streamResponse, theLastPrompt, dispatch, response]);

//     const handledOnNewConversation = useCallback(
//         async (values: IMyChat, formikHelpers?: FormikHelpers<IMyChat>) => {
//             try {
//                 let localActiveSessionID = sessionActiveId;
//                 if (!localActiveSessionID) {
//                     const localActiveSession = await handledOnNewSession();
//                     if (!localActiveSession) {
//                         console.log('No se pudo crear la sesión');
//                         return;
//                     }
//                     setSessionActiveId(localActiveSession.id);
//                     localActiveSessionID = localActiveSession.id;
//                 }

//                 // 1. Existen dos caminos
//                 // -> por base64
//                 // -> usar el Storage

//                 // 2. Usar el storage
//                 // Upload an file using Cloud Storage for Firebase.
//                 const bucketpath = `/chatSessionCollection/{uid}/{sessionId}/{conversationId}`;
//                 bucketpath.replace('{uid}', currentUser.uid);
//                 bucketpath.replace('{sessionId}', localActiveSessionID);

//                 const fileParts: Part[] = values.fileParts || [];

//                 values.files.forEach(async (file) => {
//                     const storageRef = ref(storage, bucketpath);
//                     const uploadResult = await uploadBytes(storageRef, file);

//                     // Get the MIME type and Cloud Storage for Firebase URL.
//                     // toString() is the simplest way to construct the Cloud Storage for Firebase URL
//                     // in the required format.
//                     const mimeType = uploadResult.metadata.contentType || '';
//                     const storageUrl = uploadResult.ref.toString();

//                     // Construct the imagePart with the MIME type and the URL.
//                     const imagePart: Part = {
//                         fileData: { mimeType, fileUri: storageUrl }
//                     };

//                     fileParts.push(imagePart);
//                 });

//                 // 3. Preguntar al modelo si puede generar el texto
//                 const prompt = values.message;
//                 if (chatModelManager) {
//                     await chatModelManager.startStream({
//                         prompt,
//                         parts: fileParts
//                     });
//                     setTheLastPrompt({
//                         prompt: values,
//                         activeSessionId: localActiveSessionID
//                     });
//                     formikHelpers?.setSubmitting(false);
//                 } else {
//                     formikHelpers?.setSubmitting(false);
//                 }
//             } catch (error) {
//                 console.error('Error al crear la conversación', error);
//                 formikHelpers?.setSubmitting(false);
//             }
//         },
//         [sessionActiveId, currentUser, handledOnNewSession, chatModelManager]
//     );

//     const handledOnRefreshConversation = useCallback(
//         (conversation: ICustomChatConversation) => {
//             const myChat: IMyChat = {
//                 message: conversation.question,
//                 files: [],
//                 fileParts: conversation.fileParts
//             };

//             handledOnNewConversation(myChat);
//         },
//         [handledOnNewConversation]
//     );

//     const handledOnStopConversation = useCallback(() => {
//         if (!chatModelManager) {
//             return;
//         }
//         // stop model
//         chatModelManager.stopStream();
//     }, [chatModelManager]);

//     /**
//      *  ? -----------------------------
//      *  *  Render
//      *  ? -----------------------------
//      */
//     return (
//         <div>
//             <AnimatePresence initial={false}>
//                 <MyFlex
//                     w={'92vw'}
//                     h={'90vh'}
//                     // bg={'gray'}
//                     justifyContent={'space-between'}
//                     p={0}
//                 >
//                     <MyFlex
//                         flex={1}
//                         direction={'column'}
//                         h={'100%'}
//                         justifyContent={'flex-start'}
//                         px={3}
//                         boxShadow={'md'}
//                     >
//                         <WrapDiv>
//                             <MyFlex justifyContent={'center'} align={'center'}>
//                                 <MyButton
//                                     leftIcon={'ADD'}
//                                     onClick={handledOnNewSessionOnClick}
//                                     width={'100%'}
//                                     disabled={isEnableSessions}
//                                 >
//                                     New Session
//                                 </MyButton>
//                             </MyFlex>
//                         </WrapDiv>
//                         <SessionGroups
//                             isEnableSessions={false}
//                             sessions={sessions}
//                             isLoadingSessions={isLoadingSessions}
//                             hasMoreSessions={hasMoreSessions}
//                             onSelectSession={(session) => {
//                                 // Lógica para seleccionar una sesión
//                                 setSessionActiveId(session.id);
//                             }}
//                             onMenuSession={(session, action) => {
//                                 // Lógica para manejar los menús de una sesión
//                                 console.log('Menu Session', session, action);
//                                 if (action === 'rename') {
//                                     handledOnRenameSession(
//                                         session.id,
//                                         session.title
//                                     );
//                                 }
//                                 if (action === 'delete') {
//                                     hanledDeleteSession(
//                                         session.id,
//                                         session.title
//                                     );
//                                 }
//                             }}
//                             loadMoreSessions={() => {
//                                 // Lógica para cargar más sesiones
//                                 loadMoreSessions();
//                             }}
//                         />
//                     </MyFlex>
//                     <MyFlex
//                         flex={3}
//                         direction={'column'}
//                         h={'100%'}
//                         //  bg={'gray.800'}
//                         justifyContent={'space-between'}
//                     >
//                         <MyFlex
//                             direction={'column'}
//                             p={0}
//                             justifyContent={'flex-start'}
//                             overflowY={'auto'}
//                         >
//                             {activeSession && (
//                                 <MyFlex
//                                     direction={'row'}
//                                     justifyContent={'space-between'}
//                                     align={'center'}
//                                     p={0}
//                                 >
//                                     <MyText fontWeight={'semibold'}>
//                                         {activeSession.title}
//                                     </MyText>
//                                     <MyText color={'gray'} fontSize={'0.8rem'}>
//                                         {ShowDate(
//                                             activeSession.createdAt,
//                                             'D [-] MMMM [-] YYYY hh:mm:ss',
//                                             'es'
//                                         )}
//                                     </MyText>
//                                 </MyFlex>
//                             )}

//                             {conversationPerSession.map(
//                                 (conversation, index) => (
//                                     <WrapDiv key={`warp-div-${index}`}>
//                                         <MyFlex
//                                             key={conversation.id}
//                                             direction={'column'}
//                                             bg={'bg.muted'}
//                                             px={2}
//                                         >
//                                             <MyFlex
//                                                 direction={'row'}
//                                                 justify={'space-between'}
//                                                 align={'center'}
//                                                 p={0}
//                                             >
//                                                 <MyFlex
//                                                     direction={'column'}
//                                                     gap={0}
//                                                     p={0}
//                                                 >
//                                                     <MyText
//                                                         fontSize={'0.8rem'}
//                                                         color={'gray'}
//                                                     >
//                                                         {ShowDate(
//                                                             conversation.createdAt,
//                                                             'D[-] MMMM[-] YYYY hh:mm:ss',
//                                                             'es'
//                                                         )}
//                                                     </MyText>
//                                                     <MyText
//                                                         color={
//                                                             conversation.response
//                                                                 ? 'gray'
//                                                                 : ''
//                                                         }
//                                                         fontWeight={'semibold'}
//                                                     >
//                                                         {conversation.question}
//                                                     </MyText>
//                                                 </MyFlex>
//                                                 <MyFlex
//                                                     direction={'row'}
//                                                     gap={0}
//                                                 >
//                                                     {isStreaming ? (
//                                                         <>
//                                                             <MyButton
//                                                                 icon={'Stop'}
//                                                                 size={'xs'}
//                                                                 variant={
//                                                                     'plain'
//                                                                 }
//                                                                 aria-label={
//                                                                     'Stop Conversation'
//                                                                 }
//                                                                 onClick={
//                                                                     handledOnStopConversation
//                                                                 }
//                                                             />
//                                                         </>
//                                                     ) : (
//                                                         <>
//                                                             <MyButton
//                                                                 icon={'REFRESH'}
//                                                                 size={'xs'}
//                                                                 variant={
//                                                                     'plain'
//                                                                 }
//                                                                 aria-label={
//                                                                     'Refresh Conversation'
//                                                                 }
//                                                                 onClick={() => {
//                                                                     handledOnRefreshConversation(
//                                                                         conversation
//                                                                     );
//                                                                 }}
//                                                             />
//                                                         </>
//                                                     )}

//                                                     <MyButton
//                                                         icon={'TRASH'}
//                                                         size={'xs'}
//                                                         variant={'plain'}
//                                                         colorPalette={'red'}
//                                                         aria-label={
//                                                             'Delete Conversation'
//                                                         }
//                                                         onClick={() => {
//                                                             handledOnDeleteConversation(
//                                                                 conversation
//                                                             );
//                                                         }}
//                                                     />
//                                                 </MyFlex>
//                                             </MyFlex>

//                                             <div>
//                                                 {conversation.response && (
//                                                     <ShowResponseMarkDown
//                                                         response={
//                                                             conversation.response
//                                                         }
//                                                     />
//                                                 )}
//                                             </div>
//                                         </MyFlex>
//                                     </WrapDiv>
//                                 )
//                             )}

//                             {isLoadingConversations && (
//                                 <MyFlex bg={'bg.muted'} px={2} opacity={0.5}>
//                                     <LoadingWithText
//                                         text={'Generando respuesta...'}
//                                     />
//                                 </MyFlex>
//                             )}

//                             <p>Active Session id: {sessionActiveId}</p>
//                             <p>
//                                 Is streaming: {isStreaming ? 'true' : 'false'}
//                             </p>
//                             <p>Status: {status}</p>
//                             <p>Error: {error?.message}</p>
//                             <p>Response: {response}</p>
//                         </MyFlex>
//                         <MyFlex>
//                             <MyChatInput
//                                 onSubmit={handledOnNewConversation}
//                                 isThinking={status === 'streaming'}
//                             />
//                         </MyFlex>
//                     </MyFlex>
//                 </MyFlex>
//             </AnimatePresence>

//             <DialogToRename
//                 headerDialog="Renombrar sesión"
//                 fileToRename="Nombre de la sesión"
//                 showDialog={selectedSession.showDrawer}
//                 onClose={() => {
//                     setSelectedSession(initialState);
//                 }}
//                 title={selectedSession.sessionTitle}
//                 onSubmit={(newTitle) => {
//                     if (!selectedSession.sessionTitle) {
//                         return;
//                     }
//                     hanledRenameSession(selectedSession.sessionId, newTitle);
//                 }}
//             />
//         </div>
//     );
// };

// interface IWrap {
//     children: ReactNode;
// }

// const WrapDiv: FC<IWrap> = ({ children }) => {
//     return (
//         <motion.div
//             initial={{ opacity: 0, y: 0 }}
//             animate={{ opacity: 1, y: 1 }}
//             transition={{
//                 duration: 0.5,
//                 scale: {
//                     type: 'spring',
//                     visualDuration: 0.4,
//                     bounce: 0.5
//                 }
//             }}
//         >
//             {children}
//         </motion.div>
//     );
// };

// export default Home;

// const Home1 = () => {
//     const currentUser = useAppSelector(selectCurrentUser);
//     /**
//      *  ? -----------------------------
//      *  *  Sessions
//      *  ? -----------------------------
//      */
//     const [sessionActiveId, setSessionActiveId] = useState<string | undefined>(
//         undefined
//     );
//     const [isSessionLoading, setIsSessionLoading] = useState<boolean>(false);
//     const [isEnableSessions, setIsEnableSessions] = useState(false);
//     const [sessions, setSessions] = useState<ICustomChatSession[]>([
//         ...mockDataSessions
//     ]);
//     const activeSession = useMemo(() => {
//         if (!sessionActiveId) {
//             return undefined;
//         }
//         return sessions.find((session) => session.id === sessionActiveId);
//     }, [sessionActiveId, sessions]);

//     const groupedSessions = useMemo(() => {
//         return groupSessionsByDate(sessions);
//     }, [sessions]);

//     const handledOnNewSession = () => {
//         const tempSession: ICustomChatSession = {
//             id: GetRamdom(),
//             uid: currentUser.uid,
//             title: `Chat ${sessions.length + 1}`,
//             createdAt: GetToday(),
//             updatedAt: GetToday(),
//             conversations: []
//         };
//         setIsSessionLoading(true);
//         setSessions((prev) => [...prev, tempSession]);
//         setSessionActiveId(tempSession.id); // Activar la nueva sesión automáticamente
//         setTimeout(() => {
//             setIsSessionLoading(false);
//         }, 500);
//     };

//     /**
//      *  ? -----------------------------
//      *  *  Rename Session
//      *  ? -----------------------------
//      */
//     const [selectedSession, setSelectedSession] =
//         useState<ISelectedSession>(initialState);

//     const handledOnRenameSession = (
//         sessionId: string,
//         title: string | undefined
//     ) => {
//         setSelectedSession({
//             sessionId,
//             sessionTitle: title || '',
//             showDrawer: true
//         });
//     };

//     const hanledRenameSession = (sessionId: string, newTitle: string) => {
//         setSelectedSession(initialState);

//         setSessions((prev) => {
//             return prev.map((session) => {
//                 if (session.id === sessionId) {
//                     return {
//                         ...session,
//                         title: newTitle
//                     };
//                 }
//                 return session;
//             });
//         });
//     };
//     /**
//      *  ? -----------------------------
//      *  *  Delete Session
//      *  ? -----------------------------
//      */
//     const { showDialog } = useDialog();

//     const hanledDeleteSession = async (
//         sessionId: string,
//         newTitle: string | undefined
//     ) => {
//         const askResult = await showDialog({
//             title: `¿Estás seguro que quieres eliminar la sesión`,
//             message: (
//                 <div>
//                     <MyText>
//                         <span style={{ color: 'gray' }}>Sesión:</span>{' '}
//                         {newTitle || ''}
//                     </MyText>
//                     <br />
//                     <p>
//                         Esta sesión será eliminada de la lista de sesiones y
//                         también de la base de datos.
//                     </p>
//                     <br />
//                     <p>
//                         Si no quieres eliminar la sesión, puedes cancelar la
//                         operación.
//                     </p>
//                 </div>
//             ),
//             buttons: [
//                 {
//                     label: 'Cancelar',
//                     variant: 'outline',
//                     value: false
//                 },
//                 {
//                     label: 'Eliminar',
//                     colorPalette: 'red',
//                     iconLeft: 'TRASH',
//                     value: true
//                 }
//             ]
//         });

//         if (askResult === true) {
//             setSessions((prev) => {
//                 return prev.filter((session) => session.id !== sessionId);
//             });

//             setSelectedSession(initialState);
//         }
//     };

//     /**
//      *  ? -----------------------------
//      *  *  IA Model
//      *  ? -----------------------------
//      */

//     /**
//      *  ? -----------------------------
//      *  *  Conversations
//      *  ? -----------------------------
//      */
//     const conversationRef = useRef<HTMLDivElement>(null);

//     const [isLoadingConversations, setIsLoadingConversations] = useState(false);

//     const [conversations, setConversations] = useState<
//         ICustomChatConversation[]
//     >([...mockDataConversations]);

//     const [conversationActionsBts, setConversationActionsBts] = useState<
//         MenuItemButon[]
//     >([]);

//     const conversationPerSession = useMemo(() => {
//         if (!sessionActiveId) {
//             return [];
//         }
//         return conversations.filter(
//             (conversation) =>
//                 conversation.sessionToBelongsTo === sessionActiveId
//         );
//     }, [sessionActiveId, conversations]);

//     const handledOnNewConversation = useCallback(
//         (values: IMyChat, formikHelpers: FormikHelpers<IMyChat>) => {
//             const tempConversation: ICustomChatConversation = {
//                 id: GetRamdom(),
//                 sessionToBelongsTo: '',
//                 createdAt: GetToday(),
//                 updatedAt: GetToday(),
//                 question: values.message
//             };

//             if (sessionActiveId) {
//                 tempConversation.sessionToBelongsTo = sessionActiveId;
//             } else {
//                 // Si no hay sesión activa, crea una nueva
//                 const idSession = GetRamdom();
//                 const newSession: ICustomChatSession = {
//                     id: idSession,
//                     uid: currentUser.uid,
//                     title: 'New Session',
//                     createdAt: GetToday(),
//                     updatedAt: GetToday(),
//                     conversations: []
//                 };
//                 setSessions((prev) => [...prev, newSession]);
//                 tempConversation.sessionToBelongsTo = idSession;
//                 setSessionActiveId(idSession);
//             }

//             setConversations((prev) => [...prev, tempConversation]);
//             setConversationActionsBts([
//                 {
//                     id: 'stop',
//                     leftIcon: 'Stop',
//                     label: 'Detener',
//                     isActive: false,
//                     allowRoles: [],
//                     onClick: () => {
//                         console.log('Detener');
//                     }
//                 }
//             ]);

//             setIsEnableSessions(true);
//             setTimeout(() => {
//                 formikHelpers.setSubmitting(false);
//                 setConversationActionsBts([
//                     {
//                         id: 'refresh',
//                         leftIcon: 'REFRESH',
//                         label: 'Reintentar',
//                         isActive: false,
//                         allowRoles: [],
//                         onClick: () => {
//                             console.log('Reintentar');
//                         }
//                     }
//                 ]);
//             }, 5000);

//             setTimeout(() => {
//                 setIsEnableSessions(false);
//                 formikHelpers.setSubmitting(false);
//                 setConversationActionsBts([]);
//             }, 10000);
//         },
//         [sessionActiveId, currentUser]
//     );

//     const handledOnDeleteConversation = useCallback(
//         (conversation: ICustomChatConversation) => {
//             setConversations((prev) => {
//                 return prev.filter((item) => item.id !== conversation.id);
//             });
//         },
//         [setConversations]
//     );

//     const handledOnRefreshConversation = useCallback(
//         (conversation: ICustomChatConversation) => {
//             const newConversation: ICustomChatConversation = {
//                 ...conversation,
//                 id: GetRamdom(),
//                 createdAt: GetToday(),
//                 updatedAt: GetToday(),
//                 question: conversation.question,
//                 response: conversation.response
//             };

//             setIsLoadingConversations(true);
//             setIsEnableSessions(true);

//             setTimeout(() => {
//                 setConversations((prev) => {
//                     return [...prev, newConversation];
//                 });
//                 setIsLoadingConversations(false);
//                 setIsEnableSessions(false);
//             }, 500);
//         },
//         [setConversations]
//     );

//     /**
//      *  ? -----------------------------
//      *  *  Render
//      *  ? -----------------------------
//      */
//     return (
//         <div>
//             <AnimatePresence initial={false}>
//                 <MyFlex
//                     w={'92vw'}
//                     h={'90vh'}
//                     // bg={'gray'}
//                     justifyContent={'space-between'}
//                     p={0}
//                 >
//                     <MyFlex
//                         flex={1}
//                         direction={'column'}
//                         h={'100%'}
//                         justifyContent={'flex-start'}
//                         px={3}
//                         boxShadow={'md'}
//                     >
//                         <WrapDiv>
//                             <MyFlex justifyContent={'center'} align={'center'}>
//                                 <MyButton
//                                     leftIcon={'ADD'}
//                                     onClick={handledOnNewSession}
//                                     width={'100%'}
//                                     disabled={isEnableSessions}
//                                 >
//                                     New Session
//                                 </MyButton>
//                             </MyFlex>
//                         </WrapDiv>
//                         <MyFlex direction={'column'} p={0} overflowY={'auto'}>
//                             {groupedSessions.map(({ heading, sessions }) => (
//                                 <MyFlex
//                                     key={heading}
//                                     direction={'column'}
//                                     h={'100%'}
//                                     // bg={'gray.800'}
//                                     p={0}
//                                 >
//                                     <MyFlex
//                                         direction={'column'}
//                                         h={'100%'}
//                                         // bg={'gray.800'}
//                                         p={0}
//                                     >
//                                         <MyHeading
//                                             color={'gray'}
//                                             fontWeight={'semibold'}
//                                         >
//                                             {heading}
//                                         </MyHeading>
//                                         {sessions.map((session) => (
//                                             <MyFlex
//                                                 key={session.id}
//                                                 direction={'row'}
//                                                 justifyContent={'space-between'}
//                                                 align={'center'}
//                                                 // h={'100%'}
//                                                 // bg={'gray.800'}
//                                                 p={0}
//                                                 ps={2}
//                                                 _hover={{
//                                                     backgroundColor: 'bg.muted'
//                                                 }}
//                                             >
//                                                 <MyText
//                                                     truncate={true}
//                                                     cursor={
//                                                         isEnableSessions
//                                                             ? 'not-allowed'
//                                                             : 'pointer'
//                                                     }
//                                                     onClick={() => {
//                                                         if (isEnableSessions) {
//                                                             return;
//                                                         }
//                                                         setSessionActiveId(
//                                                             session.id
//                                                         );
//                                                     }}
//                                                 >
//                                                     {session.title}
//                                                 </MyText>

//                                                 <MyMenu
//                                                     triggerAsChild={
//                                                         <MyButton
//                                                             size={'xs'}
//                                                             leftIcon={
//                                                                 'MENU_DOTS'
//                                                             }
//                                                             variant={'plain'}
//                                                             disabled={
//                                                                 isEnableSessions
//                                                             }
//                                                             aria-label={
//                                                                 'Menu ' +
//                                                                 session.title
//                                                             }
//                                                         />
//                                                     }
//                                                     verticalMenuItems={[
//                                                         {
//                                                             id: 'rename',
//                                                             leftIcon: 'EDIT',
//                                                             label: 'Rename',
//                                                             type: 'item',
//                                                             isActive:
//                                                                 session.disabled
//                                                                     ? true
//                                                                     : false,
//                                                             allowRoles: [],
//                                                             onClick: () => {
//                                                                 handledOnRenameSession(
//                                                                     session.id,
//                                                                     session.title
//                                                                 );
//                                                             }
//                                                         },
//                                                         {
//                                                             id: 'delete',
//                                                             leftIcon: 'TRASH',
//                                                             label: 'Delete',
//                                                             type: 'item',
//                                                             isActive:
//                                                                 session.disabled
//                                                                     ? true
//                                                                     : false,
//                                                             color: 'red',
//                                                             allowRoles: [],
//                                                             onClick: () => {
//                                                                 hanledDeleteSession(
//                                                                     session.id,
//                                                                     session.title
//                                                                 );
//                                                             }
//                                                         }
//                                                     ]}
//                                                 />
//                                             </MyFlex>
//                                         ))}
//                                     </MyFlex>
//                                 </MyFlex>
//                             ))}

//                             {isSessionLoading && (
//                                 <MyFlex
//                                     justifyContent={'center'}
//                                     align={'center'}
//                                 >
//                                     <LoadingWithText text={'Cargando...'} />
//                                 </MyFlex>
//                             )}
//                         </MyFlex>
//                     </MyFlex>
//                     <MyFlex
//                         ref={conversationRef}
//                         flex={3}
//                         direction={'column'}
//                         h={'100%'}
//                         //  bg={'gray.800'}
//                         justifyContent={'space-between'}
//                     >
//                         <MyFlex
//                             direction={'column'}
//                             p={0}
//                             justifyContent={'flex-start'}
//                             overflowY={'auto'}
//                         >
//                             {activeSession && (
//                                 <MyFlex
//                                     direction={'row'}
//                                     justifyContent={'space-between'}
//                                     align={'center'}
//                                     p={0}
//                                 >
//                                     <MyText fontWeight={'semibold'}>
//                                         {activeSession.title}
//                                     </MyText>
//                                     <MyText color={'gray'} fontSize={'0.8rem'}>
//                                         {ShowDate(
//                                             activeSession.createdAt,
//                                             'D [-] MMMM [-] YYYY hh:mm:ss',
//                                             'es'
//                                         )}
//                                     </MyText>
//                                 </MyFlex>
//                             )}

//                             {conversationPerSession.map(
//                                 (conversation, index) => (
//                                     <WrapDiv key={`warp-div-${index}`}>
//                                         <MyFlex
//                                             key={conversation.id}
//                                             direction={'column'}
//                                             bg={'bg.muted'}
//                                             px={2}
//                                         >
//                                             <MyFlex
//                                                 direction={'row'}
//                                                 justify={'space-between'}
//                                                 align={'center'}
//                                                 p={0}
//                                             >
//                                                 <MyFlex
//                                                     direction={'column'}
//                                                     gap={0}
//                                                     p={0}
//                                                 >
//                                                     <MyText
//                                                         fontSize={'0.8rem'}
//                                                         color={'gray'}
//                                                     >
//                                                         {ShowDate(
//                                                             conversation.createdAt,
//                                                             'D[-] MMMM[-] YYYY hh:mm:ss',
//                                                             'es'
//                                                         )}
//                                                     </MyText>
//                                                     <MyText
//                                                         color={
//                                                             conversation.response
//                                                                 ? 'gray'
//                                                                 : ''
//                                                         }
//                                                         fontWeight={'semibold'}
//                                                     >
//                                                         {conversation.question}
//                                                     </MyText>
//                                                 </MyFlex>
//                                                 <MyFlex
//                                                     direction={'row'}
//                                                     gap={0}
//                                                 >
//                                                     <MyButton
//                                                         icon={'REFRESH'}
//                                                         size={'xs'}
//                                                         variant={'plain'}
//                                                         aria-label={
//                                                             'Refresh Conversation'
//                                                         }
//                                                         onClick={() => {
//                                                             handledOnRefreshConversation(
//                                                                 conversation
//                                                             );
//                                                         }}
//                                                     />
//                                                     <MyButton
//                                                         icon={'TRASH'}
//                                                         size={'xs'}
//                                                         variant={'plain'}
//                                                         colorPalette={'red'}
//                                                         aria-label={
//                                                             'Delete Conversation'
//                                                         }
//                                                         onClick={() => {
//                                                             handledOnDeleteConversation(
//                                                                 conversation
//                                                             );
//                                                         }}
//                                                     />
//                                                 </MyFlex>
//                                             </MyFlex>

//                                             <div>
//                                                 {conversation.response && (
//                                                     <ShowResponseMarkDown
//                                                         response={
//                                                             conversation.response
//                                                         }
//                                                     />
//                                                 )}
//                                             </div>
//                                         </MyFlex>
//                                     </WrapDiv>
//                                 )
//                             )}

//                             {isLoadingConversations && (
//                                 <MyFlex bg={'bg.muted'} px={2} opacity={0.5}>
//                                     <LoadingWithText
//                                         text={'Generando respuesta...'}
//                                     />
//                                 </MyFlex>
//                             )}
//                         </MyFlex>
//                         <MyFlex>
//                             <MyChatInput
//                                 onSubmit={handledOnNewConversation}
//                                 onEvnetButtonList={conversationActionsBts}
//                             />
//                         </MyFlex>
//                     </MyFlex>
//                 </MyFlex>
//             </AnimatePresence>

//             <DialogToRename
//                 headerDialog="Renombrar sesión"
//                 fileToRename="Nombre de la sesión"
//                 showDialog={selectedSession.showDrawer}
//                 onClose={() => {
//                     setSelectedSession(initialState);
//                 }}
//                 title={selectedSession.sessionTitle}
//                 onSubmit={(newTitle) => {
//                     if (!selectedSession.sessionTitle) {
//                         return;
//                     }
//                     hanledRenameSession(selectedSession.sessionId, newTitle);
//                 }}
//             />
//         </div>
//     );
// };
