import type { ICustomChatSession } from '../../domain/customChat.model';
import type { ICreateChatSession } from './create.useCase';
import type { IDeleteChatSession } from './delete.useCase';
import type { IReadChatSession } from './read.useCase';
import type { IUpdateChatSession } from './update.useCase';

export interface IReadChatSessionRepository {
    /**
     * Reads a session by its ID.
     * @param args - The arguments for the use case.
     * @returns A promise that resolves to the session.
     */
    readSession(args: IReadChatSession): Promise<ICustomChatSession>;
    /**
     * Update a session.
     * @param args - The arguments for the use case.
     * @returns A promise that resolves when the update is complete.
     */
    updateSession(args: IUpdateChatSession): Promise<ICustomChatSession>;
    /**
     * Delete a session.
     * @param args - The arguments for the use case.
     * @returns A promise that resolves when the delete is complete.
     */
    deleteSession(args: IDeleteChatSession): Promise<void>;
    /**
     * Create a new session.
     * @param args - The arguments for the use case.
     * @returns A promise that resolves to the created session.
     */
    createSession(args: ICreateChatSession): Promise<ICustomChatSession>;
}
