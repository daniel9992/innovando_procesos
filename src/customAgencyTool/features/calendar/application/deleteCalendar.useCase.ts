import type { InterfaceCalendarEvent } from '../domain/calendarEvent.entity';
import type { ICalendarRepository } from './ICalendarRepository';

export interface IDeleteCalendar {
    event: InterfaceCalendarEvent;
}

export class DeleteCalendarUseCase {
    // Inyección de Dependencias: Recibimos el repositorio vía constructor
    constructor(
        private readonly calendarRepository: ICalendarRepository
    ) {}

    async execute(data: IDeleteCalendar): Promise<void> {
        // Delegamos la responsabilidad de la persistencia al repositorio
        await this.calendarRepository.deleteEvent(data);
    }
}
