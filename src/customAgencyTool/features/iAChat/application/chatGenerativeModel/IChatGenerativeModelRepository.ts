import { Observable } from 'rxjs';
import type {
    StreamResponse,
    StreamStatus
} from '../../domain/chatGenerate.model';

export interface StreamConfig {
    maxOutputTokens?: number;
    temperature?: number;
    topP?: number;
    topK?: number;
}

export interface IStartStream {
    prompt: string;
    fileParts?: Array<string>;
    config?: StreamConfig;
}

export interface IStartStreamChat {
    prompt: string;
}

export interface IAIStreamService {
    getStream(): Observable<StreamResponse>;
    startStream(args: IStartStream): Promise<void>;
    stopStream(): void;
    refreshStream(): void;
    clearStream(): void;
    getStatus(): StreamStatus;
}
