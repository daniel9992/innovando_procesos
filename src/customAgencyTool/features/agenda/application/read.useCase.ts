import type { InterfaceClient } from '../domain/agendaModel';
import type { IAgendaRepository } from './IAgendaRepository';

export interface IReadAgenda {
    docId: string;
}

export class ReadAgendaUseCase {
    constructor(private readonly agendaRepository: IAgendaRepository) {}

    async execute(args: IReadAgenda): Promise<InterfaceClient> {
        return this.agendaRepository.readAgenda(args);
    }
}
