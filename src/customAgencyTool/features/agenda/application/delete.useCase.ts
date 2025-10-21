import type { InterfaceClient } from '../domain/agendaModel';
import type { IAgendaRepository } from './IAgendaRepository';

export interface IDeleteAgenda {
    values: InterfaceClient;
}

export class DeleteAgendaUseCase {
    constructor(private readonly agendaRepository: IAgendaRepository) {}

    async execute(args: IDeleteAgenda): Promise<void> {
        return this.agendaRepository.deleteAgenda(args);
    }
}
