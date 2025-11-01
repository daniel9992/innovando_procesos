import { useAppSelector } from '@src/customAgencyTool/app/hooks';
import { MyButton, MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import { selectCurrentUser } from '@src/customAgencyTool/features/auth/infrastructure/authSlice';
import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import type { FileDataPart, InlineDataPart } from 'firebase/ai';
import { type FormikHelpers } from 'formik';
import { AnimatePresence, motion } from 'motion/react';

import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import { useNotificationAdapter } from '@src/customAgencyTool/context/toastAppNotification/useNotificationAdapter';
import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { useInView } from 'react-intersection-observer';
import type {
    ICustomChatConversation,
    ICustomChatSession
} from '../../domain/customChat.model';
import { ChatService } from '../../infrastructure/chatDataService/00chatService';
import ConversationView from './chat/components/ConversationView';
import DialogShowFileParts from './chat/components/dialogShowFileParts';
import DialogToRename from './chat/components/dialogToRename';
import MyChatInput, { type IMyChat } from './chat/components/myChatInput';
import SessionGroups from './chat/components/sessionGroups';
import ShowEmptyConversations from './chat/components/showEmptyConversations';

interface ManageSelectedFilePart {
    showDialog: boolean;
    url?: string;
}
const initialStateManageSelectedFilePart: ManageSelectedFilePart = {
    showDialog: false
};

const Home = () => {
    /**
     *  ? -----------------------------
     *  *  Variables
     *  ? -----------------------------
     */
    const { ref: loadMoreRef, inView } = useInView({
        threshold: 0.5,
        triggerOnce: false
    });
    const currentUser = useAppSelector(selectCurrentUser);
    const { sendNotification } = useNotificationAdapter();

    // Usamos useMemo para que la instancia del servicio persista durante el ciclo de vida del componente
    const chatService = useMemo(() => {
        if (!currentUser) return null;
        return new ChatService(currentUser.uid);
    }, [currentUser]);

    // Estados locales para almacenar los datos de los observables
    const [sessions, setSessions] = useState<ICustomChatSession[]>([]);
    const [conversations, setConversations] = useState<
        ICustomChatConversation[]
    >([]);
    const [activeSessionId, setActiveSessionId] = useState<string | undefined>(
        undefined
    );
    const [streamStatus, setStreamStatus] = useState('idle');
    // <-- AÑADIDO: Estados para la paginación -->
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [sessionsHasMore, setSessionsHasMore] = useState(false);
    const [conversationsLoading, setConversationsLoading] = useState(false);
    const [conversationsHasMore, setConversationsHasMore] = useState(false);
    const isLoading = streamStatus === 'streaming';
    const activeSession = useMemo(() => {
        if (!activeSessionId) return undefined;
        return sessions.find((session) => session.id === activeSessionId);
    }, [activeSessionId, sessions]);

    const [selectedFilePart, setSelectedFilePart] =
        useState<ManageSelectedFilePart>(initialStateManageSelectedFilePart);
    const [isLoadingFilePart, setIsLoadingFilePart] = useState(false);

    /**
     *  ? -----------------------------
     *  *  Subscriptions
     *  ? -----------------------------
     */
    useEffect(() => {
        if (!chatService) return;

        // Suscripciones a todos los observables del servicio
        const sessionsSub = chatService.sessions$.subscribe(setSessions);
        const conversationsSub =
            chatService.activeConversations$.subscribe(setConversations);
        const statusSub = chatService.streamStatus$.subscribe(setStreamStatus);
        const activeSessionSub =
            chatService.activeSessionId$.subscribe(setActiveSessionId);

        // <-- AÑADIDO: Suscripciones al estado de paginación -->
        const sessionsLoadingSub =
            chatService.sessionsLoading$.subscribe(setSessionsLoading);
        const sessionsHasMoreSub =
            chatService.sessionsHasMore$.subscribe(setSessionsHasMore);
        const conversationsLoadingSub =
            chatService.conversationsLoading$.subscribe(
                setConversationsLoading
            );
        const conversationsHasMoreSub =
            chatService.conversationsHasMore$.subscribe(
                setConversationsHasMore
            );

        // Función de limpieza para desuscribirse y destruir el servicio
        return () => {
            // Desuscripción de todo
            sessionsSub.unsubscribe();
            conversationsSub.unsubscribe();
            statusSub.unsubscribe();
            activeSessionSub.unsubscribe();
            sessionsLoadingSub.unsubscribe();
            sessionsHasMoreSub.unsubscribe();
            conversationsLoadingSub.unsubscribe();
            conversationsHasMoreSub.unsubscribe();
            chatService.destroy();
        };
    }, [chatService]);

    useEffect(() => {
        if (streamStatus === 'error') {
            sendNotification({
                title: 'Error al enviar mensaje',
                message: 'Intenta enviar el mensaje de nuevo',
                status: 'error',
                position: 'top-right',
                duration: 10000
            });
        }
    }, [streamStatus, sendNotification]);

    /**
     *  ? -----------------------------
     *  *  Sessions
     *  ? -----------------------------
     */
    const loadMoreSessions = () => {
        chatService?.loadMoreSessions();
    };
    const handleNewSession = () => {
        // chatService?.selectSession(undefined);
        chatService?.createSession();
    };
    const hanledDeleteSession = (session: ICustomChatSession) => {
        chatService?.deleteSession(session);
    };
    const handleSelectSession = (sessionId: string) => {
        chatService?.selectSession(sessionId);
    };

    /**
     *  ? -----------------------------
     *  *  Rename Session
     *  ? -----------------------------
     */
    const [selectedSession, setSelectedSession] =
        useState<ISelectedSession>(initialState);

    const handledOnRenameSession = (
        sessionId: string,
        title: string | undefined
    ) => {
        setSelectedSession({
            sessionId,
            sessionTitle: title || '',
            showDrawer: true
        });
    };

    const hanledRenameSession = (sessionId: string, newTitle: string) => {
        setSelectedSession(initialState);

        const tempSession = sessions.find(
            (session) => session.id === sessionId
        );
        if (!tempSession) {
            return;
        }
        const copySession = { ...tempSession };
        copySession.title = newTitle;
        copySession.updatedAt = GetToday();
        copySession.conversations = [];

        chatService?.renameSession(copySession);
    };

    /**
     *  ? -----------------------------
     *  *  Conversations
     *  ? -----------------------------
     */
    const loadMoreConversations = useCallback(() => {
        chatService?.loadMoreConversations();
    }, [chatService]);

    // Efecto para cargar más items cuando se llega al final
    useEffect(() => {
        if (conversationsHasMore) {
            loadMoreConversations();
            if (inView && !conversationsLoading) {
                loadMoreConversations();
            }
        }
    }, [
        inView,
        conversationsLoading,
        loadMoreConversations,
        conversationsHasMore
    ]);

    const handledRetryConversation = (
        conversation: ICustomChatConversation
    ) => {
        const tempMyChat: IMyChat = {
            message: conversation.question,
            files: [],
            inlineParts: conversation.inlineParts,
            fileDataParts: conversation.fileDataParts,
            isReplyConversation: true
        };

        chatService?.sendMessage(tempMyChat);
    };
    const hanledDeleteConversation = (
        conversation: ICustomChatConversation
    ) => {
        chatService?.deleteConversation(conversation);
    };
    const handleSendMessage = (
        chatData: IMyChat,
        formikHelpers: FormikHelpers<IMyChat>
    ) => {
        const activeSession = sessions.find(
            (session) => session.id === activeSessionId
        );

        if (activeSession) {
            if (conversations.length === 0) {
                const newSessionName =
                    chatData.message.substring(0, 30) + '...';

                const copySession: ICustomChatSession = {
                    ...activeSession,
                    title: newSessionName
                };

                chatService?.renameSession(copySession);
            }
        }

        chatService?.sendMessage(chatData).finally(() => {
            formikHelpers.setSubmitting(false);
        });
    };

    /**
     *  ? -----------------------------
     *  *  Bucket
     *  ? -----------------------------
     */
    const handledOnselectFilePart = async (
        inlineParts: InlineDataPart | undefined,
        fileParts: FileDataPart | undefined
    ) => {
        setIsLoadingFilePart(true);

        if (inlineParts) {
            await chatService
                ?.readFileInlinePart(inlineParts)
                .then((url) => {
                    setSelectedFilePart((prev) => ({
                        ...prev,
                        showDialog: true,
                        url
                    }));
                })
                .finally(() => {
                    setIsLoadingFilePart(false);
                });
        }
        if (fileParts) {
            await chatService
                ?.readFileFileDataPart(fileParts)
                .then((url) => {
                    setSelectedFilePart((prev) => ({
                        ...prev,
                        showDialog: true,
                        url
                    }));
                })
                .finally(() => {
                    setIsLoadingFilePart(false);
                });
        }
    };

    /**
     *  ? -----------------------------
     *  *  Render
     *  ? -----------------------------
     */
    return (
        <div
            style={{
                margin: 'auto',
                overflow: 'hidden'
            }}
        >
            <MyFlex
                // direction={{
                //     base: 'column',
                //     md: 'column',
                //     lg: 'row'
                // }}
                w={'92vw'}
                h={'95vh'}
                //bg={'gray'}
                justifyContent={'space-between'}
                p={0}
            >
                {/* Columna de Sesiones */}

                <SessionGroups
                    isEnableSessions={isLoading}
                    activeSessionId={activeSessionId}
                    sessions={sessions}
                    isLoadingSessions={sessionsLoading}
                    hasMoreSessions={sessionsHasMore}
                    onSelectSession={(session) => {
                        // Lógica para seleccionar una sesión
                        handleSelectSession(session.id);
                    }}
                    onMenuSession={(session, action) => {
                        // Lógica para manejar los menús de una sesión
                        if (action === 'rename') {
                            handledOnRenameSession(session.id, session.title);
                        }
                        if (action === 'delete') {
                            hanledDeleteSession(session);
                        }
                    }}
                    loadMoreSessions={() => {
                        // Lógica para cargar más sesiones
                        loadMoreSessions();
                    }}
                    onNewSession={handleNewSession}
                />

                {/* Ventana de Chat Principal */}
                <MyFlex
                    flex={4}
                    direction={'column'}
                    h={'100%'}
                    justifyContent={'space-between'}
                >
                    <ShowEmptyConversations
                        enableToShow={conversations.length === 0}
                    />

                    <ConversationView
                        conversations={conversations}
                        activeSession={activeSession}
                        isLoadingFilePart={isLoadingFilePart}
                        loadMoreRef={loadMoreRef}
                        handledRetryConversation={handledRetryConversation}
                        hanledDeleteConversation={hanledDeleteConversation}
                        handledOnselectFilePart={handledOnselectFilePart}
                    />

                    <MyFlex direction={'column'} gap={2} p={0}>
                        {conversationsLoading && (
                            <MyFlex>
                                <LoadingWithText
                                    text={'Cargando conversaciones'}
                                />
                            </MyFlex>
                        )}
                        {isLoading && (
                            <MyFlex>
                                <MyButton
                                    leftIcon={'Stop'}
                                    colorPalette={'red'}
                                    w={'100%'}
                                    variant={'outline'}
                                    onClick={() => chatService?.stopStream()}
                                >
                                    Detener
                                </MyButton>
                            </MyFlex>
                        )}
                        <MyChatInput
                            isLoading={isLoading}
                            disabled={isLoading}
                            onSubmit={handleSendMessage}
                        />
                    </MyFlex>
                </MyFlex>
            </MyFlex>
            <DialogToRename
                headerDialog="Renombrar sesión"
                fileToRename="Nombre de la sesión"
                showDialog={selectedSession.showDrawer}
                onClose={() => {
                    setSelectedSession(initialState);
                }}
                title={selectedSession.sessionTitle}
                onSubmit={(newTitle) => {
                    if (!selectedSession.sessionTitle) {
                        return;
                    }
                    hanledRenameSession(selectedSession.sessionId, newTitle);
                }}
            />
            <DialogShowFileParts
                url={selectedFilePart?.url}
                showDialog={selectedFilePart?.showDialog}
                onClose={() => {
                    setSelectedFilePart(initialStateManageSelectedFilePart);
                }}
            />
        </div>
    );
};

interface ISelectedSession {
    sessionId: string;
    sessionTitle?: string;
    showDrawer: boolean;
}
const initialState: ISelectedSession = {
    sessionId: '',
    showDrawer: false
};

interface ListItem {
    id: string;
    title: string;
    disabled?: boolean;
    createdAt?: Date;
}

interface HomeProps {
    initialPageSize?: number;
    loadingDelay?: number;
}

export const SimpleListExmple: FC<HomeProps> = ({
    initialPageSize = 20,
    loadingDelay = 1000
}) => {
    // Estados
    const [items, setItems] = useState<ListItem[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState(true);

    // Referencia para infinite scroll
    const { ref: loadMoreRef, inView } = useInView({
        threshold: 0.5,
        triggerOnce: false
    });

    // Generador de sesiones memoizado
    const generateNewSessions = useCallback(
        (number: number, startIndex: number = 0) => {
            return Array.from({ length: number }, (_, index) => ({
                id: `session-${startIndex + index + 1}`,
                title: `Session ${startIndex + index + 1}`,
                disabled: (startIndex + index) % 10 === 0,
                createdAt: new Date(
                    Date.now() - (startIndex + index) * 24 * 60 * 60 * 1000
                )
            }));
        },
        []
    );

    // Cargar items iniciales
    useEffect(() => {
        setItems(generateNewSessions(initialPageSize));
    }, [initialPageSize, generateNewSessions]);

    // Función para cargar más datos
    const fetchMoreData = useCallback(async () => {
        if (isLoading || !hasMore) return;

        try {
            setIsLoading(true);

            // Simular llamada a API
            await new Promise((resolve) => setTimeout(resolve, loadingDelay));

            const currentLength = items.length;
            const newItems = generateNewSessions(10000, currentLength);

            // Simular fin de datos después de cierta cantidad
            if (currentLength >= 10000) {
                setHasMore(false);
                return;
            }

            setItems((prev) => [...prev, ...newItems]);
            setPage((prev) => prev + 1);
        } catch (err) {
            setError(err as Error);
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, hasMore, items.length, generateNewSessions, loadingDelay]);

    // Efecto para cargar más items cuando se llega al final
    useEffect(() => {
        if (inView && !isLoading) {
            fetchMoreData();
        }
    }, [inView, isLoading, fetchMoreData]);

    // Memoizar items agrupados por fecha
    const groupedItems = useMemo(() => {
        const groups = items.reduce((acc, item) => {
            const date = item.createdAt?.toLocaleDateString() || 'Sin fecha';
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {} as Record<string, ListItem[]>);

        return Object.entries(groups).map(([date, items]) => ({
            date,
            items
        }));
    }, [items]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto p-4"
        >
            {/* Header */}
            <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="mb-6"
            >
                <h1 className="text-2xl font-bold mb-2">
                    Sesiones ({items.length}) ({page})
                </h1>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-red-500 bg-red-100 p-3 rounded"
                    >
                        Error: {error.message}
                    </motion.div>
                )}
            </motion.div>

            {/* Lista de items agrupados */}
            <AnimatePresence mode="popLayout">
                {groupedItems.map(({ date, items: groupItems }) => (
                    <motion.div
                        key={date}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6"
                    >
                        <h2 className="text-lg font-semibold mb-3 text-gray-700">
                            {date}
                        </h2>
                        <div className="space-y-3">
                            {groupItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    whileHover={
                                        !item.disabled
                                            ? {
                                                  scale: 1.02,
                                                  transition: { duration: 0.2 }
                                              }
                                            : undefined
                                    }
                                    className={`
                                        p-4 rounded-lg shadow-md
                                        ${
                                            item.disabled
                                                ? 'bg-gray-100 cursor-not-allowed'
                                                : 'bg-white cursor-pointer hover:shadow-lg'
                                        }
                                        transition-all duration-200
                                    `}
                                >
                                    <div className="flex justify-between items-center">
                                        <span
                                            className={`
                                            font-medium
                                            ${
                                                item.disabled
                                                    ? 'text-gray-400'
                                                    : 'text-gray-800'
                                            }
                                        `}
                                        >
                                            {item.title}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {item.createdAt?.toLocaleTimeString()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-4 mt-4"
                    >
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={`skeleton-${i}`}
                                className="h-16 bg-gray-200 rounded-lg animate-pulse"
                            />
                        ))}
                    </motion.div>
                )}

                {/* End of list indicator */}
                {!hasMore && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-gray-500 py-4"
                    >
                        No hay más sesiones para cargar
                    </motion.div>
                )}

                {/* Load more trigger */}
                <div ref={loadMoreRef} className="h-10" />
            </AnimatePresence>
        </motion.div>
    );
};

export const SimpleInfiniteList = () => {
    const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5]);
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            // Agregar más items cuando el usuario llega al final
            const lastItem = items[items.length - 1];
            const newItems = Array.from(
                { length: 5 },
                (_, i) => lastItem + i + 1
            );
            setItems((prev) => [...prev, ...newItems]);
        }
    }, [inView, items]);

    return (
        <MyFlex direction="column" gap={2} p={4}>
            {items.map((item) => (
                <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <MyFlex
                        p={3}
                        bg="blue.100"
                        borderRadius="md"
                        _hover={{
                            transform: 'scale(1.02)',
                            transition: 'all 0.2s'
                        }}
                    >
                        <MyText>Item {item}</MyText>
                    </MyFlex>
                </motion.div>
            ))}

            {/* Elemento observador */}
            <div ref={ref} style={{ height: '20px' }} />
        </MyFlex>
    );
};

export default Home;
