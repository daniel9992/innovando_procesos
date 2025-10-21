import { db } from '@src/customAgencyTool/core';
import { ReadDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/read';
import { UpdateDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/update';
import type { InterfaceAppSetting } from '@src/customAgencyTool/features/settings/domain/modelFather';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import type { ICreateChatPrompt } from '../../application/chatConversation/create.useCase';
import type { IChatPromptRepository } from '../../application/chatConversation/IChatConversationRepository';
import type { IReadChatPrompts } from '../../application/chatConversation/read.useCase';
import type { IUpdateChatPrompt } from '../../application/chatConversation/update.useCase';
import type { IPrompt } from '../../domain/chatConfig.model';

interface IChatOnAppSettings extends InterfaceAppSetting {
    savePrompts: IPrompt[];
}

export class FirebaseChatPromptRepository implements IChatPromptRepository {
    private static readonly PROMPT_COLLECTION = 'appSettings';
    private static readonly PROMPT_ID = 'data-id-chatSettings';
    private promptSettings: IChatOnAppSettings;

    constructor() {
        this.promptSettings = {
            id: FirebaseChatPromptRepository.PROMPT_ID,
            type: 'chatSettings',
            savePrompts: []
        };
    }

    public async readPrompt(args: IReadChatPrompts): Promise<IPrompt[]> {
        try {
            const { action } = args;

            console.log('readPrompt', action);

            const result = await ReadDocToSpecificCollection({
                collectionName: FirebaseChatPromptRepository.PROMPT_COLLECTION,
                id: FirebaseChatPromptRepository.PROMPT_ID
            });

            const chatSettings = result.result as IChatOnAppSettings;
            this.promptSettings = chatSettings;

            if (chatSettings.savePrompts) {
                return chatSettings.savePrompts;
            }
            return [];
        } catch (error) {
            console.error(error);
            throw new Error('Error al leer el evento');
        }
    }

    public async updatePrompt(args: IUpdateChatPrompt): Promise<IPrompt[]> {
        try {
            const { values } = args;
            const copyValues = {
                ...this.promptSettings,
                savePrompts: values
            };

            await UpdateDocToSpecificCollection({
                collectionName: FirebaseChatPromptRepository.PROMPT_COLLECTION,
                id: FirebaseChatPromptRepository.PROMPT_ID,
                values: copyValues
            });
            return values;
        } catch (error) {
            console.error(error);
            throw new Error('Error al actualizar el evento');
        }
    }

    public async deletePrompt(args: IUpdateChatPrompt): Promise<IPrompt[]> {
        try {
            return this.updatePrompt(args);
        } catch (error) {
            console.error(error);
            throw new Error('Error al eliminar el evento');
        }
    }

    public async createPrompt(args: ICreateChatPrompt): Promise<IPrompt[]> {
        try {
            const { prompt } = args;
            // 1. read Prompt on DB
            const docRef = doc(
                db,
                FirebaseChatPromptRepository.PROMPT_COLLECTION,
                FirebaseChatPromptRepository.PROMPT_ID
            );

            // 2. read
            const docSnap = await getDoc(docRef);

            // 3. check if doc exists
            if (docSnap.exists()) {
                // 4. get data
                const data = {
                    id: docSnap.id,
                    ...docSnap.data()
                } as IChatOnAppSettings;

                const copyData = { ...data };

                copyData.savePrompts.unshift(prompt);

                // 4. update
                await updateDoc(docRef, {
                    savePrompts: copyData.savePrompts
                });

                // 5. set data on local
                this.promptSettings = copyData;

                return copyData.savePrompts;
            } else {
                // 4. create empty data
                const emptyData: IChatOnAppSettings = {
                    id: FirebaseChatPromptRepository.PROMPT_ID,
                    type: 'chatSettings',
                    savePrompts: [prompt]
                };
                // 5. set data on DB
                await setDoc(docRef, emptyData);

                // 6. set data on local
                this.promptSettings = emptyData;

                return [prompt];
            }
        } catch (error) {
            console.error(error);
            throw new Error('Error al crear el evento');
        }
    }
}
