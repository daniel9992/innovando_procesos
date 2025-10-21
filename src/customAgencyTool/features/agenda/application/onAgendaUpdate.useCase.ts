import type { InterfaceFilterQuery } from '@src/customAgencyTool/constants/filterQuery';
import type { IOnAgendaUpdateRepository } from './IonAgendaUpdateRepository';

export interface IOnAgendaUpdate {
    filter: InterfaceFilterQuery[];
}

/**
 * @class OnAgendaUpdateUseCase
 * @description Use case for subscribing to real-time updates of agenda events.
 */
export class OnAgendaUpdateUseCase {
    /**
     * @param {IOnAgendaUpdateRepository} agendaRepository - The repository that implements data access logic.
     */
    constructor(private readonly agendaRepository: IOnAgendaUpdateRepository) {}

    execute(args: IOnAgendaUpdate) {
        return this.agendaRepository.get(args.filter);
    }
    /**
     * Run the use case.
     * Call the repository's onAgendaUpdate method and pass the callback.
     *
     * @param {IOnAgendaUpdate} args - The arguments required for the query (e.g. user UID and date).
     * @param {(events: InterfaceCalendarEvent[]) => void} callback - The function that will run with the updated events.
     * @returns {() => void} A function to cancel the subscription and stop the listener.
     */
    // execute(
    //     args: IOnAgendaUpdate,
    //     callback: (events: InterfaceClient[]) => void
    // ): () => void {
    //     // 2. Delegat the call to the corresponding method in the repository.
    //     const unsubscribe = this.agendaRepository.onAgendaUpdated(
    //         args,
    //         callback
    //     );

    //     // 3. Return a function to cancel the subscription and stop the listener.
    //     return unsubscribe;
    // }
}
