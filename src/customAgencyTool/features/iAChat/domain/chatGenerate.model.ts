import type { Content, Part } from 'firebase/ai';
import type { Observable } from 'rxjs';

export type StreamStatus =
    | 'idle'
    | 'streaming'
    | 'completed'
    | 'stopped'
    | 'error';

export interface StreamResponse {
    text: string;
    isComplete: boolean;
    status: StreamStatus;
    error?: Error;
    timestamp: number;
}

export interface StartStreamArgs {
    prompt: string;
    // La API espera un arreglo de 'Part', que pueden ser texto o datos binarios (inlineData)
    // Simplificaremos a solo texto por ahora para coincidir con el uso.
    parts?: Part[];
}

// ANOTACIÓN 2: Corregir y simplificar el tipo de historial para que coincida con la librería.
// La librería solo acepta roles 'user' y 'model' en el historial.
export type ChatHistory = Content[];

export interface IChatStreamManager {
    startStream(args: StartStreamArgs): Promise<void>;
    stopStream(): void;
    getHistory(): Promise<ChatHistory> | ChatHistory;
    getStream(): Observable<StreamResponse>;
    getStatus(): Observable<StreamStatus>;
}
