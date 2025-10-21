import { model } from '@src/customAgencyTool/core/services/firebase.server';
import {
    CreateChatConversationUseCase,
    CreateChatPromptUseCase
} from '../application/chatConversation/create.useCase';
import {
    DeleteChatConversationUseCase,
    DeleteChatPromptUseCase
} from '../application/chatConversation/delete.useCase';
import {
    ReadChatConversationUseCase,
    ReadChatPromptsUseCase
} from '../application/chatConversation/read.useCase';
import {
    UpdateChatConversationUseCase,
    UpdateChatPromptUseCase
} from '../application/chatConversation/update.useCase';
import { CreateChatSessionUseCase } from '../application/chatSession/create.useCase';
import { DeleteChatSessionUseCase } from '../application/chatSession/delete.useCase';
import { ReadChatSessionUseCase } from '../application/chatSession/read.useCase';
import { UpdateChatSessionUseCase } from '../application/chatSession/update.useCase';
import { FirebaseChatConversationObsRepository } from './chatConversation/firebaseChatConversationObsRepo';
import { FirebaseChatConversationRepository } from './chatConversation/firebaseConversationRepo';
import { FirebaseChatPromptRepository } from './chatConversation/firebasePromptRepo';
import { ChatStreamManager } from './chatGenerativeModel/chatStreamManager';
import { ContentGeneratorStreamManager } from './chatGenerativeModel/contentGeneratorStreamManager';
import { FirebaseChatSessionObsRepository } from './chatSession/firebaseChatSessionObsRepo';
import { FirebaseChatSessionRepository } from './chatSession/firebaseChatSessionRepo';

// --- Chat Repository
const chatSessionRepository = new FirebaseChatSessionRepository();

// --- Chat Session
export const chatSessionObsRepository = new FirebaseChatSessionObsRepository();

export const chatCreateUseCase = new CreateChatSessionUseCase(
    chatSessionRepository
);
export const chatReadUseCase = new ReadChatSessionUseCase(
    chatSessionRepository
);
export const chatUpdateUseCase = new UpdateChatSessionUseCase(
    chatSessionRepository
);
export const chatDeleteUseCase = new DeleteChatSessionUseCase(
    chatSessionRepository
);

// --- Chat Conversation
const chatConversationRepository = new FirebaseChatConversationRepository();

export const chatConversationObsRepository =
    new FirebaseChatConversationObsRepository();

export const chatConversationCreateUseCase = new CreateChatConversationUseCase(
    chatConversationRepository
);
export const chatConversationReadUseCase = new ReadChatConversationUseCase(
    chatConversationRepository
);
export const chatConversationUpdateUseCase = new UpdateChatConversationUseCase(
    chatConversationRepository
);
export const chatConversationDeleteUseCase = new DeleteChatConversationUseCase(
    chatConversationRepository
);

// --- Chat Prompt
export const chatPromptRepository = new FirebaseChatPromptRepository();

export const chatPromptReadUseCase = new ReadChatPromptsUseCase(
    chatPromptRepository
);

export const chatPromptCreateUseCase = new CreateChatPromptUseCase(
    chatPromptRepository
);
export const chatPromptUpdateUseCase = new UpdateChatPromptUseCase(
    chatPromptRepository
);
export const chatPromptDeleteUseCase = new DeleteChatPromptUseCase(
    chatPromptRepository
);

// -- Content Generator Stream Manager
export const contentGeneratorStreamManager = new ContentGeneratorStreamManager(
    model
);

// -- Chat Stream Manager
export const chatStreamManager = new ChatStreamManager(model);

/*
// -- Composit Dessign Pattern
interface ChatComponent {
    getName(): string;
    getType(): string;
}

class SessionBaseChatComponent {
    private typeChat = 'Session';
    constructor(private readonly name: string) {}

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return this.typeChat;
    }
}
class ConversationBaseChatComponent {
    private typeChat = 'Conversation';
    constructor(private readonly name: string) {}

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return this.typeChat;
    }
}
class ModelaseChatComponent {
    private typeChat = 'Model';
    private someExtraStr: string = '';
    constructor(private readonly name: string) {}

    public setExtraStr(extra: string) {
        this.someExtraStr = extra;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return this.typeChat + this.someExtraStr !== ''
            ? ` ${this.someExtraStr}`
            : '';
    }
}

class ChatFactory {
    public static createSession(name: string): ChatComponent {
        return new SessionBaseChatComponent(name);
    }

    public static createConversation(name: string): ChatComponent {
        return new ConversationBaseChatComponent(name);
    }

    public static createModel(name: string): ChatComponent {
        return new ModelaseChatComponent(name);
    }
}

class ChatComposite {
    private components: ChatComponent[] = [];

    public addComponent(component: ChatComponent): void {
        this.components.push(component);
    }

    public getDescription(): string {
        return this.components
            .map(
                (component) => `${component.getType()}: ${component.getName()}`
            )
            .join('\n');
    }
}

// Uso
const chatComposite = new ChatComposite();
// chatComposite.addComponent(ChatFactory.createSession('Some Session Name'));
// chatComposite.addComponent(ChatFactory.createConversation('Some Conversation Name'));
// chatComposite.addComponent(ChatFactory.createModel('Some Model Name'));

const session = new SessionBaseChatComponent('Some session name');
const conversation = new ConversationBaseChatComponent(
    'Some conversation name'
);
const modelx = new ModelaseChatComponent('Some Chat Model Name');
modelx.setExtraStr('some extra config');

chatComposite.addComponent(session);
chatComposite.addComponent(conversation);
chatComposite.addComponent(modelx);

console.log(chatComposite.getDescription());

// https://refactoring.guru/design-patterns/composite
*/
