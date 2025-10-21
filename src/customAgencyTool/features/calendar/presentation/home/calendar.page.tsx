import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import { MyFlex } from '@src/customAgencyTool/components/ui';
import { selectCurrentUser } from '@src/customAgencyTool/features/auth/infrastructure/authSlice';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import type { InterfaceCalendarEvent } from '../../domain/calendarEvent.entity';
import { updateEvent } from '../../infrastructure/calendarSlice';
import { calendarRepository } from '../../infrastructure/compositionRoot';
import BtnEventOnCalendar from '../components/btnEventOnCalendar/btnEventOnCalendar';
import CalendarPanel from '../components/calendarPanel/calendarPanel';

interface SelectedEvent {
    show: boolean;
    start?: string | Date;
    end?: string | Date;
    event?: InterfaceCalendarEvent;
}
const defaultInitialValue: SelectedEvent = {
    show: false
};

const CalendarPage = () => {
    const dispatch = useAppDispatch();

    const [firstDayOfMonth, setFirstDayOfMonth] = useState(
        dayjs().startOf('month').toDate()
    );
    const [events, setEvents] = useState<InterfaceCalendarEvent[]>([]);

    const currentUser = useAppSelector(selectCurrentUser);

    const [isLoading, setIsLoading] = useState(true);

    const [controlerEvent, setControlerEvent] =
        useState<SelectedEvent>(defaultInitialValue);

    // Asumimos que obtienes estos valores de tu estado (Redux, Context, etc.)

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const DEBOUNCE_DELAY = 1000;

    useEffect(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // 1. Llama al método del repositorio para iniciar la escucha.
        // El callback que pasamos actualizará nuestro estado local.
        const unsubscribe = calendarRepository.onCalendarUpdate(
            {
                currentUserUID: currentUser.uid,
                currentDate: firstDayOfMonth
            },
            (updatedEvents) => {
                setEvents(updatedEvents);
                setIsLoading(false);
            }
        );

        // 2. La función de limpieza de useEffect es CRUCIAL.
        // Se ejecuta cuando el componente se desmonta.
        // Aquí llamamos a la función unsubscribe que nos devolvió el repositorio.
        return () => {
            // console.log('Cancelando suscripción al calendario...');
            timerRef.current = setTimeout(() => {
                unsubscribe(); // listeningTableData();
            }, DEBOUNCE_DELAY);
        };

        // La dependencia del array asegura que nos volvamos a suscribir
        // si el usuario o la fecha cambian.
    }, [currentUser, firstDayOfMonth]);

    const onChangeDaysRange = (start: Date /*, end: Date*/) => {
        // console.log('onChangeDaysRange', start, end);
        const startDate = dayjs(start)
            .startOf('month')
            .add(1, 'month')
            .toDate();
        setFirstDayOfMonth(startDate);
    };

    const onClickEvent = (event: InterfaceCalendarEvent) => {
        // console.log('onClickEvent', event);
        setControlerEvent({
            show: true,
            event: event
        });
    };

    const hanledOnClickDay = (day: Date) => {
        // console.log('hanledOnClickDay', day);
        setControlerEvent({
            show: true,
            start: day,
            end: day
        });
    };

    const hanledONeventChange = (event: InterfaceCalendarEvent) => {
        // console.log('hanledONeventChange', event);

        dispatch(updateEvent({ event: event }));

        setControlerEvent(defaultInitialValue);
    };

    return (
        <MyFlex
            position={'relative'}
            direction={'column'}
            p={0}
            m={0}
            overflow={'none'}
        >
            <Helmet>
                <title>Calendario</title>
            </Helmet>

            {isLoading && <LoadingWithText text={'Cargando...'} />}

            <CalendarPanel
                events={events}
                onChangeDaysRange={onChangeDaysRange}
                onClickEvent={onClickEvent}
                onClickDay={hanledOnClickDay}
                onEventChange={hanledONeventChange}
            />

            <BtnEventOnCalendar
                typeBtn={'none'}
                showEventModal={controlerEvent.show}
                selectedDate={controlerEvent.start as Date}
                selectedEvent={controlerEvent.event}
                callBackOnClose={() => {
                    setControlerEvent(defaultInitialValue);
                }}
            />
        </MyFlex>
    );
};

export default CalendarPage;
