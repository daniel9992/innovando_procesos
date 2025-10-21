// // import { chatTheme } from '@src/customAgencyTool/style/theme';
// // src/components/Chatbot.tsx
// import {
//     useAppDispatch,
//     useAppSelector
// } from '@src/customAgencyTool/app/hooks';
// import {
//     MyBox,
//     MyButton,
//     MyFlex,
//     MyHeading,
//     MyInputTextArea,
//     MyMenu,
//     MyText
// } from '@src/customAgencyTool/components/ui';
// import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
// import { model } from '@src/customAgencyTool/core/services/firebase.server';
// import { selectCurrentUser } from '@src/customAgencyTool/features/auth/infrastructure/authSlice';
// import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';

// import { Spinner } from '@chakra-ui/react';
// import 'reachat/index.css';
// import { memo, useCallback, useEffect, useState } from 'react';
// import AutoSizer from 'react-virtualized-auto-sizer';
// import { FixedSizeList, type ListChildComponentProps } from 'react-window';
// import InfiniteLoader from 'react-window-infinite-loader';
// import type {
//     ICustomChatConversation,
//     ICustomChatSession
// } from '../../domain/customChat.model';
// import {
//     createConversation,
//     createSession,
//     selectStatusConversation,
//     selectStatusSession
// } from '../../infrastructure/chat.reducer';
// import {
//     chatConversationObsRepository,
//     chatSessionObsRepository
// } from '../../infrastructure/compositionRoot';
// import type { ChatViewType } from '../customChatLMM/context/customChatContext';
// import MyCustomChatLLM from '../customChatLMM/myCustomChatLLM';
// import {
//     conversationsArrayToMap,
//     sessionsArrayToMap
// } from '../customChatLMM/utils/sessionsArrayToMap';

// const Home6 = () => {
//     // 1. La interfaz para nuestros objetos de datos
//     interface ICustomChatSession {
//         /**
//          * Unique identifier for the session
//          */
//         id: string;
//         /**
//          * Title of the session
//          */
//         title: string;
//         /**
//          * Disable
//          */
//         disabled?: boolean;
//     }
//     // 2. Simulación de una base de datos o API remota
//     // Creamos 1000 registros para el ejemplo
//     const TOTAL_ITEMS = 1000;
//     const remoteData: ICustomChatSession[] = Array.from(
//         { length: TOTAL_ITEMS },
//         (_, index) => ({
//             id: `session-${index + 1}`,
//             title: `Sesión de Chat número ${index + 1}`,
//             disabled: index % 10 === 0 // Deshabilitar 1 de cada 10 para el ejemplo
//         })
//     );
//     // Función que simula una llamada a la API con un retardo
//     const fetchMoreItems = (
//         startIndex: number,
//         stopIndex: number
//     ): Promise<ICustomChatSession[]> => {
//         console.log(`Fetching items from ${startIndex} to ${stopIndex}`);
//         return new Promise(
//             (resolve) =>
//                 setTimeout(() => {
//                     // Devolvemos el "slice" de datos que corresponde
//                     resolve(remoteData.slice(startIndex, stopIndex + 1));
//                 }, 800) // Simula 800ms de latencia de red
//         );
//     };
//     // 3. El componente de Fila (Row) que renderizará cada elemento
//     // Usamos React.memo para optimizar y evitar re-renderizados innecesarios
//     const Row = memo(
//         ({
//             index,
//             style,
//             data
//         }: ListChildComponentProps<ICustomChatSession[]>) => {
//             // 'data' es el array de items cargados
//             const item = data[index];

//             // Mientras el item está cargando, mostramos un placeholder
//             const content = item ? (
//                 <MyFlex
//                     direction={'row'}
//                     p={0}
//                     align={'center'}
//                     width={'100%'}
//                     justifyContent={'space-between'}
//                 >
//                     <MyText color={item.disabled ? 'red' : 'gray'}>
//                         {item.title}
//                         {item.disabled && (
//                             <span style={{ marginLeft: '10px', color: 'red' }}>
//                                 (Deshabilitado)
//                             </span>
//                         )}
//                     </MyText>

//                     <MyMenu
//                         triggerAsChild={
//                             <MyButton
//                                 size={'xs'}
//                                 leftIcon={'MENU_DOTS'}
//                                 variant={'plain'}
//                                 aria-label={'Menu ' + item.title}
//                             />
//                         }
//                         verticalMenuItems={[
//                             {
//                                 id: 'rename',
//                                 leftIcon: 'EDIT',
//                                 label: 'Renombrar',
//                                 type: 'item',
//                                 isActive: item.disabled ? true : false,
//                                 allowRoles: [],
//                                 onClick: () => {
//                                     console.log('Renombrar');
//                                 }
//                             },
//                             {
//                                 id: 'delete',
//                                 leftIcon: 'TRASH',
//                                 label: 'Eliminar',
//                                 type: 'item',
//                                 isActive: item.disabled ? true : false,
//                                 allowRoles: [],
//                                 onClick: () => {
//                                     console.log('Eliminar');
//                                 }
//                             }
//                         ]}
//                     />
//                 </MyFlex>
//             ) : (
//                 <MyFlex direction={'row'} p={0} align={'center'}>
//                     <Spinner /> Cargando...
//                 </MyFlex>
//             );

//             return (
//                 <MyFlex
//                     //
//                     direction={'row'}
//                     p={0}
//                     align={'center'}
//                     style={style}
//                     cursor={'pointer'}
//                     _hover={{
//                         bg: 'rgba(0, 0, 0, 0.1)',
//                         transition: 'background-color 0.2s'
//                     }}
//                 >
//                     {content}
//                 </MyFlex>
//             );
//         }
//     );

//     // Estado para almacenar los items que ya han sido cargados
//     const [items, setItems] = useState<ICustomChatSession[]>([]);

//     // Función que InfiniteLoader llamará para cargar más datos
//     const loadMoreItems = async (startIndex: number, stopIndex: number) => {
//         const newItems = await fetchMoreItems(startIndex, stopIndex);

//         // Creamos una copia del array actual y colocamos los nuevos items en su lugar
//         const updatedItems = [...items];
//         for (let i = 0; i < newItems.length; i++) {
//             updatedItems[startIndex + i] = newItems[i];
//         }
//         setItems(updatedItems);
//     };

//     // Función que le dice a InfiniteLoader si un item específico ya ha sido cargado
//     const isItemLoaded = (index: number) => !!items[index];

//     return (
//         <div
//             style={{ height: '500px', width: '100%', border: '1px solid #ccc' }}
//         >
//             <AutoSizer>
//                 {({ height, width }) => (
//                     <InfiniteLoader
//                         isItemLoaded={isItemLoaded}
//                         itemCount={TOTAL_ITEMS}
//                         loadMoreItems={loadMoreItems}
//                     >
//                         {({ onItemsRendered, ref }) => (
//                             <FixedSizeList
//                                 height={height}
//                                 width={width}
//                                 itemCount={TOTAL_ITEMS}
//                                 itemSize={50} // Altura de cada fila en píxeles
//                                 onItemsRendered={onItemsRendered}
//                                 ref={ref}
//                                 itemData={items} // Pasamos los items cargados al componente Row
//                             >
//                                 {Row}
//                             </FixedSizeList>
//                         )}
//                     </InfiniteLoader>
//                 )}
//             </AutoSizer>
//         </div>
//     );
// };

// const Home = () => {
//     const dispatch = useAppDispatch();
//     const currentUser = useAppSelector(selectCurrentUser);
//     const [chatViewType, setChatViewType] = useState<ChatViewType>('chat');
//     const [activeSessionId, setActiveSessionId] = useState<string | undefined>(
//         undefined
//     );
//     /**
//      *  ? -----------------------------
//      *  * Observable Sessions
//      *  ? -----------------------------
//      */
//     const chatObservable = chatSessionObsRepository;
//     const [sessions, setSessions] = useState<ICustomChatSession[]>([]);
//     const [isLoadingSessions, setIsLoadingSessions] = useState(false);
//     const [hasMoreSessions, setHasMoreSessions] = useState(true);

//     const loadMoreSessions = useCallback(async () => {
//         chatObservable.loadMore();
//     }, [chatObservable]);

//     useEffect(() => {
//         const dataSub = chatObservable.data$.subscribe(setSessions);
//         const loadingSub =
//             chatObservable.loading$.subscribe(setIsLoadingSessions);
//         const hasMoreSub =
//             chatObservable.hasMore$.subscribe(setHasMoreSessions);

//         return () => {
//             dataSub.unsubscribe();
//             loadingSub.unsubscribe();
//             hasMoreSub.unsubscribe();
//         };
//     }, [chatObservable]);

//     useEffect(() => {
//         chatObservable.get([]);
//     }, [chatObservable]);

//     const handledOnNewSession = () => {
//         const tempSession: ICustomChatSession = {
//             id: '1',
//             uid: currentUser.uid,
//             title: 'New Session',
//             createdAt: GetToday(),
//             updatedAt: GetToday(),
//             conversations: []
//         };

//         dispatch(createSession({ values: tempSession })).then(() => {
//             console.log('Session created');
//         });
//     };

//     const itemCountSession = hasMoreSessions
//         ? sessions.length + 35
//         : sessions.length;

//     const isSessionItemLoaded = (index: number) => !!sessions[index];

//     const SessionRowRenderer = memo(
//         ({
//             index,
//             style,
//             data
//         }: ListChildComponentProps<ICustomChatSession[]>) => {
//             // 'data' es el array de items cargados
//             const item = data[index];

//             // Mientras el item está cargando, mostramos un placeholder
//             const content = item ? (
//                 <MyFlex
//                     direction={'row'}
//                     p={0}
//                     align={'center'}
//                     width={'100%'}
//                     justifyContent={'space-between'}
//                 >
//                     <MyText
//                         color={item.disabled ? 'red' : 'gray'}
//                         onClick={() => {
//                             setActiveSessionId(item.id);
//                         }}
//                     >
//                         {item.title}
//                         {item.disabled && (
//                             <span style={{ marginLeft: '10px', color: 'red' }}>
//                                 (Deshabilitado)
//                             </span>
//                         )}
//                     </MyText>

//                     <MyMenu
//                         triggerAsChild={
//                             <MyButton
//                                 size={'xs'}
//                                 leftIcon={'MENU_DOTS'}
//                                 variant={'plain'}
//                                 aria-label={'Menu ' + item.title}
//                             />
//                         }
//                         verticalMenuItems={[
//                             {
//                                 id: 'rename',
//                                 leftIcon: 'EDIT',
//                                 label: 'Renombrar',
//                                 type: 'item',
//                                 isActive: item.disabled ? true : false,
//                                 allowRoles: [],
//                                 onClick: () => {
//                                     console.log('Renombrar');
//                                 }
//                             },
//                             {
//                                 id: 'delete',
//                                 leftIcon: 'TRASH',
//                                 label: 'Eliminar',
//                                 type: 'item',
//                                 isActive: item.disabled ? true : false,
//                                 allowRoles: [],
//                                 onClick: () => {
//                                     console.log('Eliminar');
//                                 }
//                             }
//                         ]}
//                     />
//                 </MyFlex>
//             ) : (
//                 <MyFlex direction={'row'} p={0} align={'center'}>
//                     <Spinner /> Cargando...
//                 </MyFlex>
//             );

//             return (
//                 <MyFlex
//                     //
//                     direction={'row'}
//                     p={0}
//                     align={'center'}
//                     style={style}
//                     cursor={'pointer'}
//                     _hover={{
//                         bg: 'rgba(0, 0, 0, 0.1)',
//                         transition: 'background-color 0.2s'
//                     }}
//                 >
//                     {content}
//                 </MyFlex>
//             );
//         }
//     );
//     /**
//      *  ? -----------------------------
//      *  * Observable Conversations
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

//     const isConversationItemLoaded = (index: number) => !!conversations[index];

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
//         if (!activeSessionId) {
//             return;
//         }
//         chatConversationObservable.get([
//             {
//                 direction: 'asc',
//                 field: 'sessionToBelongsTo',
//                 operator: '==',
//                 value: activeSessionId
//             }
//         ]);
//     }, [chatConversationObservable, activeSessionId]);

//     const rowHeight = useCallback(
//         (index: number, data: ICustomChatConversation[]) => {
//             // Calculate the height of each row based on its content
//             const item = data[index];
//             if (item.response) {
//                 return item.response.length * 20 + 20;
//             }
//             return item.question.length * 20 + 20;
//         },
//         []
//     );

//     const ConversationRowRenderer = memo(
//         ({
//             index,
//             style,
//             data
//         }: ListChildComponentProps<ICustomChatConversation[]>) => {
//             // 'data' es el array de items cargados
//             const item = data[index];

//             // Mientras el item está cargando, mostramos un placeholder
//             const content = item ? (
//                 <MyFlex
//                     direction={'row'}
//                     p={0}
//                     align={'center'}
//                     width={'100%'}
//                     justifyContent={'space-between'}
//                 ></MyFlex>
//             ) : (
//                 <MyFlex direction={'row'} p={0} align={'center'}>
//                     <Spinner /> Cargando...
//                 </MyFlex>
//             );

//             return (
//                 <MyFlex
//                     //
//                     direction={'row'}
//                     p={0}
//                     align={'center'}
//                     style={style}
//                     cursor={'pointer'}
//                     _hover={{
//                         bg: 'rgba(0, 0, 0, 0.1)',
//                         transition: 'background-color 0.2s'
//                     }}
//                 >
//                     {content}
//                 </MyFlex>
//             );
//         }
//     );

//     /**
//      *  ? -----------------------------
//      *  * Render
//      *  ? -----------------------------
//      */
//     return (
//         <div>
//             <MyFlex>
//                 <MyButton onClick={() => setChatViewType('console')}>
//                     Console
//                 </MyButton>
//                 <MyButton onClick={() => setChatViewType('chat')}>
//                     Chat
//                 </MyButton>
//             </MyFlex>

//             <MyFlex
//                 direction={chatViewType === 'console' ? 'column' : 'row'}
//                 p={0}
//                 w={'90vw'}
//                 bg={'red'}
//                 justifyContent={'space-between'}
//             >
//                 <MyFlex
//                     bg={'blue.300'}
//                     direction={'column'}
//                     border={'1px solid gray'}
//                     flex={1}
//                 >
//                     <MyHeading>
//                         Sessions {isLoadingSessions && <Spinner />}
//                     </MyHeading>
//                     <MyButton onClick={handledOnNewSession} leftIcon={'ADD'}>
//                         New Session
//                     </MyButton>

//                     <MyBox height={'70vh'} bg={'green'}>
//                         <AutoSizer>
//                             {({ height, width }) => (
//                                 <InfiniteLoader
//                                     isItemLoaded={isSessionItemLoaded}
//                                     itemCount={itemCountSession}
//                                     loadMoreItems={loadMoreSessions}
//                                 >
//                                     {({ onItemsRendered, ref }) => (
//                                         <FixedSizeList
//                                             height={height}
//                                             width={width}
//                                             itemCount={itemCountSession}
//                                             itemSize={50} // Altura de cada fila en píxeles
//                                             onItemsRendered={onItemsRendered}
//                                             ref={ref}
//                                             itemData={sessions} // Pasamos los items cargados al componente Row
//                                         >
//                                             {SessionRowRenderer}
//                                         </FixedSizeList>
//                                     )}
//                                 </InfiniteLoader>
//                             )}
//                         </AutoSizer>
//                     </MyBox>
//                 </MyFlex>
//                 <MyFlex bg={'gray.300'} direction={'column'} flex={3}>
//                     <MyHeading>Sessions Message Panel</MyHeading>
//                     <MyBox height={'70vh'} bg={'green'}>
//                         <AutoSizer>
//                             {({ height, width }) => (
//                                 <InfiniteLoader
//                                     isItemLoaded={isConversationItemLoaded}
//                                     itemCount={itemCountSession}
//                                     loadMoreItems={loadMoreSessions}
//                                 >
//                                     {({ onItemsRendered, ref }) => (
//                                         <FixedSizeList
//                                             height={height}
//                                             width={width}
//                                             itemCount={itemCountSession}
//                                             itemSize={50} // Altura de cada fila en píxeles
//                                             onItemsRendered={onItemsRendered}
//                                             ref={ref}
//                                             itemData={conversations} // Pasamos los items cargados al componente Row
//                                         >
//                                             {ConversationRowRenderer}
//                                         </FixedSizeList>
//                                     )}
//                                 </InfiniteLoader>
//                             )}
//                         </AutoSizer>
//                     </MyBox>
//                 </MyFlex>
//             </MyFlex>
//         </div>
//     );
// };

// const Home5 = () => {
//     /**
//      *  ? -----------------------------
//      *  * Observable Sessions
//      *  ? -----------------------------
//      */
//     const chatObservable = chatSessionObsRepository;
//     const [sessions, setSessions] = useState<ICustomChatSession[]>([]);
//     const [isLoadingSessions, setIsLoadingSessions] = useState(false);
//     const [hasMoreSessions, setHasMoreSessions] = useState(true);

//     const loadMoreSessions = useCallback(async () => {
//         chatObservable.loadMore();
//     }, [chatObservable]);

//     useEffect(() => {
//         const dataSub = chatObservable.data$.subscribe(setSessions);
//         const loadingSub =
//             chatObservable.loading$.subscribe(setIsLoadingSessions);
//         const hasMoreSub =
//             chatObservable.hasMore$.subscribe(setHasMoreSessions);

//         return () => {
//             dataSub.unsubscribe();
//             loadingSub.unsubscribe();
//             hasMoreSub.unsubscribe();
//         };
//     }, [chatObservable]);

//     useEffect(() => {
//         chatObservable.get([]);
//     }, [chatObservable]);

//     /**
//      *  ? -----------------------------
//      *  * Observable Conversations
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
//         chatConversationObservable.get([
//             {
//                 direction: 'asc',
//                 field: 'sessionToBelongsTo',
//                 value: 'K9YxixTjppLLNjhr7RjH',
//                 operator: '=='
//             }
//         ]);
//     }, [chatConversationObservable]);

//     /**
//      *  ? -----------------------------
//      *  * Manage Chat
//      *  ? -----------------------------
//      */

//     /**
//      *  ? -----------------------------
//      *  * Render
//      *  ? -----------------------------
//      */
//     const [viewType, setViewType] = useState<ChatViewType>('console');
//     return (
//         <div>
//             <button
//                 onClick={() => {
//                     setViewType((prev) => {
//                         return prev === 'console' ? 'chat' : 'console';
//                     });
//                 }}
//             >
//                 Switch to
//                 {viewType === 'console' ? 'Chat' : 'Console'}
//             </button>
//             <MyCustomChatLLM
//                 // Basic Configuration
//                 viewType={viewType}
//                 minWidth={'350px'}
//                 fileLimit={10}
//                 fileTypes={[
//                     '.pdf',
//                     '.csv',
//                     '.jpg',
//                     '.jpeg',
//                     '.png',
//                     '.tif',
//                     '.txt'
//                 ]}
//                 fileMaxSize={1024 * 1024 * 10} // 10 MB
//                 // manage Sessions
//                 sessions={sessionsArrayToMap(sessions)}
//                 isLoadingSessions={isLoadingSessions}
//                 hasMoreSessions={hasMoreSessions}
//                 onSelectSession={console.log}
//                 onMenuSession={[
//                     {
//                         id: 'share',
//                         leftIcon: 'USER',
//                         label: 'Share',
//                         onClick: (session: ICustomChatSession | undefined) => {
//                             console.log('Shate', session);
//                         }
//                     },
//                     {
//                         id: 'rename',
//                         leftIcon: 'PENCIL',
//                         label: 'Rename',
//                         onClick: (session: ICustomChatSession | undefined) => {
//                             console.log('Rename', session);
//                         }
//                     },
//                     {
//                         id: 'delete',
//                         leftIcon: 'TRASH',
//                         label: 'Delete',
//                         onClick: (session: ICustomChatSession | undefined) => {
//                             console.log('Delete', session);
//                         }
//                     }
//                 ]}
//                 // manage Conversations
//                 conversations={conversationsArrayToMap(conversations)}
//                 isLoadingConversations={isLoadingConversations}
//                 hasMoreConversations={hasMoreConversations}
//                 onSelectConversation={console.log}
//                 onMenuConversation={[
//                     {
//                         id: 'like',
//                         type: 'iconButton',
//                         leftIcon: 'THUMBSUP',
//                         label: 'Like',
//                         onClick: (
//                             _,
//                             conversation: ICustomChatConversation | undefined
//                         ) => {
//                             console.log('Like', conversation);
//                         }
//                     },
//                     {
//                         id: 'dislike',
//                         type: 'iconButton',
//                         leftIcon: 'THUMBSDOWN',
//                         label: 'Dislike',
//                         onClick: (
//                             _,
//                             conversation: ICustomChatConversation | undefined
//                         ) => {
//                             console.log('Dislike', conversation);
//                         }
//                     },
//                     {
//                         id: 'refresh',
//                         type: 'iconButton',
//                         leftIcon: 'REFRESH',
//                         label: 'Refresh',
//                         onClick: (
//                             _,
//                             conversation: ICustomChatConversation | undefined
//                         ) => {
//                             console.log('Refresh', conversation);
//                         }
//                     },
//                     {
//                         id: 'delete',
//                         type: 'iconButton',
//                         leftIcon: 'TRASH',
//                         label: 'Delete',
//                         onClick: (
//                             _,
//                             conversation: ICustomChatConversation | undefined
//                         ) => {
//                             console.log('Delete', conversation);
//                         }
//                     },
//                     {
//                         id: 'copy',
//                         type: 'iconButton',
//                         leftIcon: 'COPY',
//                         label: 'Copy',
//                         onClick: (
//                             _,
//                             conversation: ICustomChatConversation | undefined
//                         ) => {
//                             console.log('Copy', conversation);
//                         }
//                     },
//                     {
//                         id: 'savePrompts',
//                         leftIcon: 'SAVE',
//                         label: 'Save Prompts',
//                         onClick: (
//                             session: ICustomChatSession | undefined,
//                             conversation: ICustomChatConversation | undefined
//                         ) => {
//                             console.log('Save Prompts', session);
//                             console.log('Save Prompts', conversation);
//                         }
//                     },
//                     {
//                         id: 'more',
//                         type: 'iconButton',
//                         leftIcon: 'DOTS',
//                         label: 'More',
//                         subMenus: [
//                             {
//                                 id: 'info',
//                                 type: 'item',
//                                 label: 'Información',
//                                 onClick: (
//                                     _,
//                                     conversation:
//                                         | ICustomChatConversation
//                                         | undefined
//                                 ) => {
//                                     console.log('Info', conversation);
//                                 }
//                             },
//                             {
//                                 id: 'exportPDf',
//                                 type: 'item',
//                                 label: 'Export PDF',
//                                 onClick: (
//                                     _,
//                                     conversation:
//                                         | ICustomChatConversation
//                                         | undefined
//                                 ) => {
//                                     console.log('Export PDF', conversation);
//                                 }
//                             },
//                             {
//                                 id: 'report',
//                                 type: 'item',
//                                 label: 'Report',
//                                 onClick: (
//                                     _,
//                                     conversation:
//                                         | ICustomChatConversation
//                                         | undefined
//                                 ) => {
//                                     console.log('Report', conversation);
//                                 }
//                             }
//                         ]
//                     }
//                 ]}
//                 // manage Chat
//                 onSendMessage={console.log} // session, conversation
//                 onStopMessage={console.log} // session, conversation
//                 onResetMessage={console.log} // session, conversation
//             />
//         </div>
//     );
// };

// const Home4 = () => {
//     const chatObservable = chatConversationObsRepository;
//     const [conversations, setConversations] = useState<
//         ICustomChatConversation[]
//     >([]);
//     const [isLoadingConversations, setIsLoadingConversations] = useState(false);
//     const [hasMoreConversations, setHasMoreConversations] = useState(true);

//     const loadMoreConversations = useCallback(async () => {
//         chatObservable.loadMore();
//     }, [chatObservable]);

//     useEffect(() => {
//         const dataSub = chatObservable.data$.subscribe(setConversations);
//         const loadingSub = chatObservable.loading$.subscribe(
//             setIsLoadingConversations
//         );
//         const hasMoreSub = chatObservable.hasMore$.subscribe(
//             setHasMoreConversations
//         );

//         return () => {
//             dataSub.unsubscribe();
//             loadingSub.unsubscribe();
//             hasMoreSub.unsubscribe();
//         };
//     }, [chatObservable]);

//     useEffect(() => {
//         chatObservable.get([
//             {
//                 direction: 'asc',
//                 field: 'sessionToBelongsTo',
//                 value: 'K9YxixTjppLLNjhr7RjH',
//                 operator: '=='
//             }
//         ]);
//     }, [chatObservable]);

//     return (
//         <div>
//             <h2>Chat with AI</h2>
//             <p>In progress, please wait for the next version of the tool. </p>
//             <p>
//                 <strong>:p</strong>
//             </p>

//             <MyFlex gap={3}>
//                 <MyButton
//                     onClick={loadMoreConversations}
//                     isDisabled={!hasMoreConversations}
//                 >
//                     Has more: {hasMoreConversations ? 'true' : 'false'}
//                 </MyButton>
//             </MyFlex>

//             {isLoadingConversations && <p>Loading Conversations...</p>}

//             <MyFlex direction={'column'} gap={3}>
//                 <p>Conversations</p>
//                 <MyFlex direction={'row'} gap={2}>
//                     {conversations.map((conversation) => (
//                         <MyText key={conversation.id}>
//                             {conversation.question}
//                         </MyText>
//                     ))}
//                 </MyFlex>
//             </MyFlex>
//         </div>
//     );
// };

// export const Home3 = () => {
//     const chatObservable = chatSessionObsRepository;
//     const [sessions, setSessions] = useState<ICustomChatSession[]>([]);
//     const [isLoadingSessions, setIsLoadingSessions] = useState(false);
//     const [hasMoreSessions, setHasMoreSessions] = useState(true);

//     const loadMoreSessions = useCallback(async () => {
//         chatObservable.loadMore();
//     }, [chatObservable]);

//     useEffect(() => {
//         const dataSub = chatObservable.data$.subscribe(setSessions);
//         const loadingSub =
//             chatObservable.loading$.subscribe(setIsLoadingSessions);
//         const hasMoreSub =
//             chatObservable.hasMore$.subscribe(setHasMoreSessions);

//         return () => {
//             dataSub.unsubscribe();
//             loadingSub.unsubscribe();
//             hasMoreSub.unsubscribe();
//         };
//     }, [chatObservable]);

//     useEffect(() => {
//         chatObservable.get([
//             {
//                 direction: 'asc',
//                 field: 'uid',
//                 value: 'K9YxixTjppLLNjhr7RjH',
//                 operator: '=='
//             }
//         ]);
//     }, [chatObservable]);

//     return (
//         <div>
//             <h2>Chat with AI</h2>
//             <p>In progress, please wait for the next version of the tool. </p>
//             <p>
//                 <strong>:p</strong>
//             </p>

//             <MyFlex gap={3}>
//                 <MyButton
//                     onClick={loadMoreSessions}
//                     isDisabled={!hasMoreSessions}
//                 >
//                     Has more: {hasMoreSessions ? 'true' : 'false'}
//                 </MyButton>
//             </MyFlex>

//             {isLoadingSessions && <p>Loading Sessions...</p>}

//             <MyFlex direction={'column'} gap={3}>
//                 <p>Sessions</p>
//                 <MyFlex direction={'row'} gap={2}>
//                     {sessions.map((session) => (
//                         <MyText key={session.id}>{session.title}</MyText>
//                     ))}
//                 </MyFlex>
//             </MyFlex>
//         </div>
//     );
// };

// export const Home2 = () => {
//     const currentUser = useAppSelector(selectCurrentUser);

//     const dispatch = useAppDispatch();

//     const selectedStatusSession = useAppSelector(selectStatusSession);

//     const selectedStatusConversation = useAppSelector(selectStatusConversation);

//     const handledOnCreateSession = async () => {
//         const tempSession: ICustomChatSession = {
//             id: '1',
//             uid: currentUser.uid,
//             title: 'New Session',
//             createdAt: GetToday(),
//             updatedAt: GetToday(),
//             conversations: []
//         };

//         dispatch(createSession({ values: tempSession })).then(() => {
//             console.log('Session created');
//         });
//     };

//     const handledOnCreteConversation = async () => {
//         const tempConversation: ICustomChatConversation = {
//             id: '1',
//             sessionToBelongsTo: 'K9YxixTjppLLNjhr7RjH',
//             createdAt: GetToday(),
//             updatedAt: GetToday(),
//             question: 'New Conversation',
//             response: 'New Conversation'
//         };

//         dispatch(createConversation({ values: tempConversation })).then(() => {
//             console.log('Conversation created');
//         });
//     };

//     if (selectedStatusSession === ReduxStatus.LOADING) {
//         return <p>Loading Session...</p>;
//     }

//     if (selectedStatusConversation === ReduxStatus.LOADING) {
//         return <p>Loading Conversation...</p>;
//     }

//     return (
//         <div>
//             <h2>Chat with AI</h2>
//             <p>In progress, please wait for the next version of the tool. </p>
//             <p>
//                 <strong>:p</strong>
//             </p>

//             <MyFlex direction={'column'} gap={3}>
//                 <p>Create a new session</p>
//                 <MyFlex direction={'row'} gap={2}>
//                     <MyButton onClick={handledOnCreateSession}>Create</MyButton>
//                 </MyFlex>
//             </MyFlex>

//             <MyFlex direction={'column'} gap={3}>
//                 <p>Create a new conversation</p>
//                 <MyFlex direction={'row'} gap={2}>
//                     <MyButton onClick={handledOnCreteConversation}>
//                         Create
//                     </MyButton>
//                 </MyFlex>
//             </MyFlex>
//         </div>
//     );
// };

// export const Home1 = () => {
//     const [prompt, setPrompt] = useState<string>('');
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     const [genkitResponse, setGenkitResponse] = useState<string>('');

//     const handledOnSearch = async () => {
//         try {
//             if (!prompt) {
//                 return;
//             }
//             setIsLoading(true);

//             // To generate text output, call generateContent with the text input
//             const result = await model.generateContent(prompt);

//             const response = result.response;
//             const text = response.text();

//             setGenkitResponse(text);

//             setIsLoading(false);
//         } catch (error) {
//             console.error(error);
//             setIsLoading(false);
//         }
//     };

//     if (isLoading) {
//         return <p>Loading...</p>;
//     }

//     return (
//         <MyFlex
//             //
//             direction={'column'}
//             gap={3}
//             p={0}
//             minHeight={'90vh'}
//         >
//             <p>Home</p>

//             <MyFlex>
//                 <MyInputTextArea
//                     placeholder={'Escribe tu pregunta'}
//                     onChange={(e) => {
//                         setPrompt(e.target.value);
//                     }}
//                     value={prompt}
//                 />

//                 <MyButton leftIcon={'Chatbot'} onClick={handledOnSearch}>
//                     Buscar
//                 </MyButton>
//             </MyFlex>

//             <MyFlex direction={'column'} gap={3} p={0}>
//                 <p>Respuesta</p>
//                 <p>{JSON.stringify(genkitResponse)}</p>
//             </MyFlex>

//             {/* <CustomComponents /> */}
//         </MyFlex>
//     );
// };

// export default Home;

// const mockDataSessions: ICustomChatSession[] = [
//     {
//         id: '1',
//         uid: '1',
//         title: 'New Session',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         conversations: []
//     },
//     {
//         id: '2',
//         uid: '2',
//         title: 'New Session',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         conversations: []
//     },
//     {
//         id: '3',
//         uid: '3',
//         title: 'New Session',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         conversations: []
//     },
//     {
//         id: '4',
//         uid: '4',
//         title: 'New Session',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         conversations: []
//     },
//     {
//         id: '5',
//         uid: '5',
//         title: 'New Session',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         conversations: []
//     },
//     {
//         id: '6',
//         uid: '6',
//         title: 'New Session',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         conversations: []
//     },
//     {
//         id: '7',
//         uid: '7',
//         title: 'New Session',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         conversations: []
//     },
//     {
//         id: '8',
//         uid: '8',
//         title: 'New Session',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         conversations: []
//     },
//     {
//         id: '9',
//         uid: '9',
//         title: 'New Session',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         conversations: []
//     }
// ];

// const mockDataConversations: ICustomChatConversation[] = [
//     {
//         id: '1',
//         sessionToBelongsTo: '1',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         question: 'New Conversation',
//         response: 'New Conversation'
//     },
//     {
//         id: '2',
//         sessionToBelongsTo: '2',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         question: 'New Conversation',
//         response: 'New Conversation'
//     },
//     {
//         id: '3',
//         sessionToBelongsTo: '3',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         question: 'New Conversation',
//         response: 'New Conversation'
//     },
//     {
//         id: '4',
//         sessionToBelongsTo: '4',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         question: 'New Conversation',
//         response: 'New Conversation'
//     },
//     {
//         id: '5',
//         sessionToBelongsTo: '5',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         question: 'New Conversation',
//         response: 'New Conversation'
//     },
//     {
//         id: '6',
//         sessionToBelongsTo: '6',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         question: 'New Conversation',
//         response: 'New Conversation'
//     },
//     {
//         id: '7',
//         sessionToBelongsTo: '7',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         question: 'New Conversation',
//         response: 'New Conversation'
//     },
//     {
//         id: '8',
//         sessionToBelongsTo: '8',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         question: 'New Conversation',
//         response: 'New Conversation'
//     },
//     {
//         id: '9',
//         sessionToBelongsTo: '9',
//         createdAt: GetToday(),
//         updatedAt: GetToday(),
//         question: 'New Conversation',
//         response: 'New Conversation'
//     }
// ];
