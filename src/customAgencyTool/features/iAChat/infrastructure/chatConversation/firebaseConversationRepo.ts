import { AddDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/create';
import { DelteDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/delete';
import { ReadDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/read';
import { UpdateDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/update';
import type { ICreateChatConversation } from '../../application/chatConversation/create.useCase';
import type { IDeleteChatConversation } from '../../application/chatConversation/delete.useCase';
import type { IReadChatConversationRepository } from '../../application/chatConversation/IChatConversationRepository';
import type { IReadChatConversation } from '../../application/chatConversation/read.useCase';
import type { IUpdateChatConversation } from '../../application/chatConversation/update.useCase';
import type { ICustomChatConversation } from '../../domain/customChat.model';

export class FirebaseChatConversationRepository
    implements IReadChatConversationRepository
{
    private static readonly CHAT_COLLECTION = 'chatConversationCollection';
    // private static readonly CHAT_BUCKET_PATH = '/chatConversationBucket/{uid}/{sIdcId}/{fileName}';

    public async readConversation(
        args: IReadChatConversation
    ): Promise<ICustomChatConversation> {
        try {
            const { conversationId } = args;

            const result = await ReadDocToSpecificCollection({
                collectionName:
                    FirebaseChatConversationRepository.CHAT_COLLECTION,
                id: conversationId
            });

            return result.result as ICustomChatConversation;
        } catch (error) {
            console.error(error);
            throw new Error('Error al leer el evento');
        }
    }

    public async updateConversation(
        args: IUpdateChatConversation
    ): Promise<ICustomChatConversation> {
        try {
            const { values } = args;
            const copyValues = { ...values };

            const result = await UpdateDocToSpecificCollection({
                collectionName:
                    FirebaseChatConversationRepository.CHAT_COLLECTION,
                id: values.id,
                values: copyValues
            });

            // Devuelve el objeto completo actualizado
            return result.result as ICustomChatConversation;
        } catch (error) {
            console.error(error);
            throw new Error('Error al actualizar el evento');
        }
    }

    public async deleteConversation(
        args: IDeleteChatConversation
    ): Promise<void> {
        try {
            const { values } = args;

            // 1. delete Order
            await DelteDocToSpecificCollection({
                collectionName:
                    FirebaseChatConversationRepository.CHAT_COLLECTION,
                id: values.id
            });
        } catch (error) {
            console.error(error);
            throw new Error('Error al eliminar el evento');
        }
    }

    public async createConversation(
        args: ICreateChatConversation
    ): Promise<ICustomChatConversation> {
        try {
            const { values } = args;

            const result = await AddDocToSpecificCollection({
                collectionName:
                    FirebaseChatConversationRepository.CHAT_COLLECTION,
                values: values
            });

            return result.result as ICustomChatConversation;
        } catch (error) {
            console.error(error);
            throw new Error('Error al crear el evento');
        }
    }
}
