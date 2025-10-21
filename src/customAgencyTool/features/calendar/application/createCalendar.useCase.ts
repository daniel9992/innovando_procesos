import type { InterfaceCalendarEvent } from '../domain/calendarEvent.entity';
import type { ICalendarRepository } from './ICalendarRepository';

export interface ICreateCalendar {
    event: InterfaceCalendarEvent;
}

export class CreateCalendarUseCase {
    // Inyección de Dependencias: Recibimos el repositorio vía constructor
    constructor(private readonly calendarRepository: ICalendarRepository) {}

    execute(args: ICreateCalendar): Promise<InterfaceCalendarEvent> {
        // Desarrollar el string[] de searchTerms
        // se utiliza los datos sender y receiver
        const { event } = args;
        const senderUID = event.sender.uid;
        const receiverUIDs = event.receiver.map((receiver) => receiver.uid);
        const receiver = [senderUID, ...receiverUIDs].filter(
            (uid) => uid !== ''
        );

        const copyEvent: InterfaceCalendarEvent = {
            ...args.event,
            searchTerms: receiver
        };

        const result: ICreateCalendar = {
            event: copyEvent
        };

        return this.calendarRepository.createEvent(result);
    }
}
