import type { IPrompt } from '../../domain/chatConfig.model';
import type { ICustomChatConversation } from '../../domain/customChat.model';
import type {
    IChatPromptRepository,
    IReadChatConversationRepository
} from './IChatConversationRepository';

export interface IDeleteChatConversation {
    values: ICustomChatConversation;
}

export class DeleteChatConversationUseCase {
    constructor(private readonly repository: IReadChatConversationRepository) {}

    async execute(args: IDeleteChatConversation): Promise<void> {
        return this.repository.deleteConversation(args);
    }
}

//------------------------------------------------------------------------------
export interface IDeleteChatPrompt {
    values: IPrompt[];
}

export class DeleteChatPromptUseCase {
    constructor(private readonly repository: IChatPromptRepository) {}

    async execute(args: IDeleteChatPrompt): Promise<IPrompt[]> {
        return this.repository.deletePrompt(args);
    }
}
