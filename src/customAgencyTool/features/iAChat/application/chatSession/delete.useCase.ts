import type { ICustomChatSession } from '../../domain/customChat.model';
import type { IReadChatSessionRepository } from './IChatSessionRepository';

export interface IDeleteChatSession {
    values: ICustomChatSession;
}

export class DeleteChatSessionUseCase {
    constructor(private readonly repository: IReadChatSessionRepository) {}

    async execute(args: IDeleteChatSession): Promise<void> {
        return this.repository.deleteSession(args);
    }
}
