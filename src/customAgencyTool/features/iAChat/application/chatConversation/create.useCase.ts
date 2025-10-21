import type { IPrompt } from '../../domain/chatConfig.model';
import type { ICustomChatConversation } from '../../domain/customChat.model';
import type {
    IChatPromptRepository,
    IReadChatConversationRepository
} from './IChatConversationRepository';

export interface ICreateChatConversation {
    values: ICustomChatConversation;
}

export class CreateChatConversationUseCase {
    constructor(private readonly repository: IReadChatConversationRepository) {}

    async execute(
        args: ICreateChatConversation
    ): Promise<ICustomChatConversation> {
        return this.repository.createConversation(args);
    }
}

//------------------------------------------------------------------------------
export interface ICreateChatPrompt {
    prompt: IPrompt;
}

export class CreateChatPromptUseCase {
    constructor(private readonly repository: IChatPromptRepository) {}

    async execute(args: ICreateChatPrompt): Promise<IPrompt[]> {
        return this.repository.createPrompt(args);
    }
}
