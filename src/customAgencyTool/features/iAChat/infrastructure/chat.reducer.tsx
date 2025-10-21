import { type SerializedError } from '@reduxjs/toolkit';
import { createAppSlice } from '@src/customAgencyTool/app/createAppSlice';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import type { NotificationUpdatePayload } from '@src/customAgencyTool/context/toastAppNotification/notyModel';

import type {
    ICreateChatConversation,
    ICreateChatPrompt
} from '../application/chatConversation/create.useCase';
import type {
    IDeleteChatConversation,
    IDeleteChatPrompt
} from '../application/chatConversation/delete.useCase';
import type {
    IReadChatConversation,
    IReadChatPrompts
} from '../application/chatConversation/read.useCase';
import type {
    IUpdateChatConversation,
    IUpdateChatPrompt
} from '../application/chatConversation/update.useCase';
import type { ICreateChatSession } from '../application/chatSession/create.useCase';
import type { IDeleteChatSession } from '../application/chatSession/delete.useCase';
import type { IReadChatSession } from '../application/chatSession/read.useCase';
import type { IUpdateChatSession } from '../application/chatSession/update.useCase';
import type { IPrompt } from '../domain/chatConfig.model';
import type {
    ICustomChatConversation,
    ICustomChatSession
} from '../domain/customChat.model';
import {
    chatConversationCreateUseCase,
    chatConversationDeleteUseCase,
    chatConversationReadUseCase,
    chatConversationUpdateUseCase,
    chatCreateUseCase,
    chatDeleteUseCase,
    chatPromptCreateUseCase,
    chatPromptDeleteUseCase,
    chatPromptReadUseCase,
    chatPromptUpdateUseCase,
    chatReadUseCase,
    chatUpdateUseCase
} from './compositionRoot';

interface InterfaceOrderTrackingSliceState {
    chatSession?: ICustomChatSession;
    chatSessions?: ICustomChatSession[];
    chatConversation?: ICustomChatConversation;
    chatConversations?: ICustomChatConversation[];

    chatPrompts?: IPrompt[];

    statusSession: ReduxStatus;
    statusConversation: ReduxStatus;
    statusPrompt: ReduxStatus;

    error?: SerializedError | Error;
    notification?: NotificationUpdatePayload;
}

export const initialState: InterfaceOrderTrackingSliceState = {
    statusSession: ReduxStatus.INIT,
    statusConversation: ReduxStatus.INIT,
    statusPrompt: ReduxStatus.INIT
};

const getInitialState = () => {
    return initialState;
};

export const iaChatSlice = createAppSlice({
    name: 'iaChat',
    initialState: getInitialState(),
    reducers: (create) => ({
        /**
         * ? ---------------------------------------
         *  !   Chat Session
         * ? ---------------------------------------
         */
        createSession: create.asyncThunk(
            async (args: ICreateChatSession) => {
                const event = await chatCreateUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusSession = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.statusSession = ReduxStatus.SUCCESS;
                    state.chatSession = action.payload as ICustomChatSession;
                },
                rejected: (state, action) => {
                    state.statusSession = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        updateSession: create.asyncThunk(
            async (args: IUpdateChatSession) => {
                const event = await chatUpdateUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusSession = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.statusSession = ReduxStatus.SUCCESS;
                    state.chatSession = action.payload as ICustomChatSession;
                },
                rejected: (state, action) => {
                    state.statusSession = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        deleteSession: create.asyncThunk(
            async (args: IDeleteChatSession) => {
                const event = await chatDeleteUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusSession = ReduxStatus.LOADING;
                },
                fulfilled: (state) => {
                    state.statusSession = ReduxStatus.SUCCESS;
                    // console.log('fulfilled', action);
                },
                rejected: (state, action) => {
                    state.statusSession = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        readSession: create.asyncThunk(
            async (args: IReadChatSession) => {
                const event = await chatReadUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusSession = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.statusSession = ReduxStatus.SUCCESS;
                    state.chatSession = action.payload;
                },
                rejected: (state, action) => {
                    state.statusSession = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        /**
         * ? ---------------------------------------
         *  !   Chat Conversation
         * ? ---------------------------------------
         */
        createConversation: create.asyncThunk(
            async (args: ICreateChatConversation) => {
                const event = await chatConversationCreateUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusConversation = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.statusConversation = ReduxStatus.SUCCESS;
                    state.chatConversation =
                        action.payload as ICustomChatConversation;
                },
                rejected: (state, action) => {
                    state.statusConversation = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        updateConversation: create.asyncThunk(
            async (args: IUpdateChatConversation) => {
                const event = await chatConversationUpdateUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusConversation = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.statusConversation = ReduxStatus.SUCCESS;
                    state.chatConversation =
                        action.payload as ICustomChatConversation;
                },
                rejected: (state, action) => {
                    state.statusConversation = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        deleteConversation: create.asyncThunk(
            async (args: IDeleteChatConversation) => {
                const event = await chatConversationDeleteUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusConversation = ReduxStatus.LOADING;
                },
                fulfilled: (state) => {
                    state.statusConversation = ReduxStatus.SUCCESS;
                    // console.log('fulfilled', action);
                },
                rejected: (state, action) => {
                    state.statusConversation = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        readConversation: create.asyncThunk(
            async (args: IReadChatConversation) => {
                const event = await chatConversationReadUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusConversation = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.statusConversation = ReduxStatus.SUCCESS;
                    state.chatConversation = action.payload;
                },
                rejected: (state, action) => {
                    state.statusConversation = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        /**
         * ? ---------------------------------------
         *  !   Save Prompts
         * ? ---------------------------------------
         */
        createPrompt: create.asyncThunk(
            async (args: ICreateChatPrompt) => {
                const event = await chatPromptCreateUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusPrompt = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.statusPrompt = ReduxStatus.SUCCESS;
                    state.chatPrompts = action.payload;
                },
                rejected: (state, action) => {
                    state.statusPrompt = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        updatePrompt: create.asyncThunk(
            async (args: IUpdateChatPrompt) => {
                const event = await chatPromptUpdateUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusPrompt = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.statusPrompt = ReduxStatus.SUCCESS;
                    state.chatPrompts = action.payload;
                },
                rejected: (state, action) => {
                    state.statusPrompt = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        deletePrompt: create.asyncThunk(
            async (args: IDeleteChatPrompt) => {
                const event = await chatPromptDeleteUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusPrompt = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.statusPrompt = ReduxStatus.SUCCESS;
                    state.chatPrompts = action.payload;
                },
                rejected: (state, action) => {
                    state.statusPrompt = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        readPrompt: create.asyncThunk(
            async (args: IReadChatPrompts) => {
                const event = await chatPromptReadUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.statusPrompt = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.statusPrompt = ReduxStatus.SUCCESS;
                    state.chatPrompts = action.payload;
                },
                rejected: (state, action) => {
                    state.statusPrompt = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        )
    }),
    selectors: {
        selectChatSession: (sts) => sts.chatSession,
        selectChatSessions: (sts) => sts.chatSessions,
        selectChatConversation: (sts) => sts.chatConversation,
        selectChatConversations: (sts) => sts.chatConversations,
        selectChatPrompts: (sts) => sts.chatPrompts,

        selectStatusSession: (sts) => sts.statusSession,
        selectStatusConversation: (sts) => sts.statusConversation,
        selectStatusPrompt: (sts) => sts.statusPrompt,

        selectNotification: (bls) => bls.notification,
        selectError: (bls) => bls.error
    }
});

export const {
    //
    createSession,
    updateSession,
    deleteSession,
    readSession,

    createConversation,
    updateConversation,
    deleteConversation,
    readConversation,

    createPrompt,
    updatePrompt,
    deletePrompt,
    readPrompt
} = iaChatSlice.actions;

export const {
    //
    selectChatSession,
    selectChatSessions,
    selectChatConversation,
    selectChatConversations,
    selectChatPrompts,
    selectStatusSession,
    selectStatusConversation,
    selectStatusPrompt,

    selectNotification,
    selectError
} = iaChatSlice.selectors;
