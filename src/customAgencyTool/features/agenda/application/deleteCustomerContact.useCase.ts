import type { InterfaceCustomerContact } from '../domain/agendaModel';
import type { IAgendaRepository } from './IAgendaRepository';

export interface IDeleteCustomerContact {
    values: InterfaceCustomerContact;
}

export class DeleteCustomerContactUseCase {
    constructor(private readonly agendaRepository: IAgendaRepository) {}

    async execute(args: IDeleteCustomerContact): Promise<void> {
        return this.agendaRepository.deleteCustomerContact(args);
    }
}
