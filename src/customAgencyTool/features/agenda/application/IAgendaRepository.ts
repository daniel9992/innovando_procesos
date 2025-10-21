import type {
    InterfaceClient,
    InterfaceCustomerContact
} from '../domain/agendaModel';
import type { ICreateAgenda } from './create.useCase';
import type { IDeleteAgenda } from './delete.useCase';
import type { IDeleteCustomerContact } from './deleteCustomerContact.useCase';
import type { IReadAgenda } from './read.useCase';
import type { IReadCustomerContacts } from './readCustomer.useCase';
import type { IUpdateAgenda } from './update.useCase';

export interface IAgendaRepository {
    /**
     * @description Reads a Agenda.
     * @param {IReadAgenda} args - The arguments for the use case.
     * @returns {Promise<InterfaceClient>} - The Agenda.
     */
    readAgenda(args: IReadAgenda): Promise<InterfaceClient>;
    /**
     * @description Updates a Agenda.
     * @param {IUpdateAgenda} args - The arguments for the use case.
     * @returns {Promise<InterfaceClient>} - The Agenda.
     */
    updateAgenda(args: IUpdateAgenda): Promise<InterfaceClient>;
    /**
     * @description Deletes a Agenda.
     * @param {IDeleteAgenda} args - The arguments for the use case.
     * @returns {Promise<void>} - The Agenda.
     */
    deleteAgenda(args: IDeleteAgenda): Promise<void>;
    /**
     * @description Creates a Agenda.
     * @param {ICreateAgenda} args - The arguments for the use case.
     * @returns {Promise<InterfaceClient>} - The Agenda.
     */
    createAgenda(args: ICreateAgenda): Promise<InterfaceClient>;

    /**
     * @description Reads a CustomerContacts.
     * @param {IReadCustomerContacts} args - The arguments for the use case.
     * @returns {Promise<InterfaceCustomerContact[]>} - The CustomerContacts.
     */
    readCustomerContacts(
        args: IReadCustomerContacts
    ): Promise<InterfaceCustomerContact[]>;

    /**
     * @description Deletes a CustomerContact.
     * @param {IDeleteCustomerContact} args - The arguments for the use case.
     * @returns {Promise<void>} - The CustomerContact.
     */
    deleteCustomerContact(args: IDeleteCustomerContact): Promise<void>;
}
