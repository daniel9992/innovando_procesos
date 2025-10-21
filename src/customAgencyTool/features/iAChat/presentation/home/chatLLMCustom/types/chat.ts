import { type ReactNode } from 'react';

// Tipos básicos
export interface Timestamp {
    createdAt: Date;
    updatedAt?: Date;
}

export interface BaseEntity {
    id: string;
    title: string;
}

// Tipos de archivos
export interface FileMetadata {
    size: number;
    type: string;
    lastModified: number;
}

export interface ConversationFile extends BaseEntity, Partial<FileMetadata> {
    name: string;
    url?: string;
    preview?: string;
    status?: 'uploading' | 'success' | 'error';
    progress?: number;
}

// Tipos de mensajes
export type MessageType = 'question' | 'response' | 'system' | 'error';

export interface MessageSource {
    title: string;
    url?: string;
    image?: string;
    description?: string;
    author?: string;
    publishedAt?: Date;
}

export interface Message extends BaseEntity, Timestamp {
    content: string;
    type: MessageType;
    files?: ConversationFile[];
    sources?: MessageSource[];
    metadata?: {
        tokens?: number;
        processingTime?: number;
        model?: string;
    };
    error?: {
        code: string;
        message: string;
    };
}

// Tipos de conversación
export interface Conversation extends BaseEntity, Timestamp {
    question: string;
    response?: string;
    files?: ConversationFile[];
    sources?: MessageSource[];
    metadata?: {
        model?: string;
        temperature?: number;
        maxTokens?: number;
    };
}

// Tipos de sesión
export interface Session extends BaseEntity, Timestamp {
    conversations: Conversation[];
    status?: 'active' | 'archived' | 'pending';
    metadata?: {
        totalMessages?: number;
        lastActivity?: Date;
        category?: string;
    };
}

// Tipos de sugerencias
export interface Suggestion extends BaseEntity {
    content: string;
    category: string;
    tags?: string[];
    usage?: number;
}

// Tipos para configuración
export interface ChatConfig {
    maxFiles?: number;
    allowedFileTypes?: string[];
    maxMessageLength?: number;
    defaultModel?: string;
    temperature?: number;
    maxTokens?: number;
}

// Tipos para estados
export interface ChatState {
    sessions: Session[];
    activeSessionId?: string;
    isLoading: boolean;
    error: Error | null;
}

export interface MessagesState {
    messages: Message[];
    isLoading: boolean;
    error: Error | null;
}

export interface FilesState {
    files: ConversationFile[];
    isUploading: boolean;
    uploadProgress: number;
    error: Error | null;
}

// Tipos para props de componentes
export interface ChatInputProps {
    defaultValue?: string;
    placeholder?: string;
    allowedFiles?: string[];
    maxFiles?: number;
    showSuggestions?: boolean;
    disabled?: boolean;
    onSend?: (message: string, files?: File[]) => void;
    onFileUpload?: (files: File[]) => void;
    className?: string;
}

export interface MessageProps {
    message: Message;
    isLast?: boolean;
    showActions?: boolean;
    onUpvote?: () => void;
    onDownvote?: () => void;
    onCopy?: () => void;
    onRefresh?: () => void;
    className?: string;
}

export interface SessionItemProps {
    session: Session;
    isActive?: boolean;
    showActions?: boolean;
    onSelect?: (session: Session) => void;
    onDelete?: (session: Session) => void;
    onRename?: (session: Session, newTitle: string) => void;
    className?: string;
}

// Tipos para temas y estilos
export interface ChatTheme {
    container?: string;
    header?: string;
    messagesList?: string;
    message?: {
        container?: string;
        question?: string;
        response?: string;
        error?: string;
        actions?: string;
    };
    input?: {
        container?: string;
        textarea?: string;
        actions?: string;
    };
}

// Tipos para acciones
export interface ChatActions {
    onUpvote: (messageId: string) => void;
    onDownvote: (messageId: string) => void;
    onCopy: (content: string) => void;
    onRefresh: (messageId: string) => void;
}

// Tipos para eventos
export interface ChatEvents {
    onSessionCreate?: () => void;
    onSessionSelect?: (session: Session) => void;
    onSessionDelete?: (session: Session) => void;
    onMessageSend?: (message: string, files?: File[]) => void;
    onFileUpload?: (files: File[]) => void;
    onError?: (error: Error) => void;
}

// Tipos para el contexto
export interface ChatContextValue {
    sessions: Session[];
    activeSession?: Session;
    isLoading: boolean;
    disabled: boolean;
    theme?: ChatTheme;
    config?: ChatConfig;
    sendMessage?: (message: string, files?: File[]) => void;
    stopMessage?: () => void;
    createSession?: () => void;
    deleteSession?: (sessionId: string) => void;
    selectSession?: (sessionId: string) => void;
}

// Tipos para renders personalizados
export interface CustomRenderers {
    messageQuestion?: (props: MessageProps) => ReactNode;
    messageResponse?: (props: MessageProps) => ReactNode;
    messageError?: (props: MessageProps) => ReactNode;
    sessionItem?: (props: SessionItemProps) => ReactNode;
    input?: (props: ChatInputProps) => ReactNode;
}

// Tipos para API responses
export interface APIResponse<T> {
    data: T;
    status: number;
    message?: string;
    error?: {
        code: string;
        message: string;
    };
}

// Tipos para utilidades
export interface PaginationParams {
    page: number;
    limit: number;
    sort?: string;
    order?: 'asc' | 'desc';
}

export interface SearchParams {
    query: string;
    filters?: Record<string, any>;
}

// Tipos para animaciones
export interface AnimationConfig {
    enabled: boolean;
    type?: 'fade' | 'slide' | 'scale';
    duration?: number;
}

// Tipos para métricas
export interface MessageMetrics {
    characters: number;
    words: number;
    responseTime: number;
    tokens?: number;
}

// Exportar todos los tipos
// export type {
//     Timestamp,
//     BaseEntity,
//     FileMetadata,
//     ConversationFile,
//     MessageType,
//     MessageSource,
//     Message,
//     Conversation,
//     Session,
//     Suggestion,
//     ChatConfig,
//     ChatState,
//     MessagesState,
//     FilesState,
//     ChatInputProps,
//     MessageProps,
//     SessionItemProps,
//     ChatTheme,
//     ChatActions,
//     ChatEvents,
//     ChatContextValue,
//     CustomRenderers,
//     APIResponse,
//     PaginationParams,
//     SearchParams,
//     AnimationConfig,
//     MessageMetrics
// };
