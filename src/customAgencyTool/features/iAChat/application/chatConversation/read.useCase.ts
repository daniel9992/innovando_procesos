import type { IPrompt } from '../../domain/chatConfig.model';
import type { ICustomChatConversation } from '../../domain/customChat.model';
import type {
    IChatPromptRepository,
    IReadChatConversationRepository
} from './IChatConversationRepository';

export interface IReadChatConversation {
    conversationId: string;
}

export class ReadChatConversationUseCase {
    constructor(private readonly repository: IReadChatConversationRepository) {}

    async execute(
        args: IReadChatConversation
    ): Promise<ICustomChatConversation> {
        return this.repository.readConversation(args);
    }
}

// -----------------------------------------------------------------------------
export interface IReadChatPrompts {
    action: string;
}

export class ReadChatPromptsUseCase {
    constructor(private readonly repository: IChatPromptRepository) {}

    async execute(args: IReadChatPrompts): Promise<IPrompt[]> {
        return this.repository.readPrompt(args);
    }
}
