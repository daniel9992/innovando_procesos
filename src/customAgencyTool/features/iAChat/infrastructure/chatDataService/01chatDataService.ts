// src/features/chat/infrastructure/ChatDataService.ts
import { db } from '@src/customAgencyTool/core/services/firebase.server';
import { AddDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/create';
import { DelteDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/delete';
import { ReadDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/read';
import { UpdateDocToSpecificCollection } from '@src/customAgencyTool/features/crud/action/update';
import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import {
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
    writeBatch
} from 'firebase/firestore';
import type { ICreateChatConversation } from '../../application/chatConversation/create.useCase';
import type { IDeleteChatConversation } from '../../application/chatConversation/delete.useCase';
import type { IReadChatConversation } from '../../application/chatConversation/read.useCase';
import type { IUpdateChatConversation } from '../../application/chatConversation/update.useCase';
import type { ICreateChatSession } from '../../application/chatSession/create.useCase';
import type { IReadChatSession } from '../../application/chatSession/read.useCase';
import type {
    ICustomChatConversation,
    ICustomChatSession
} from '../../domain/customChat.model';

export class ChatDataService {
    private static readonly SESSION_COLLECTION = 'chatSessionCollection';
    private static readonly CONVERSATION_COLLECTION =
        'chatConversationCollection';

    // --- Métodos de Sesión ---

    public async createSession(
        args: ICreateChatSession
    ): Promise<ICustomChatSession> {
        try {
            const { values } = args;

            const result = await AddDocToSpecificCollection({
                collectionName: ChatDataService.SESSION_COLLECTION,
                values: values
            });

            return result.result as ICustomChatSession;
        } catch (error) {
            console.error(error);
            throw new Error('Error al crear sesión');
        }
    }

    public async readSession(
        args: IReadChatSession
    ): Promise<ICustomChatSession | null> {
        try {
            const { sessionId } = args;

            const result = await ReadDocToSpecificCollection({
                collectionName: ChatDataService.SESSION_COLLECTION,
                id: sessionId
            });

            return result.result as ICustomChatSession;
        } catch (error) {
            console.error(error);
            throw new Error('Error al leer sesión');
        }
    }

    public async updateSession(
        id: string,
        values: Partial<ICustomChatSession>
    ): Promise<void> {
        try {
            const docRef = doc(db, ChatDataService.SESSION_COLLECTION, id);
            await updateDoc(docRef, values);
        } catch (error) {
            console.error(error);
            throw new Error('Error al actualizar sesión');
        }
    }

    public async deleteSession(sessionId: string): Promise<void> {
        const batch = writeBatch(db);

        // 1. Marcar la sesión principal para ser borrada
        const sessionRef = doc(
            db,
            ChatDataService.SESSION_COLLECTION,
            sessionId
        );
        batch.delete(sessionRef);

        // 2. Encontrar y marcar todas las conversaciones asociadas para ser borradas
        const conversationsQuery = query(
            collection(db, ChatDataService.CONVERSATION_COLLECTION),
            where('sessionToBelongsTo', '==', sessionId)
        );
        const querySnapshot = await getDocs(conversationsQuery);
        querySnapshot.forEach((docSnap) => {
            batch.delete(docSnap.ref);
        });

        // 3. Ejecutar todas las operaciones de borrado en una sola transacción
        await batch.commit();
    }

    // --- Métodos de Conversación ---
    public async createConversation(
        args: ICreateChatConversation
    ): Promise<ICustomChatConversation> {
        try {
            const { values } = args;

            // 1. Actualizar la fecha de la sesión padre
            await this.updateSession(values.sessionToBelongsTo, {
                updatedAt: GetToday()
            });

            // 2. Crear la nueva conversación
            const result = await AddDocToSpecificCollection({
                collectionName: ChatDataService.CONVERSATION_COLLECTION,
                values: values
            });

            return result.result as ICustomChatConversation;
        } catch (error) {
            console.error(error);
            throw new Error('Error al crear conversación');
        }
    }

    public async readConversation(
        args: IReadChatConversation
    ): Promise<ICustomChatConversation> {
        try {
            const { conversationId } = args;

            const result = await ReadDocToSpecificCollection({
                collectionName: ChatDataService.CONVERSATION_COLLECTION,
                id: conversationId
            });

            return result.result as ICustomChatConversation;
        } catch (error) {
            console.error(error);
            throw new Error('Error al leer conversación');
        }
    }

    public async updateConversation(
        args: IUpdateChatConversation
    ): Promise<ICustomChatConversation> {
        try {
            const { values } = args;
            const copyValues = { ...values };

            const result = await UpdateDocToSpecificCollection({
                collectionName: ChatDataService.CONVERSATION_COLLECTION,
                id: values.id,
                values: copyValues
            });

            // Devuelve el objeto completo actualizado
            return result.result as ICustomChatConversation;
        } catch (error) {
            console.error(error);
            throw new Error('Error al actualizar conversación');
        }
    }

    public async deleteConversation(
        args: IDeleteChatConversation
    ): Promise<void> {
        try {
            const { values } = args;

            // 1. delete Order
            await DelteDocToSpecificCollection({
                collectionName: ChatDataService.CONVERSATION_COLLECTION,
                id: values.id
            });
        } catch (error) {
            console.error(error);
            throw new Error('Error al eliminar conversación');
        }
    }
}
