import type { IPrompt } from '../../domain/chatConfig.model';
import type { ICustomChatConversation } from '../../domain/customChat.model';
import type {
    ICreateChatConversation,
    ICreateChatPrompt
} from './create.useCase';
import type {
    IDeleteChatConversation,
    IDeleteChatPrompt
} from './delete.useCase';
import type { IReadChatConversation, IReadChatPrompts } from './read.useCase';
import type {
    IUpdateChatConversation,
    IUpdateChatPrompt
} from './update.useCase';

export interface IReadChatConversationRepository {
    /**
     * Reads a Conversation by its ID.
     * @param args - The arguments for the use case.
     * @returns A promise that resolves to the Conversation.
     */
    readConversation(
        args: IReadChatConversation
    ): Promise<ICustomChatConversation>;
    /**
     * Update a Conversation.
     * @param args - The arguments for the use case.
     * @returns A promise that resolves when the update is complete.
     */
    updateConversation(
        args: IUpdateChatConversation
    ): Promise<ICustomChatConversation>;
    /**
     * Delete a Conversation.
     * @param args - The arguments for the use case.
     * @returns A promise that resolves when the delete is complete.
     */
    deleteConversation(args: IDeleteChatConversation): Promise<void>;
    /**
     * Create a new Conversation.
     * @param args - The arguments for the use case.
     * @returns A promise that resolves to the created Conversation.
     */
    createConversation(
        args: ICreateChatConversation
    ): Promise<ICustomChatConversation>;
}

//------------------------------------------------------------------------------

export interface IChatPromptRepository {
    /**
     * Read all Prompts
     * @param args - The arguments for the use case.
     * @returns A promise that resolves to the Prompts.
     */
    readPrompt(args: IReadChatPrompts): Promise<IPrompt[]>;
    /**
     * Update a Prompt.
     * @param args - The arguments for the use case.
     * @returns A promise that resolves when the update is complete.
     */
    updatePrompt(args: IUpdateChatPrompt): Promise<IPrompt[]>;
    /**
     * Delete a Prompt.
     * @param args - The arguments for the use case.
     * @returns A promise that resolves when the delete is complete.
     */
    deletePrompt(args: IDeleteChatPrompt): Promise<IPrompt[]>;
    /**
     * Create a new Prompt.
     * @param args - The arguments for the use case.
     * @returns A promise that resolves to the created Prompt.
     */
    createPrompt(args: ICreateChatPrompt): Promise<IPrompt[]>;
}
