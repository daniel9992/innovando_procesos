import type { InterfaceCalendarEvent } from '../domain/calendarEvent.entity';
import type { ICalendarRepository } from './ICalendarRepository';

export interface IUpdateCalendar {
    event: InterfaceCalendarEvent;
}

export class UpdateCalendarUseCase {
    // Inyección de Dependencias: Recibimos el repositorio vía constructor
    constructor(
        private readonly calendarRepository: ICalendarRepository
    ) {}

    execute(args: IUpdateCalendar): Promise<InterfaceCalendarEvent> {
        return this.calendarRepository.updateEvent(args);
    }
}
