// --- Importaciones de Firebase ---
import { db } from '@src/customAgencyTool/core';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    onSnapshot,
    query,
    updateDoc,
    where
} from 'firebase/firestore';

// --- Importaciones de la Arquitectura ---
import { adapterDate } from '@src/customAgencyTool/utils/adapter';
import dayjs from 'dayjs';
import type { ICreateCalendar } from '../application/createCalendar.useCase';
import type { IDeleteCalendar } from '../application/deleteCalendar.useCase';
import type { ICalendarRepository } from '../application/ICalendarRepository';
import type { IOnCalendarUpdate } from '../application/onCalendarUpdateUseCase';
import type { IReadCalendar } from '../application/readCalendar.useCase';
import type { IUpdateCalendar } from '../application/updateCalendar.useCase';
import {
    initialCalendarEvent,
    type InterfaceCalendarEvent
} from '../domain/calendarEvent.entity';

export class FirebaseCalendarRepository implements ICalendarRepository {
    // Las constantes se mantienen para una fácil configuración y consistencia.
    private static readonly CALENDAR_COLLECTION = 'calendarCollections';

    /**
     * Lee los eventos del calendario para un usuario y un mes específicos.
     * Filtra los eventos donde el UID del usuario actual está en el array 'receive'.
     */
    public async readCalendar(
        args: IReadCalendar
    ): Promise<InterfaceCalendarEvent> {
        const { eventID } = args;

        const docRef = doc(
            db,
            FirebaseCalendarRepository.CALENDAR_COLLECTION,
            eventID
        );
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = {
                ...docSnap.data(),
                id: docSnap.id
            };
            const result = adapterDate(data);

            return result as InterfaceCalendarEvent;
        } else {
            // docSnap.data() will be undefined in this case

            throw new Error('No se encontró el documento.');
        }
    }

    /**
     * Se suscribe a los cambios del calendario en tiempo real.
     */
    public onCalendarUpdate(
        args: IOnCalendarUpdate,
        callback: (events: InterfaceCalendarEvent[]) => void
    ): () => void {
        const { currentUserUID, currentDate } = args;

        const dateFormat = dayjs(currentDate);

        const startOfMonth = dateFormat.startOf('month');
        const startWithOut3days = startOfMonth.subtract(3, 'day').toDate();
        const endOfMonth = dateFormat.endOf('month');
        const endWithOut5days = endOfMonth.add(5, 'day').toDate();

        const calendarRef = collection(
            db,
            FirebaseCalendarRepository.CALENDAR_COLLECTION
        );

        const searchTerms = ['todo', currentUserUID];

        // La consulta es idéntica a la de readCalendar
        const q = query(
            calendarRef,
            where('searchTerms', 'array-contains-any', searchTerms),
            where('startDate', '>=', startWithOut3days),
            where('endDate', '<=', endWithOut5days)
        );

        // onSnapshot establece el listener y devuelve la función para cancelarlo.
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const events: InterfaceCalendarEvent[] = [];
            querySnapshot.forEach((doc) => {
                const data = {
                    ...initialCalendarEvent,
                    ...doc.data(),
                    id: doc.id
                };
                const result = adapterDate(data) as InterfaceCalendarEvent;

                events.push(result);
            });

            // En lugar de retornar los eventos, llamamos al callback con los datos actualizados.
            callback(events);
        });

        // Devolvemos la función unsubscribe para que el que llama pueda limpiar el listener.
        return unsubscribe;
    }

    /**
     * Crea un nuevo evento en el calendario en la colección de Firestore.
     */
    public async createEvent(
        eventData: ICreateCalendar
    ): Promise<InterfaceCalendarEvent> {
        const { event } = eventData;

        // Firestore convertirá automáticamente los objetos Date a Timestamps
        const docRef = await addDoc(
            collection(db, FirebaseCalendarRepository.CALENDAR_COLLECTION),
            event
        );

        // update id
        // actualizar el registro con el id asignado
        const docRefUpdate = doc(
            db,
            FirebaseCalendarRepository.CALENDAR_COLLECTION,
            docRef.id
        );

        await updateDoc(docRefUpdate, {
            id: docRef.id
        });

        // Devuelve el evento creado, ahora incluyendo el ID generado por Firestore
        return {
            ...event,
            id: docRef.id
        };
    }

    /**
     * Actualiza un evento existente en el calendario.
     */
    public async updateEvent(
        args: IUpdateCalendar
    ): Promise<InterfaceCalendarEvent> {
        // Separamos el ID del resto de los datos a actualizar
        const { event } = args;
        const { id, ...dataToUpdate } = event;

        if (!id) {
            throw new Error('El ID del evento es requerido para actualizar.');
        }

        const docRef = doc(
            db,
            FirebaseCalendarRepository.CALENDAR_COLLECTION,
            id
        );

        // Actualiza el documento con los nuevos datos
        await updateDoc(docRef, dataToUpdate);

        // Devuelve el objeto completo actualizado
        return event;
    }

    /**
     * Elimina un evento del calendario usando su ID.
     */
    public async deleteEvent(args: IDeleteCalendar): Promise<void> {
        const { event } = args;

        const { id } = event;

        if (!id) {
            throw new Error('El ID del evento es requerido para eliminar.');
        }

        const docRef = doc(
            db,
            FirebaseCalendarRepository.CALENDAR_COLLECTION,
            id
        );
        await deleteDoc(docRef);
    }
}
