import type { ToolConfig } from 'firebase/ai';
import firebase from 'firebase/compat/app';

// Model to Configure Chat
export interface IChatConfig extends ToolConfig {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
}

// Prompt interface to save in DB
export interface IPrompt {
    id: string;
    createdAt: Date;
    title: string;
    prompt: string;

    [key: string]: firebase.firestore.FieldValue | Partial<unknown> | undefined;
}
