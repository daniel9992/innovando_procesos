import type { ICustomChatSession } from '../../domain/customChat.model';
import type { IReadChatSessionRepository } from './IChatSessionRepository';

export interface IUpdateChatSession {
    values: ICustomChatSession;
}

export class UpdateChatSessionUseCase {
    constructor(private readonly repository: IReadChatSessionRepository) {}

    async execute(args: IUpdateChatSession): Promise<ICustomChatSession> {
        return this.repository.updateSession(args);
    }
}
