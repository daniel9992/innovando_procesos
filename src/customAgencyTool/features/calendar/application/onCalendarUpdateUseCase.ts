import type { InterfaceCalendarEvent } from '../domain/calendarEvent.entity';
import type { ICalendarRepository } from './ICalendarRepository';

export interface IOnCalendarUpdate {
    currentUserUID: string;
    currentDate: Date;
}

/**
 * @class OnCalendarUpdateUseCase
 * @description Use case for subscribing to real-time updates of calendar events.
 */
export class OnCalendarUpdateUseCase {
    /**
     * @param {ICalendarRepository} calendarRepository - The repository that implements data access logic.
     */
    constructor(
        private readonly calendarRepository: ICalendarRepository
    ) {}

    /**
     * Run the use case.
     * Call the repository's onCalendarUpdate method and pass the callback.
     *
     * @param {IOnCalendarUpdate} args - The arguments required for the query (e.g. user UID and date).
     * @param {(events: InterfaceCalendarEvent[]) => void} callback - The function that will run with the updated events.
     * @returns {() => void} A function to cancel the subscription and stop the listener.
     */
    execute(
        args: IOnCalendarUpdate,
        callback: (events: InterfaceCalendarEvent[]) => void
    ): () => void {
        // The responsibility of the use case is simple:
        // 1. Validate the input if necessary (e.g. verify that currentUserUID is not null).
        if (!args.currentUserUID) {
            throw new Error(
                'El UID del usuario es requerido para esta operación.'
            );
        }

        // 2. Delegat the call to the corresponding method in the repository.
        const unsubscribe = this.calendarRepository.onCalendarUpdate(
            args,
            callback
        );

        // 3. Return a function to cancel the subscription and stop the listener.
        return unsubscribe;
    }
}
