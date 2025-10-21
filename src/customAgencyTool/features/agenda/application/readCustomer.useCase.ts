import type { InterfaceCustomerContact } from '../domain/agendaModel';
import type { IAgendaRepository } from './IAgendaRepository';

export interface IReadCustomerContacts {
    idBelongsToClient: string;
}

export class ReadCustomerContactsUseCase {
    constructor(private readonly agendaRepository: IAgendaRepository) {}

    async execute(
        args: IReadCustomerContacts
    ): Promise<InterfaceCustomerContact[]> {
        return this.agendaRepository.readCustomerContacts(args);
    }
}
