import type { InterfaceFilterQuery } from '@src/customAgencyTool/constants/filterQuery';
import type { Observable } from 'rxjs';
import type { ICustomChatSession } from '../../domain/customChat.model';

export interface IOnChatUpdateRepository {
    /**
     * Observable que emite la lista actual de sesiones de chat
     */
    readonly data$: Observable<ICustomChatSession[]>;

    /**
     * Observable que indica si hay una operación de carga en curso
     */
    readonly loading$: Observable<boolean>;

    /**
     * Observable que indica si hay más datos disponibles para cargar
     */
    readonly hasMore$: Observable<boolean>;

    /**
     * Obtiene las sesiones de chat aplicando los filtros especificados
     * @param filters Array de filtros para la consulta
     * @throws Error si hay un problema al obtener los datos
     */
    get(filters: InterfaceFilterQuery[]): Promise<void>;

    /**
     * Carga la siguiente página de sesiones de chat
     * @throws Error si hay un problema al cargar más datos
     */
    loadMore(): Promise<void>;
}
