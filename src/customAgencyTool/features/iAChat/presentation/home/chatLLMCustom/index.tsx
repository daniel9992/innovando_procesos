import type { ChatConfig } from './types/chat';

// Constantes y configuración por defecto
export const DEFAULT_CONFIG: ChatConfig = {
    maxFiles: 10,
    allowedFileTypes: [
        '.pdf',
        '.doc',
        '.docx',
        '.txt',
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.csv',
        '.xlsx',
        '.xls'
    ],
    maxMessageLength: 4000,
    defaultModel: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 2000
};

// Temas predefinidos
export const CHAT_THEMES = {
    default: {
        container: 'chat-container',
        header: 'chat-header',
        messagesList: 'messages-list',
        message: {
            container: 'message-container',
            question: 'message-question',
            response: 'message-response',
            error: 'message-error',
            actions: 'message-actions'
        },
        input: {
            container: 'input-container',
            textarea: 'input-textarea',
            actions: 'input-actions'
        }
    }
    // Otros temas...
};
