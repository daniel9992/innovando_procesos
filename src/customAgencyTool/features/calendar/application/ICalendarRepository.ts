import type { InterfaceCalendarEvent } from '../domain/calendarEvent.entity';
import type { ICreateCalendar } from './createCalendar.useCase';
import type { IDeleteCalendar } from './deleteCalendar.useCase';
import type { IOnCalendarUpdate } from './onCalendarUpdateUseCase';
import type { IReadCalendar } from './readCalendar.useCase';

import type { IUpdateCalendar } from './updateCalendar.useCase';

export interface ICalendarRepository {
    /**
     * Read calendar events
     */
    readCalendar(args: IReadCalendar): Promise<InterfaceCalendarEvent>;

    /**
     * Subscribes to calendar changes in real-time.
     * @param args The filters for the query (user and date).
     * @param callback function that will be executed whenever the data changes.
     * @returns A function to cancel the subscription and stop the listener.
     *
     */
    onCalendarUpdate(
        args: IOnCalendarUpdate,
        callback: (events: InterfaceCalendarEvent[]) => void
    ): () => void; // Devuelve la función de cancelación

    /**
     * Create an event in the calendar
     */
    createEvent(args: ICreateCalendar): Promise<InterfaceCalendarEvent>;

    /**
     * Update an event in the calendar
     */
    updateEvent(args: IUpdateCalendar): Promise<InterfaceCalendarEvent>;

    /**
     * Delete a calendar event
     */
    deleteEvent(args: IDeleteCalendar): Promise<void>;
}
