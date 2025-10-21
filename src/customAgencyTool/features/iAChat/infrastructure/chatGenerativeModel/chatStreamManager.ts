import type {
    ChatSession,
    GenerationConfig,
    GenerativeModel
} from 'firebase/ai';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import type {
    ChatHistory,
    IChatStreamManager,
    StartStreamArgs,
    StreamResponse,
    StreamStatus
} from '../../domain/chatGenerate.model';

export class ChatStreamManager implements IChatStreamManager {
    // Sujetos de RxJS para la gestión del stream y el estado
    private streamSubject = new Subject<StreamResponse>();
    private statusSubject = new BehaviorSubject<StreamStatus>('idle');

    // La sesión de chat es la única fuente de verdad para el historial
    private chat: ChatSession;
    private model: GenerativeModel;

    // ANOTACIÓN 1: El constructor ahora se encarga de la inicialización.
    constructor(
        model: GenerativeModel,
        initialHistory: ChatHistory = [],
        config?: GenerationConfig
    ) {
        this.model = model;

        // La sesión se crea una sola vez, aquí.
        this.chat = this.model.startChat({
            history: initialHistory,
            // Permite configurar el modelo al inicio, con valores por defecto razonables.
            generationConfig: config ?? {
                maxOutputTokens: 2048,
                temperature: 0.7,
                topP: 1
            }
        });
    }

    // --- Métodos Públicos de Control ---

    public async startStream(args: StartStreamArgs): Promise<void> {
        // Si ya hay un stream corriendo, lo detenemos antes de empezar uno nuevo.
        if (this.statusSubject.value === 'streaming') {
            this.stopStream();
        }

        this.statusSubject.next('streaming');

        try {
            // ANOTACIÓN 4: Lógica de envío simplificada.
            const { prompt, parts } = args;
            // El prompt se puede construir con texto e imágenes (parts)
            const promptContent = parts ? [prompt, ...parts] : prompt;

            // const mock = new MockGenerativeModel({
            //     delay: 300,
            //     chunkSize: 3
            //     // shouldFail: true
            // });
            // const result = await mock.generateContentStream(prompt);

            const result = await this.chat.sendMessageStream(promptContent);

            let fullResponseText = '';
            for await (const chunk of result.stream) {
                // Si el stream fue detenido externamente, salimos del bucle.
                if (this.statusSubject.value !== 'streaming') {
                    break;
                }

                const chunkText = chunk.text();
                fullResponseText += chunkText; // Acumulamos el texto para guardarlo en el historial
                this.streamSubject.next({
                    text: chunkText,
                    isComplete: false,
                    status: 'streaming',
                    timestamp: Date.now()
                });
            }

            // Al terminar el bucle, verificamos si se completó naturalmente.
            if (this.statusSubject.value === 'streaming') {
                this.statusSubject.next('completed');
                this.streamSubject.next({
                    // text: '', // No enviamos texto acumulado para evitar duplicados en el cliente.
                    text: fullResponseText,
                    isComplete: true,
                    status: 'completed',
                    timestamp: Date.now()
                });
            }

            // IMPORTANTE: No necesitamos actualizar 'this.history' manualmente.
            // La instancia 'this.chat' ya ha actualizado su historial interno.
        } catch (error) {
            console.error('Error during streaming:', error);
            this.handleError(error as Error);
        }
    }

    public stopStream(): void {
        if (this.statusSubject.value === 'streaming') {
            this.statusSubject.next('stopped');
            this.streamSubject.next({
                text: '',
                isComplete: true,
                status: 'stopped',
                timestamp: Date.now()
            });
        }
    }

    // ANOTACIÓN 3: El historial se obtiene directamente de la sesión de chat.
    public async getHistory(): Promise<ChatHistory> {
        // La sesión de chat es la fuente de verdad.
        return this.chat.getHistory(); // Devuelve una copia para evitar mutaciones externas
    }

    // --- Métodos para suscribirse a los Observables ---

    public getStream(): Observable<StreamResponse> {
        return this.streamSubject.asObservable();
    }

    public getStatus(): Observable<StreamStatus> {
        return this.statusSubject.asObservable();
    }

    // --- Manejo de errores ---

    private handleError(error: Error): void {
        this.statusSubject.next('error');
        this.streamSubject.next({
            text: '',
            isComplete: true,
            error,
            status: 'error',
            timestamp: Date.now()
        });
    }

    // ANOTACIÓN 5: Métodos que ya no son necesarios o se simplifican.
    // - setHistory: La lógica ahora está en el constructor.
    // - pause/resume/refresh: Se pueden implementar si es necesario, pero
    //   el patrón stop/start es más simple y a menudo suficiente.
    // - clearStream: 'stopStream' ya cumple esta función.
}
