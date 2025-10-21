import type { ICustomChatSession } from '../../domain/customChat.model';
import type { IReadChatSessionRepository } from './IChatSessionRepository';

export interface ICreateChatSession {
    values: ICustomChatSession;
}

export class CreateChatSessionUseCase {
    constructor(private readonly repository: IReadChatSessionRepository) {}

    async execute(args: ICreateChatSession): Promise<ICustomChatSession> {
        return this.repository.createSession(args);
    }
}
