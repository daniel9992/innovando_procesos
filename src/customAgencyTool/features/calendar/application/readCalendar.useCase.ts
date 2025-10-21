import type { InterfaceCalendarEvent } from '../domain/calendarEvent.entity';
import type { ICalendarRepository } from './ICalendarRepository';

export interface IReadCalendar {
    eventID: string;
}

/**
 * @class ReadCalendarUseCase
 * @description Caso de uso para suscribirse a las actualizaciones en tiempo real de los eventos del calendario.
 */
export class ReadCalendarUseCase {
    /**
     * @param {ICalendarRepository} calendarRepository - El repositorio que implementa la lógica de acceso a datos.
     */
    constructor(
        private readonly calendarRepository: ICalendarRepository
    ) {}

    async execute(args: IReadCalendar): Promise<InterfaceCalendarEvent> {
        return this.calendarRepository.readCalendar(args);
    }
}
