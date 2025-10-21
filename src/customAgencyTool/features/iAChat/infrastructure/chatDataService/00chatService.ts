// src/features/chat/application/ChatService.ts

import { model as geminiModel } from '@src/customAgencyTool/core/services/firebase.server';
import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import type {
    ChatSession,
    Content,
    FileDataPart,
    GenerativeModel,
    InlineDataPart,
    Part
} from 'firebase/ai';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import type { StreamStatus } from '../../domain/chatGenerate.model';
import type {
    ICustomChatConversation,
    ICustomChatSession
} from '../../domain/customChat.model';
import type { IMyChat } from '../../presentation/home/chat/components/myChatInput';
import { FirebaseChatConversationObsRepository } from '../chatConversation/firebaseChatConversationObsRepo';
import { FirebaseChatSessionObsRepository } from '../chatSession/firebaseChatSessionObsRepo';
import { ChatDataService } from './01chatDataService';
import { ChatStorageService } from './02chatStorageService';

export class ChatService {
    // --- SERVICIOS Y REPOSITORIOS INTERNOS ---
    private readonly dataService: ChatDataService;
    private readonly storageService: ChatStorageService;
    private readonly sessionRepo: FirebaseChatSessionObsRepository;
    private readonly conversationRepo: FirebaseChatConversationObsRepository;
    private readonly model: GenerativeModel;

    // --- GESTIÓN DE ESTADO INTERNO ---
    private chat: ChatSession | null = null;
    private isStopRequested = false;

    // Sujeto para la sesión activa
    private activeSessionIdSubject = new BehaviorSubject<string | undefined>(
        undefined
    );
    // Sujeto para el mensaje "en vuelo" (pregunta y respuesta en streaming)
    private temporaryConversationSubject =
        new BehaviorSubject<ICustomChatConversation | null>(null);

    // Sujetos para el stream de la IA
    // private readonly streamSubject = new Subject<StreamResponse>();
    private readonly statusSubject = new BehaviorSubject<StreamStatus>('idle');

    // --- OBSERVABLES PÚBLICOS (La UI se suscribe a estos) ---
    public readonly sessions$: Observable<ICustomChatSession[]>;
    public readonly activeConversations$: Observable<ICustomChatConversation[]>;
    public readonly streamStatus$: Observable<StreamStatus> =
        this.statusSubject.asObservable();
    public readonly activeSessionId$: Observable<string | undefined> =
        this.activeSessionIdSubject.asObservable();

    // <-- AÑADIDO: Observables de estado para la paginación de sesiones -->
    public readonly sessionsLoading$: Observable<boolean>;
    public readonly sessionsHasMore$: Observable<boolean>;

    // <-- AÑADIDO: Observables de estado para la paginación de conversaciones -->
    public readonly conversationsLoading$: Observable<boolean>;
    public readonly conversationsHasMore$: Observable<boolean>;

    constructor(private userId: string) {
        // Inicialización de dependencias
        this.dataService = new ChatDataService();
        this.storageService = new ChatStorageService();
        this.sessionRepo = new FirebaseChatSessionObsRepository();
        this.conversationRepo = new FirebaseChatConversationObsRepository();
        this.model = geminiModel;

        // --- LÓGICA REACTIVA ---

        // 1. Exponer las sesiones del repositorio
        this.sessions$ = this.sessionRepo.data$;
        // <-- AÑADIDO: Conectar los observables de paginación de sesiones -->
        this.sessionsLoading$ = this.sessionRepo.loading$;
        this.sessionsHasMore$ = this.sessionRepo.hasMore$;

        // <-- AÑADIDO: Conectar los observables de paginación de conversaciones -->
        this.conversationsLoading$ = this.conversationRepo.loading$;
        this.conversationsHasMore$ = this.conversationRepo.hasMore$;

        // 2. Cuando la sesión activa cambia, obtener sus conversaciones
        this.activeSessionIdSubject
            .pipe(
                tap((sessionId) => {
                    // Limpiar conversaciones anteriores y detener escuchas
                    this.conversationRepo.destroy();
                    if (sessionId) {
                        // Iniciar la escucha para la nueva sesión
                        this.conversationRepo.get([
                            {
                                field: 'sessionToBelongsTo',
                                operator: '==',
                                value: sessionId,
                                direction: 'asc'
                            }
                        ]);
                    }
                }),
                // Usamos switchMap para obtener el historial y reiniciar el modelo de IA
                switchMap((sessionId) => {
                    if (!sessionId) return of([]);
                    return this.conversationRepo.data$;
                })
            )
            .subscribe((conversations) => {
                // Cuando las conversaciones de la sesión seleccionada cargan,
                // reiniciamos el chat de la IA con el historial correcto.
                console.log(
                    'Cargando historial para el modelo:',
                    conversations
                );
                const history = this.formatHistoryForAI(conversations);
                console.log('history', history);
                this.chat = this.model.startChat({
                    history,
                    generationConfig: {
                        //maxOutputTokens: 2048, // puede ser contraproducente
                        temperature: 0.7,
                        topP: 1
                    }
                });
            });

        // 3. Combinar conversaciones de la BD y la conversación temporal
        this.activeConversations$ = combineLatest([
            this.conversationRepo.data$,
            this.temporaryConversationSubject
        ]).pipe(
            map(([savedConversations, tempConversation]) => {
                // Si hay una conversación temporal, la añadimos a la lista para la UI
                return tempConversation
                    ? [...savedConversations, tempConversation]
                    : savedConversations;
            })
        );

        // Iniciar la carga de sesiones del usuario
        this.sessionRepo.get([
            {
                field: 'uid',
                operator: '==',
                value: this.userId,
                direction: 'asc'
            }
        ]);

        // Suscribir al emisor de mensajes de error
        //this.messageSubject.subscribe(console.error);
    }

    // --- MÉTODOS PÚBLICOS DE ACCIÓN ---

    /**
     * Selecciona una sesión de chat para ver sus conversaciones.
     * @param sessionId El ID de la sesión a activar, o null para deseleccionar.
     */
    public selectSession(sessionId: string | undefined): void {
        if (this.activeSessionIdSubject.value !== sessionId) {
            this.activeSessionIdSubject.next(sessionId);
            this.temporaryConversationSubject.next(null); // Limpiar mensaje temporal al cambiar de sesión
        }
    }

    /**
     * Envía un nuevo mensaje. Orquesta la creación de sesión, la UI temporal y el stream de la IA.
     */
    public async sendMessage(chatData: IMyChat): Promise<void> {
        if (this.statusSubject.value === 'streaming') return;
        this.isStopRequested = false;

        let currentSessionId = this.activeSessionIdSubject.value;

        try {
            // 1. Chequeamos que el modelo de chat esté inicializado
            if (!this.chat) {
                throw new Error(
                    'El modelo de chat no está inicializado. Espera a que la sesión cargue.'
                );
            }

            // 2. Si no hay sesión activa, crea una nueva primero
            if (!currentSessionId) {
                // 2.1 Creamos la sesión
                const newSessionID = await this.createSessionToConversation(
                    chatData
                );

                // 2.2 Asignamos la sesión a la conversación
                currentSessionId = newSessionID;
                this.selectSession(currentSessionId); // Activa la nueva sesión
            }

            // 3. Chequeamos que la conversación esté activa
            if (!this.selectSession) {
                throw new Error(
                    'La conversación no contiene el ID de la sesión'
                );
            }

            // 3. Actualizamos el estado de la conversación
            this.updateStatus('streaming');

            // PASO CLAVE: Mostrar la pregunta del usuario en la UI INMEDIATAMENTE
            const tempConversation: ICustomChatConversation = {
                id: `temp-${Date.now()}`,
                sessionToBelongsTo: currentSessionId,
                createdAt: GetToday(),
                updatedAt: GetToday(),
                question: chatData.message,
                response: '...' // Placeholder para la respuesta,
            };

            // 3. Chequemos si es replay conversation
            if (
                chatData.isReplyConversation &&
                chatData.isReplyConversation === true
            ) {
                tempConversation.isReplyConversation = true;
            }

            this.temporaryConversationSubject.next(tempConversation);

            // 4. Gestion de partes
            const someParts: Part[] = [];
            const charParts = chatData.inlineParts || [];
            someParts.push(...charParts);
            const filesPartsToSave: FileDataPart[] = [];

            if (
                tempConversation.isReplyConversation &&
                chatData.fileDataParts
            ) {
                // 4.1 Si es reply conversation y hay partes de archivos, leemos el contenido de los archivos
                // - se lee por medio del fileDataPart para convertirlo a inlineDataPart
                const filesParts =
                    await this.storageService.readFileToInlineDataPart(
                        chatData.fileDataParts
                    );

                someParts.push(...filesParts);
            } else {
                // 4.2 Si no es reply conversation o no hay partes de archivos, subimos los archivos
                // 4.2.1 se toma inlineDataPart para el modelo y fileDataPart para el storage
                const filesParts = await this.storageService.uploadFiles(
                    chatData.files,
                    this.userId,
                    currentSessionId
                );

                // to model
                someParts.push(...filesParts.inlineDataParts);
                // to storage
                filesPartsToSave.push(...filesParts.fileDataParts);
            }

            // 4.3 Preparamos el contenido
            const content =
                someParts.length > 0
                    ? [chatData.message, ...someParts]
                    : chatData.message;

            console.log('content', content);

            // 5. Enviamos el mensaje al modelo

            // const mock = new MockGenerativeModel({
            //     delay: 50,
            //     chunkSize: 3
            //     // shouldFail: true
            // });
            // const result = await mock.generateContentStream(chatData.message);
            const result = await this.chat.sendMessageStream(content);

            // 5.1 Gestion de la respuesta por streaming
            let accumulatedText = '';
            for await (const chunk of result.stream) {
                if (this.isStopRequested) {
                    this.updateStatus('stopped');
                    // Actualizamos la UI temporal por última vez y salimos
                    this.temporaryConversationSubject.next({
                        ...tempConversation,
                        response: accumulatedText
                    });
                    // No guardamos en BD
                    // Para limpiar el estado temporal, podrías hacer: setTimeout(() => this.temporaryConversationSubject.next(null), 2000);
                    return;
                }
                accumulatedText += chunk.text();
                // Actualizamos la UI en tiempo real
                this.temporaryConversationSubject.next({
                    ...tempConversation,
                    response: accumulatedText
                });
            }

            // 6. Stream completado: Guardar en la base de datos
            const newConversation: ICustomChatConversation = {
                id: '',
                sessionToBelongsTo: currentSessionId,
                createdAt: tempConversation.createdAt,
                updatedAt: GetToday(),
                question: chatData.message,
                response: accumulatedText
            };
            // 6.1 Si es reply conversation, marcamos la conversación como tal
            if (chatData.isReplyConversation) {
                newConversation.isReplyConversation = true;
            }
            // 6.2 Si hay partes de archivos, guardamos en la conversación
            if (filesPartsToSave.length > 0) {
                newConversation.fileDataParts = filesPartsToSave;
            }
            // 6.3 Creamos la conversación
            await this.dataService.createConversation({
                values: newConversation
            });

            // 7. Limpiamos la conversación temporal. onSnapshot se encargará de mostrar la real.
            this.temporaryConversationSubject.next(null);
            this.updateStatus('completed');
        } catch (error: unknown) {
            console.error('Error en sendMessage:', error);
            this.updateStatus('error');
            this.temporaryConversationSubject.next(null); // Limpiar en caso de error

            // const errorMessage =
            //     error instanceof Error
            //         ? error.message
            //         : 'An unknown error occurred';
        }
    }

    public stopStream(): void {
        if (this.statusSubject.value === 'streaming') {
            this.isStopRequested = true;
        }
    }

    /**
     * Limpia todas las suscripciones. Llamar al desmontar el componente principal.
     */
    public destroy(): void {
        this.sessionRepo.destroy();
        this.conversationRepo.destroy();
        this.activeSessionIdSubject.complete();
        this.temporaryConversationSubject.complete();
        console.log('ChatService destruido y suscripciones limpiadas.');
    }

    /**
     * Carga la siguiente página de sesiones de chat del usuario.
     */
    public loadMoreSessions(): void {
        this.sessionRepo.loadMore();
    }

    /**
     * Carga la siguiente página de conversaciones para la sesión activa.
     */
    public loadMoreConversations(): void {
        this.conversationRepo.loadMore();
    }

    /**
     *  ? -----------------------------
     *  *  Session
     *  ? -----------------------------
     */
    public async createSession(): Promise<void> {
        const newSession = await this.dataService.createSession({
            values: {
                id: '',
                uid: this.userId,
                title: 'New Session',
                createdAt: GetToday(),
                updatedAt: GetToday(),
                conversations: []
            }
        });

        this.selectSession(newSession.id);
    }
    private async createSessionToConversation(
        chatData: IMyChat
    ): Promise<string> {
        const newSession: ICustomChatSession = {
            id: '',
            uid: this.userId,
            title: chatData.message.substring(0, 30) + '...',
            createdAt: GetToday(),
            updatedAt: GetToday(),
            conversations: []
        };

        if (chatData.isReplyConversation) {
            newSession.isReplyConversation = true;
        }

        const result = await this.dataService.createSession({
            values: newSession
        });

        return result.id;
    }

    public renameSession(session: ICustomChatSession): void {
        this.dataService.updateSession(session.id, {
            title: session.title
        });
    }
    public deleteSession(session: ICustomChatSession): void {
        // 1. Borrar la sesión en la base de datos
        this.dataService.deleteSession(session.id);

        // 2. Borrar todos los archivos asociados dentro del bucket
        this.storageService.deleteSession(this.userId, session.id);
    }

    /**
     *  ? -----------------------------
     *  *  Conversation
     *  ? -----------------------------
     */
    public deleteConversation(conversation: ICustomChatConversation): void {
        // 1. Borrar conversación
        this.dataService.deleteConversation({
            values: conversation
        });

        // 2. IF conversation is reply, do not delete fileDataParts
        if (conversation.isReplyConversation === true) return;

        // 2. IF conversation has inlineParts, delete inlineParts
        if (conversation.fileDataParts) {
            this.storageService.deleteFileConversation(
                this.userId,
                conversation.sessionToBelongsTo,
                conversation.fileDataParts
            );
        }
    }

    /**
     *  ? -----------------------------
     *  *  Storage
     *  ? -----------------------------
     */
    public async readFileInlinePart(inlineParts: InlineDataPart) {
        return this.storageService.readFileInlineDataPart(inlineParts);
    }
    public async readFileFileDataPart(fileParts: FileDataPart) {
        return this.storageService.readFileFileDataPart(fileParts);
    }

    // --- MÉTODOS PRIVADOS AUXILIARES ---

    private updateStatus(status: StreamStatus): void {
        this.statusSubject.next(status);
    }

    private formatHistoryForAI(
        conversations: ICustomChatConversation[]
    ): Content[] {
        return conversations.flatMap((conv) => {
            if (!conv.response) {
                return [
                    // {
                    //     role: 'user',
                    //     parts: [{ text: conv.question, type: 'text' }]
                    // }
                ];
            }

            const response: string = JSON.stringify(conv.response);

            return [
                {
                    role: 'user',
                    parts: [{ text: conv.question }]
                },
                {
                    role: 'model',
                    parts: [{ text: response }]
                }
            ];
        });
    }
}
