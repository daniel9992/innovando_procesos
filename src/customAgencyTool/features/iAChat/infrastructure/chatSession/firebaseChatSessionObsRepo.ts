// import type { InterfaceFilterQuery } from '@src/customAgencyTool/constants/filterQuery';
// import { db } from '@src/customAgencyTool/core';
// import { adapterDate } from '@src/customAgencyTool/utils/adapter';
// import {
//     CollectionReference,
//     type DocumentData,
//     DocumentSnapshot,
//     QueryConstraint,
//     QuerySnapshot,
//     collection,
//     getDocs,
//     limit,
//     orderBy,
//     query,
//     startAfter,
//     where
// } from 'firebase/firestore';
// import { BehaviorSubject, Observable } from 'rxjs';
// import type { IOnChatUpdateRepository } from '../../application/chatSession/onChatSessionUpdate';
// import type { ICustomChatSession } from '../../domain/customChat.model';

// export class FirebaseChatSessionObsRepository
//     implements IOnChatUpdateRepository
// {
//     private readonly collectionName = 'chatSessionCollection';
//     private readonly queryLimit = 35;
//     private readonly collectionRef: CollectionReference;

//     private dataSubject = new BehaviorSubject<ICustomChatSession[]>([]);
//     private loadingSubject = new BehaviorSubject<boolean>(false);
//     private hasMoreSubject = new BehaviorSubject<boolean>(true);

//     private lastVisibleDoc: DocumentSnapshot<DocumentData> | null = null;
//     private currentFilters: InterfaceFilterQuery[] = [];

//     public readonly data$: Observable<ICustomChatSession[]> =
//         this.dataSubject.asObservable();
//     public readonly loading$: Observable<boolean> =
//         this.loadingSubject.asObservable();
//     public readonly hasMore$: Observable<boolean> =
//         this.hasMoreSubject.asObservable();

//     constructor() {
//         this.collectionRef = collection(db, this.collectionName);
//     }

//     /**
//      * Obtiene los datos aplicando los filtros especificados
//      * @param filters Filtros a aplicar en la consulta
//      */
//     public async get(filters: InterfaceFilterQuery[]): Promise<void> {
//         try {
//             this.resetState();
//             this.currentFilters = filters;
//             this.loadingSubject.next(true);

//             const queryConstraints = this.buildQueryConstraints(filters);
//             const initialQuery = query(this.collectionRef, ...queryConstraints);
//             const snapshot = await getDocs(initialQuery);

//             const items = this.processQuerySnapshot(snapshot);

//             console.log('items Sessions: ', items);

//             this.updateStateAfterQuery(snapshot);
//             this.dataSubject.next(items);
//         } catch (error) {
//             console.error('Error al obtener datos:', error);
//             this.hasMoreSubject.next(false);
//         } finally {
//             this.loadingSubject.next(false);
//         }
//     }

//     /**
//      * Carga más documentos basados en la última consulta
//      */
//     public async loadMore(): Promise<void> {
//         if (!this.canLoadMore()) return;

//         try {
//             this.loadingSubject.next(true);
//             const queryConstraints = this.buildQueryConstraints(
//                 this.currentFilters,
//                 this.lastVisibleDoc
//             );

//             const nextQuery = query(this.collectionRef, ...queryConstraints);
//             const snapshot = await getDocs(nextQuery);

//             const newItems = this.processQuerySnapshot(snapshot);
//             this.updateStateAfterQuery(snapshot);

//             if (newItems.length > 0) {
//                 const currentItems = this.dataSubject.getValue();
//                 this.dataSubject.next([...currentItems, ...newItems]);
//             }
//         } catch (error) {
//             console.error('Error al cargar más documentos:', error);
//         } finally {
//             this.loadingSubject.next(false);
//         }
//     }

//     // No es necesario el método destroy ya que no hay suscripciones activas que limpiar

//     private resetState(): void {
//         this.dataSubject.next([]);
//         this.lastVisibleDoc = null;
//         this.hasMoreSubject.next(true);
//     }

//     private canLoadMore(): boolean {
//         return !(
//             this.loadingSubject.value ||
//             !this.hasMoreSubject.value ||
//             !this.lastVisibleDoc
//         );
//     }

//     private processQuerySnapshot(
//         snapshot: QuerySnapshot<DocumentData, DocumentData>
//     ): ICustomChatSession[] {
//         return snapshot.docs.map((doc) => {
//             const data = {
//                 ...doc.data(),
//                 id: doc.id
//             };
//             return adapterDate(data) as ICustomChatSession;
//         });
//     }

//     private updateStateAfterQuery(
//         snapshot: QuerySnapshot<DocumentData, DocumentData>
//     ): void {
//         if (snapshot.docs.length > 0) {
//             this.lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
//         }
//         this.hasMoreSubject.next(snapshot.docs.length >= this.queryLimit);
//     }

//     private buildQueryConstraints(
//         filters: InterfaceFilterQuery[],
//         startAfterDoc?: DocumentSnapshot<DocumentData> | null
//     ): QueryConstraint[] {
//         const constraints: QueryConstraint[] = [
//             ...filters.map((item) =>
//                 where(item.field, item.operator, item.value)
//             ),
//             orderBy('createdAt', 'desc'),
//             limit(this.queryLimit)
//         ];

//         if (startAfterDoc) {
//             constraints.push(startAfter(startAfterDoc));
//         }

//         return constraints;
//     }
// }

import type { InterfaceFilterQuery } from '@src/customAgencyTool/constants/filterQuery';
import { db } from '@src/customAgencyTool/core'; // Asegúrate que esta ruta sea correcta
import { adapterDate } from '@src/customAgencyTool/utils/adapter';
import {
    CollectionReference,
    type DocumentData,
    DocumentSnapshot,
    QueryConstraint,
    type Unsubscribe,
    collection,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    startAfter,
    where
} from 'firebase/firestore';

import { BehaviorSubject, Observable } from 'rxjs';
import type { ICustomChatSession } from '../../domain/customChat.model';

export class FirebaseChatSessionObsRepository {
    // --- PROPIEDADES PRIVADAS ---

    private readonly collectionName = 'chatSessionCollection';
    private readonly queryLimit = 35;
    private readonly collectionRef: CollectionReference;

    // Sujetos de RxJS para gestionar el estado de forma interna
    private dataSubject = new BehaviorSubject<ICustomChatSession[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private hasMoreSubject = new BehaviorSubject<boolean>(true);

    // Referencia al último documento visible para la paginación
    private lastVisibleDoc: DocumentSnapshot<DocumentData> | null = null;
    // Almacena la función para cancelar la suscripción de onSnapshot
    private unsubscribeFromSnapshot: Unsubscribe = () => {};
    // Almacena los filtros actuales para usarlos en la paginación
    private currentFilters: InterfaceFilterQuery[] = [];

    // --- OBSERVABLES PÚBLICOS ---

    /** Emite la lista actual de documentos. */
    public readonly data$: Observable<ICustomChatSession[]> =
        this.dataSubject.asObservable();
    /** Emite `true` si hay una operación de carga en curso. */
    public readonly loading$: Observable<boolean> =
        this.loadingSubject.asObservable();
    /** Emite `true` si hay más documentos por cargar. */
    public readonly hasMore$: Observable<boolean> =
        this.hasMoreSubject.asObservable();

    // --- CONSTRUCTOR ---

    constructor() {
        // Inicializa la referencia a la colección de Firestore
        this.collectionRef = collection(db, this.collectionName);
    }

    // --- MÉTODOS PÚBLICOS ---

    /**
     * Inicia la escucha de datos con un conjunto de filtros.
     * Limpia cualquier escucha anterior y reinicia el estado.
     * @param filters - Un array de objetos de filtro para la consulta.
     */
    public get(filters: InterfaceFilterQuery[]): void {
        // 1. Limpiar la suscripción anterior para evitar listeners duplicados
        this.unsubscribeFromSnapshot();

        // 2. Reiniciar el estado para una nueva consulta
        this.dataSubject.next([]);
        this.lastVisibleDoc = null;
        this.hasMoreSubject.next(true);
        this.loadingSubject.next(true);
        this.currentFilters = filters; // Guardar los filtros para `loadMore`

        // 3. Construir las restricciones de la consulta
        const queryConstraints = this.buildQueryConstraints(filters);

        // 4. Crear la consulta inicial
        const initialQuery = query(this.collectionRef, ...queryConstraints);

        // 5. Suscribirse a los cambios en tiempo real con onSnapshot
        this.unsubscribeFromSnapshot = onSnapshot(
            initialQuery,
            (snapshot) => {
                // Mapear los documentos al formato deseado
                const items = snapshot.docs.map((doc) => {
                    const data = {
                        ...doc.data(),
                        id: doc.id
                    };
                    const result = adapterDate(data);
                    return result as ICustomChatSession;
                });

                // Actualizar el último documento visible para la paginación
                if (snapshot.docs.length > 0) {
                    this.lastVisibleDoc =
                        snapshot.docs[snapshot.docs.length - 1];
                }

                // Comprobar si hay más documentos por cargar
                if (snapshot.docs.length < this.queryLimit) {
                    this.hasMoreSubject.next(false);
                }

                // Emitir los nuevos datos y actualizar el estado de carga
                this.dataSubject.next(items);
                this.loadingSubject.next(false);
            },
            (error) => {
                console.error('Error al obtener datos en tiempo real:', error);
                this.loadingSubject.next(false);
                // Opcional: emitir un error a través de otro Subject
            }
        );
    }

    /**
     * Carga la siguiente página de documentos y los añade a la lista existente.
     */
    public async loadMore(): Promise<void> {
        // Evitar cargas múltiples si ya se está cargando o no hay más datos
        if (this.loadingSubject.value || !this.hasMoreSubject.value) {
            return;
        }

        // Si no hay un 'último documento', no hay nada que cargar.
        if (!this.lastVisibleDoc) {
            console.log('No hay más documentos para cargar.');
            this.hasMoreSubject.next(false);
            return;
        }

        this.loadingSubject.next(true);

        try {
            // 1. Construir las restricciones de la consulta para la siguiente página
            const queryConstraints = this.buildQueryConstraints(
                this.currentFilters,
                this.lastVisibleDoc
            );

            // 2. Crear la consulta para la siguiente página
            const nextQuery = query(this.collectionRef, ...queryConstraints);

            // 3. Ejecutar la consulta una vez con getDocs
            const documentSnapshots = await getDocs(nextQuery);

            // 4. Mapear los nuevos documentos
            const newItems = documentSnapshots.docs.map((doc) => {
                const data = {
                    ...doc.data(),
                    id: doc.id
                };
                const result = adapterDate(data);
                return result as ICustomChatSession;
            });

            // 5. Actualizar el último documento visible
            if (documentSnapshots.docs.length > 0) {
                this.lastVisibleDoc =
                    documentSnapshots.docs[documentSnapshots.docs.length - 1];
            }

            // 6. Comprobar si se ha llegado al final
            if (documentSnapshots.docs.length < this.queryLimit) {
                this.hasMoreSubject.next(false);
            }

            // 7. Combinar la lista actual con la nueva y emitir el valor
            if (newItems.length > 0) {
                const currentItems = this.dataSubject.getValue();
                this.dataSubject.next([...currentItems, ...newItems]);
            }
        } catch (error) {
            console.error('Error al cargar más documentos:', error);
        } finally {
            // Asegurarse de que el estado de carga se actualice siempre
            this.loadingSubject.next(false);
        }
    }

    /**
     * Limpia la suscripción a onSnapshot.
     * Debe llamarse cuando el componente que usa esta clase se destruye.
     */
    public destroy(): void {
        this.unsubscribeFromSnapshot();
        console.log('Suscripción a Firestore cancelada.');
    }

    // --- MÉTODOS PRIVADOS ---

    /**
     * Construye un array de restricciones de consulta para Firestore.
     * @param filters - Array de filtros a aplicar.
     * @param startAfterDoc - (Opcional) Documento para iniciar la paginación.
     * @returns Un array de QueryConstraint.
     */
    private buildQueryConstraints(
        filters: InterfaceFilterQuery[],
        startAfterDoc?: DocumentSnapshot<DocumentData> | null
    ): QueryConstraint[] {
        const constraints: QueryConstraint[] = [];

        // Añadir filtros 'where'
        filters.forEach((item) => {
            constraints.push(where(item.field, item.operator, item.value));
        });

        // Añadir ordenamiento (esencial para la paginación)
        constraints.push(orderBy('createdAt', 'asc'));

        // Añadir paginación si se proporciona el documento
        if (startAfterDoc) {
            constraints.push(startAfter(startAfterDoc));
        }

        // Añadir el límite de documentos
        constraints.push(limit(this.queryLimit));

        return constraints;
    }
}
