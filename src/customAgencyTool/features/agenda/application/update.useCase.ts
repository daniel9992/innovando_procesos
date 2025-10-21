import type {
    InterfaceClient,
    InterfaceCustomerContact
} from '../domain/agendaModel';
import type { IAgendaRepository } from './IAgendaRepository';

export interface IUpdateAgenda {
    client: InterfaceClient;
    customerContacts?: Array<InterfaceCustomerContact>;
}

export class UpdateAgendaUseCase {
    constructor(private readonly agendaRepository: IAgendaRepository) {}

    async execute(args: IUpdateAgenda): Promise<InterfaceClient> {
        return this.agendaRepository.updateAgenda(args);
    }
}
