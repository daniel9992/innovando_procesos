import type { ICustomChatSession } from '../../domain/customChat.model';
import type { IReadChatSessionRepository } from './IChatSessionRepository';

export interface IReadChatSession {
    sessionId: string;
}

export class ReadChatSessionUseCase {
    constructor(private readonly repository: IReadChatSessionRepository) {}

    async execute(args: IReadChatSession): Promise<ICustomChatSession> {
        return this.repository.readSession(args);
    }
}
