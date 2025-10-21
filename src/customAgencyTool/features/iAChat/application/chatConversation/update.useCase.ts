import type { IPrompt } from '../../domain/chatConfig.model';
import type { ICustomChatConversation } from '../../domain/customChat.model';
import type {
    IChatPromptRepository,
    IReadChatConversationRepository
} from './IChatConversationRepository';

export interface IUpdateChatConversation {
    values: ICustomChatConversation;
}

export class UpdateChatConversationUseCase {
    constructor(private readonly repository: IReadChatConversationRepository) {}

    async execute(
        args: IUpdateChatConversation
    ): Promise<ICustomChatConversation> {
        return this.repository.updateConversation(args);
    }
}

//  ------------------------------------------------------------------------------
export interface IUpdateChatPrompt {
    values: IPrompt[];
}

export class UpdateChatPromptUseCase {
    constructor(private readonly repository: IChatPromptRepository) {}

    async execute(args: IUpdateChatPrompt): Promise<IPrompt[]> {
        return this.repository.updatePrompt(args);
    }
}
