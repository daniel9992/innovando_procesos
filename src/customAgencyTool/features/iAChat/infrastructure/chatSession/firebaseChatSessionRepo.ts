import { AddDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/create';
import { DelteDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/delete';
import { ReadDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/read';
import { UpdateDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/update';
import type { ICreateChatSession } from '../../application/chatSession/create.useCase';
import type { IDeleteChatSession } from '../../application/chatSession/delete.useCase';
import type { IReadChatSessionRepository } from '../../application/chatSession/IChatSessionRepository';
import type { IReadChatSession } from '../../application/chatSession/read.useCase';
import type { IUpdateChatSession } from '../../application/chatSession/update.useCase';
import type { ICustomChatSession } from '../../domain/customChat.model';

export class FirebaseChatSessionRepository
    implements IReadChatSessionRepository
{
    private static readonly CHAT_COLLECTION = 'chatSessionCollection';
    // private static readonly CHAT_BUCKET_PATH = 'chatSessionBucket';

    public async readSession(
        args: IReadChatSession
    ): Promise<ICustomChatSession> {
        try {
            const { sessionId } = args;

            const result = await ReadDocToSpecificCollection({
                collectionName: FirebaseChatSessionRepository.CHAT_COLLECTION,
                id: sessionId
            });

            return result.result as ICustomChatSession;
        } catch (error) {
            console.error(error);
            throw new Error('Error al leer el evento');
        }
    }

    public async updateSession(
        args: IUpdateChatSession
    ): Promise<ICustomChatSession> {
        try {
            const { values } = args;
            const copyValues = { ...values };

            const result = await UpdateDocToSpecificCollection({
                collectionName: FirebaseChatSessionRepository.CHAT_COLLECTION,
                id: values.id,
                values: copyValues
            });

            // Devuelve el objeto completo actualizado
            return result.result as ICustomChatSession;
        } catch (error) {
            console.error(error);
            throw new Error('Error al actualizar el evento');
        }
    }

    public async deleteSession(args: IDeleteChatSession): Promise<void> {
        try {
            const { values } = args;

            // 1. delete Order
            await DelteDocToSpecificCollection({
                collectionName: FirebaseChatSessionRepository.CHAT_COLLECTION,
                id: values.id
            });
        } catch (error) {
            console.error(error);
            throw new Error('Error al eliminar el evento');
        }
    }

    public async createSession(
        args: ICreateChatSession
    ): Promise<ICustomChatSession> {
        try {
            const { values } = args;

            const result = await AddDocToSpecificCollection({
                collectionName: FirebaseChatSessionRepository.CHAT_COLLECTION,
                values: values
            });

            return result.result as ICustomChatSession;
        } catch (error) {
            console.error(error);
            throw new Error('Error al crear el evento');
        }
    }
}
