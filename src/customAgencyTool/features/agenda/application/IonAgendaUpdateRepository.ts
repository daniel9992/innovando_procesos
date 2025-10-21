import type { InterfaceFilterQuery } from '@src/customAgencyTool/constants/filterQuery';
import type { InterfaceClient } from '../domain/agendaModel';
import type { IOnAgendaUpdate } from './onAgendaUpdate.useCase';

export interface IOnAgendaUpdateRepository {
    get(filters: InterfaceFilterQuery[]): void;
    loadMore(): Promise<void>;
    destroy(): void;
}

export interface IOnAgendaUpdateRepository1 {
    /**
     * Subscribes to changes in the Bill of Landing in real-time.
     * @param args The filters for the query (user and date).
     * @param callback function that will be executed whenever the data changes.
     * @returns A function to cancel the subscription and stop the listener.
     */
    onAgendaUpdated(
        args: IOnAgendaUpdate,
        callback: (events: InterfaceClient[]) => void
    ): () => void;
}
