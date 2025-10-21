import type { GenerationConfig, GenerativeModel } from 'firebase/ai';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import type {
    ChatHistory,
    IChatStreamManager,
    StartStreamArgs,
    StreamResponse,
    StreamStatus
} from '../../domain/chatGenerate.model';

export class ContentGeneratorStreamManager implements IChatStreamManager {
    private streamSubject = new Subject<StreamResponse>();
    private statusSubject = new BehaviorSubject<StreamStatus>('idle');

    private model: GenerativeModel;
    private config?: GenerationConfig;

    // DIFERENCIA CLAVE 1: La clase ahora debe mantener su propio historial.
    // Ya no delegamos esto a una 'ChatSession'.
    private history: ChatHistory;

    constructor(
        model: GenerativeModel,
        initialHistory: ChatHistory = [],
        config?: GenerationConfig
    ) {
        this.model = model;
        this.history = initialHistory; // Guardamos el historial inicial
        this.config = config ?? {
            // Guardamos la configuración
            maxOutputTokens: 2048,
            temperature: 0.7,
            topP: 1
        };
    }

    // --- Métodos Públicos de Control ---

    public async startStream(args: StartStreamArgs): Promise<void> {
        if (this.statusSubject.value === 'streaming') {
            this.stopStream();
        }
        this.statusSubject.next('streaming');

        try {
            const { prompt, parts } = args;
            const promptParts = parts
                ? [{ text: prompt }, ...parts]
                : [{ text: prompt }];

            // ANOTACIÓN 1: Añadimos manualmente el prompt del usuario al historial ANTES de la llamada.
            this.history.push({
                role: 'user',
                parts: promptParts
            });

            // DIFERENCIA CLAVE 2: Usamos model.generateContentStream en lugar de chat.sendMessageStream.
            // Le pasamos el historial completo en cada llamada.
            const result = await this.model.generateContentStream({
                contents: this.history,
                generationConfig: this.config
            });
            // const mock = new MockGenerativeModel({
            //     delay: 50,
            //     chunkSize: 3
            //     // shouldFail: true
            // });
            // const result = await mock.generateContentStream(prompt);

            let fullResponseText = '';
            for await (const chunk of result.stream) {
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

            // ANOTACIÓN 2: Añadimos manualmente la respuesta COMPLETA del modelo al historial DESPUÉS de la llamada.
            this.history.push({
                role: 'model',
                parts: [{ text: fullResponseText }]
            });

            if (this.statusSubject.value === 'streaming') {
                this.statusSubject.next('completed');
                this.streamSubject.next({
                    text: '',
                    isComplete: true,
                    status: 'completed',
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.error('Error during streaming:', error);
            // ANOTACIÓN 3: Si hay un error, debemos eliminar el último prompt del usuario que añadimos.
            if (this.history[this.history.length - 1].role === 'user') {
                this.history.pop();
            }
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

    // DIFERENCIA CLAVE 3: getHistory ahora es síncrono y devuelve nuestra copia local.
    public getHistory(): ChatHistory {
        // return [...this.history]; // Devuelve una copia para evitar mutaciones externas
        return this.history;
    }

    // Método de utilidad para este enfoque stateless
    public clearHistory(): void {
        this.history = [];
    }

    // --- Métodos para suscribirse a los Observables (Idénticos) ---

    public getStream(): Observable<StreamResponse> {
        return this.streamSubject.asObservable();
    }

    public getStatus(): Observable<StreamStatus> {
        return this.statusSubject.asObservable();
    }

    // --- Manejo de errores (Idéntico) ---

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
}
