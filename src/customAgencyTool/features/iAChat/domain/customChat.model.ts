import type { FileDataPart, InlineDataPart } from 'firebase/ai';
import firebase from 'firebase/compat/app';

export interface ICustomChatConversation {
    /**
     * Unique identifier for the conversation
     */
    id: string;
    /**
     * Unique identifier specifying the session to which the conversation belongs
     */
    sessionToBelongsTo: string;
    /**
     * Date and time when the conversation was created
     */
    createdAt: Date;
    /**
     * Date and time when the conversation was last updated
     */
    updatedAt?: Date;
    /**
     * The user's question or input that initiated the conversation
     */
    question: string;
    /**
     * The AI's response to the user's question
     */
    response?: string;
    /**
     * Array of file paths or identifiers associated with the conversation
     */
    fileDataParts?: FileDataPart[];
    inlineParts?: InlineDataPart[];
    /**
     * It is a reply conversation if the user sends a message to the AI
     */
    isReplyConversation?: boolean;

    [key: string]: firebase.firestore.FieldValue | Partial<unknown> | undefined;
}

export interface ICustomChatSession {
    /**
     * Unique identifier for the session
     */
    id: string;
    /**
     * Unique identifier for the user who created the session
     */
    uid: string;
    /**
     * Title of the session
     */
    title?: string;
    /**
     * Date and time when the session was created
     */
    createdAt: Date;
    /**
     * Date and time when the session was last updated
     */
    updatedAt: Date;
    /**
     * Array of conversations within this session
     */
    conversations: ICustomChatConversation[];
    /**
     * Disable
     */
    disabled?: boolean;
    disabledReason?: string;

    [key: string]: firebase.firestore.FieldValue | Partial<unknown> | undefined;
}
