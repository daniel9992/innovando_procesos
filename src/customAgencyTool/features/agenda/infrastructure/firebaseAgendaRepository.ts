import { db } from '@src/customAgencyTool/core';
import { adapterDate } from '@src/customAgencyTool/utils/adapter';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    limit,
    query,
    updateDoc,
    where,
    type CollectionReference,
    type DocumentReference
} from 'firebase/firestore';

import { AddDocToSpecificCollection } from '../../crud/action/create';
import { DelteDocToSpecificCollection } from '../../crud/action/delete';
import type { InterfaceDocReturn } from '../../crud/action/iCrud';
import { UpdateDocToSpecificCollection } from '../../crud/action/update';
import type { ICreateAgenda } from '../application/create.useCase';
import type { IDeleteAgenda } from '../application/delete.useCase';
import type { IDeleteCustomerContact } from '../application/deleteCustomerContact.useCase';
import type { IAgendaRepository } from '../application/IAgendaRepository';
import type { IReadAgenda } from '../application/read.useCase';
import type { IReadCustomerContacts } from '../application/readCustomer.useCase';
import type { IUpdateAgenda } from '../application/update.useCase';
import type {
    InterfaceClient,
    InterfaceCustomerContact
} from '../domain/agendaModel';

// Custom error classes
class AgendaError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AgendaError';
    }
}

class DocumentNotFoundError extends AgendaError {
    constructor(docId: string) {
        super(`Document with ID ${docId} not found`);
        this.name = 'DocumentNotFoundError';
    }
}

class ValidationError extends AgendaError {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

/**
 * Repository implementation for Firebase Agenda operations
 */
export class FirebaseAgendaRepository implements IAgendaRepository {
    private static readonly COLLECTION_NAME = 'clientCollection';
    private static readonly CUSTOMER_CONTACT_COLLECTION_NAME =
        'customerContactCollection';
    private readonly collectionRef: CollectionReference;
    private readonly customerContactCollectionRef: CollectionReference;

    constructor() {
        this.collectionRef = collection(
            db,
            FirebaseAgendaRepository.COLLECTION_NAME
        );
        this.customerContactCollectionRef = collection(
            db,
            FirebaseAgendaRepository.CUSTOMER_CONTACT_COLLECTION_NAME
        );
    }

    /**
     * Creates a document reference for a given ID
     */
    private getDocumentRef(docId: string): DocumentReference {
        return doc(this.collectionRef, docId);
    }

    /**
     * Validates if a document ID exists
     */
    private validateDocId(docId?: string): void {
        if (!docId) {
            throw new ValidationError('Document ID is required');
        }
    }

    /**
     * Processes the document data with common transformations
     */
    private processDocumentData(
        data: Record<string, unknown>,
        docId: string
    ): InterfaceClient {
        return adapterDate({
            ...data,
            id: docId
        }) as InterfaceClient;
    }

    private processCustomerDocumentData(
        data: Record<string, unknown>,
        docId: string
    ): InterfaceCustomerContact {
        return adapterDate({
            ...data,
            id: docId
        }) as InterfaceCustomerContact;
    }

    /**
     * Reads an Agenda document by ID
     */
    async readAgenda({ docId }: IReadAgenda): Promise<InterfaceClient> {
        try {
            this.validateDocId(docId);

            const docRef = this.getDocumentRef(docId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new DocumentNotFoundError(docId);
            }

            const contacts: InterfaceCustomerContact[] =
                await this.readCustomerContacts({
                    idBelongsToClient: docSnap.id
                });

            const data = this.processDocumentData(docSnap.data(), docSnap.id);

            data.customerContact = contacts;

            return data;
        } catch (error) {
            if (error instanceof AgendaError) {
                throw error;
            }
            throw new AgendaError(`Error reading agenda: ${error}`);
        }
    }
    /**
     * Reads a CustomerContacts.
     */
    async readCustomerContacts({
        idBelongsToClient
    }: IReadCustomerContacts): Promise<InterfaceCustomerContact[]> {
        try {
            this.validateDocId(idBelongsToClient);

            const limitperPage = 10;

            const docRef = collection(
                db,
                FirebaseAgendaRepository.CUSTOMER_CONTACT_COLLECTION_NAME
            );

            const q = query(
                docRef,
                where('idBelongsToClient', '==', idBelongsToClient),
                limit(limitperPage)
            );
            const querySnapshot = await getDocs(q);

            const customerContacts: InterfaceCustomerContact[] = [];
            querySnapshot.forEach((doc) => {
                customerContacts.push(
                    this.processCustomerDocumentData(doc.data(), doc.id)
                );
            });

            return customerContacts;
        } catch (error) {
            if (error instanceof AgendaError) {
                throw error;
            }
            throw new AgendaError(`Error reading customer contacts: ${error}`);
        }
    }
    /**
     * Deletes an CustomerContact document
     */
    async deleteCustomerContact({
        values
    }: IDeleteCustomerContact): Promise<void> {
        try {
            this.validateDocId(values.id);

            // delete from customerContactCollection
            const docRef = doc(this.customerContactCollectionRef, values.id);

            await deleteDoc(docRef);
        } catch (error) {
            if (error instanceof AgendaError) {
                throw error;
            }
            throw new AgendaError(`Error deleting customer contact: ${error}`);
        }
    }
    /**
     * Updates an existing Agenda document
     */
    async updateAgenda({
        client,
        customerContacts
    }: IUpdateAgenda): Promise<InterfaceClient> {
        try {
            this.validateDocId(client.id);

            const copyClient = { ...client };

            // 1. Get customer contacts
            const customerContactsLocal = [...client.customerContact];
            const oldCustomerContacts = customerContacts ?? [];

            // 2. Remove customer contacts from client
            copyClient.customerContact = [];

            // 3. Update client
            const docRef = this.getDocumentRef(copyClient.id);
            await updateDoc(docRef, copyClient);

            // 4 Crear Sets con los IDs de cada lista para búsquedas ultra rápidas.
            const oldIds = new Set(oldCustomerContacts.map((item) => item.id));
            const currentIds = new Set(
                customerContactsLocal.map((item) => item.id)
            );

            // 5. Elementos a CREAR: Están en la nueva lista pero no en la antigua.
            const toCreate = customerContactsLocal.filter(
                (item) => !oldIds.has(item.id)
            );

            // 6. Elementos a ACTUALIZAR: Están en AMBAS listas.
            const toUpdate = customerContactsLocal.filter((item) =>
                oldIds.has(item.id)
            );

            // 7. Elementos a BORRAR: Están en la lista antigua pero ya NO en la nueva.
            const toDelete = oldCustomerContacts.filter(
                (item) => !currentIds.has(item.id)
            );

            const toSavePromises: Promise<InterfaceDocReturn>[] = [];
            const idBelongsToClient = copyClient.id;

            // 8. Crear nuevos
            toCreate.forEach((customerContact) => {
                const copyCustomerContact = { ...customerContact };
                copyCustomerContact.id = '';
                copyCustomerContact.idBelongsToClient = idBelongsToClient;
                const toSavePromise = AddDocToSpecificCollection({
                    collectionName:
                        FirebaseAgendaRepository.CUSTOMER_CONTACT_COLLECTION_NAME,
                    values: copyCustomerContact
                });
                toSavePromises.push(toSavePromise);
            });

            // 9. Actualizar
            toUpdate.forEach((customerContact) => {
                const copyCustomerContact = { ...customerContact };
                copyCustomerContact.idBelongsToClient = idBelongsToClient;
                const toSavePromise = UpdateDocToSpecificCollection({
                    collectionName:
                        FirebaseAgendaRepository.CUSTOMER_CONTACT_COLLECTION_NAME,
                    id: customerContact.id,
                    values: copyCustomerContact
                });
                toSavePromises.push(toSavePromise);
            });

            // 10. Borrar
            toDelete.forEach((customerContact) => {
                const toSavePromise = DelteDocToSpecificCollection({
                    collectionName:
                        FirebaseAgendaRepository.CUSTOMER_CONTACT_COLLECTION_NAME,
                    id: customerContact.id
                });
                toSavePromises.push(toSavePromise);
            });

            // 11. Save all
            await Promise.all(toSavePromises);

            // 12. Return client
            return client;
        } catch (error) {
            if (error instanceof AgendaError) {
                throw error;
            }
            throw new AgendaError(`Error updating agenda: ${error}`);
        }
    }

    /**
     * Deletes an Agenda document
     */
    async deleteAgenda({ values }: IDeleteAgenda): Promise<void> {
        try {
            const docId = values.id;
            this.validateDocId(docId);

            // step 0 get customer contacts
            const contactsToDelete: InterfaceCustomerContact[] = [];
            if (values.customerContact.length === 0) {
                const customerContacts = await this.readCustomerContacts({
                    idBelongsToClient: docId
                });
                contactsToDelete.push(...customerContacts);
            }

            // step 1 delete customer contacts
            contactsToDelete.forEach((customerContact) => {
                this.deleteCustomerContact({
                    values: customerContact
                });
            });

            // step 2 delete agenda
            const docRef = this.getDocumentRef(docId);
            await deleteDoc(docRef);
        } catch (error) {
            if (error instanceof AgendaError) {
                throw error;
            }
            throw new AgendaError(`Error deleting agenda: ${error}`);
        }
    }

    /**
     * Creates a new Agenda document
     */
    async createAgenda({ client }: ICreateAgenda): Promise<InterfaceClient> {
        try {
            const copyClient = { ...client };
            // 1. Get customer contacts
            const customerContacts = [...client.customerContact];
            // 2. Remove customer contacts from client
            copyClient.customerContact = [];

            // 3. Create client
            const docRef = await addDoc(this.collectionRef, copyClient);
            const updatedClient = { ...copyClient, id: docRef.id };
            await updateDoc(docRef, { id: docRef.id });

            // 4. Create customer contacts
            const idBelongsToClient = docRef.id;
            const toSavePromises = customerContacts.map(
                async (customerContact) => {
                    const copyCustomerContact = { ...customerContact };
                    if (copyCustomerContact.id.startsWith('new-')) {
                        copyCustomerContact.id = '';
                    }
                    copyCustomerContact.idBelongsToClient = idBelongsToClient;
                    return AddDocToSpecificCollection({
                        collectionName:
                            FirebaseAgendaRepository.CUSTOMER_CONTACT_COLLECTION_NAME,
                        values: copyCustomerContact
                    });
                }
            );

            // 5. Save all
            await Promise.all(toSavePromises);

            // 6. Return client
            return updatedClient;
        } catch (error) {
            throw new AgendaError(`Error creating agenda: ${error}`);
        }
    }
}

// Type guards
export const isAgendaError = (error: unknown): error is AgendaError => {
    return error instanceof AgendaError;
};

// Constants for error messages
export const ERROR_MESSAGES = {
    DOCUMENT_NOT_FOUND: 'Document not found',
    ID_REQUIRED: 'Document ID is required',
    CREATION_FAILED: 'Failed to create document',
    UPDATE_FAILED: 'Failed to update document',
    DELETE_FAILED: 'Failed to delete document'
} as const;
