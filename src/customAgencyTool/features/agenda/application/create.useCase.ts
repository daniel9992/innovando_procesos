import type { InterfaceClient } from '../domain/agendaModel';
import type { IAgendaRepository } from './IAgendaRepository';

export interface ICreateAgenda {
    client: InterfaceClient;
}

export class CreateAgendaUseCase {
    constructor(private readonly agendaRepository: IAgendaRepository) {}

    async execute(args: ICreateAgenda): Promise<InterfaceClient> {
        return this.agendaRepository.createAgenda(args);
    }
}
