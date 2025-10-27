import { useBreakpointValue } from '@chakra-ui/react';
import type {
    DatesSetArg,
    EventChangeArg,
    EventClickArg
} from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, {
    type DateClickArg
} from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
    MyButton,
    MyDrawer,
    MyFlex,
    MyHeading,
    MyInputText,
    MyText,
} from '@src/customAgencyTool/components/ui';
import {
    DateConverter,
    TIME_ZONES,
    type DateFormat
} from '@src/customAgencyTool/utils/dayManagment/convertClockBetweenTimeZone';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import moment from 'moment-timezone';
import { useCallback, useEffect, useRef, useState, type FC } from 'react';
import type { InterfaceCalendarEvent } from '../../../domain/calendarEvent.entity';
import { birthdays } from '../../../domain/birthdays';
import { CostaRicanatioNalHolidays } from '../../../domain/CostaRicaNalHolidays';
import { adapterEvents } from '../../utils/adapterEvents';
import './calendarPanel.css';
import SelectedTimeZoneDrawer from './selectedTimeZoneDrawer';

interface InterfaceCalendarPanelProps {
    events?: InterfaceCalendarEvent[];
    onChangeDaysRange?: (start: Date, end: Date) => void;
    onEventChange?: (event: InterfaceCalendarEvent) => void;
    onClickDay?: (day: Date) => void;
    onClickEvent?: (event: InterfaceCalendarEvent) => void;
}

export const CalendarPanel1: FC<InterfaceCalendarPanelProps> = () => {
    return (
        <>
            <FullCalendar
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin
                ]}
                initialView="dayGridMonth"
                timeZone={'America/Costa_Rica'}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                }}
                selectable={true}
                editable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                // Eventos de ejemplo
                events={[
                    {
                        title: 'Evento de ejemplo',
                        start: new Date().toISOString(),
                        end: new Date(Date.now() + 3600000).toISOString()
                    }
                ]}
                // Configuraciones adicionales
                // weekNumbers={true}
                // weekText="s"
                fixedWeekCount={false} // true = mostrar todos los días de la semana
                slotDuration="00:30:00" // Duración de cada slot
                scrollTime="08:00:00" // Hora a la que se posiciona el scroll inicialmente
                firstDay={1} // 1 = Lunes
                locale="es" // Para español
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5], // Lunes a Viernes
                    startTime: '08:00',
                    endTime: '18:00'
                }}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    meridiem: 'short'
                }}

                dayCellDidMount={(arg) => {
                    if (highlightedDays.includes(arg.date.getDay())) {
                        arg.el.style.backgroundColor = highlightedColor;
                    }
                }}
            />
        </>
    );
};

const CalendarPanel: FC<InterfaceCalendarPanelProps> = ({
    events = [],
    onChangeDaysRange = () => {},
    onEventChange = () => {},
    onClickDay = () => {},
    onClickEvent = () => {}
}) => {
    const fullCalendarRef = useRef<FullCalendar>(null);

    const [showModal, setShowModal] = useState({
        timeZone: false
    });

    // Estado para almacenar la zona horaria seleccionada
    const [timeZone, setTimeZone] = useState(moment.tz.guess()); // Detecta la zona horaria local

    // Variable para controlar el tiempo entre clicks
    let clickTimeout: NodeJS.Timeout | null = null;

    const [highlightedDays, setHighlightedDays] = useState<number[]>([]);
    const [highlightedColor, setHighlightedColor] = useState<string>('#f0f0f0');

    const [birthdayEvents, setBirthdayEvents] = useState<any[]>([]);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const events = birthdays.flatMap(birthday => {
            const birthDate = new Date(birthday.date);
            return Array.from({ length: 11 }, (_, i) => {
                const year = currentYear + i;
                return {
                    title: `Birthday: ${birthday.title}`,
                    start: `${year}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`,
                    allDay: true,
                    display: 'background',
                    color: '#FFD700'
                };
            });
        });
        setBirthdayEvents(events);
    }, []);

    /**
     *  ? ----------------------------------
     *  *  handled Calendar Event Change
     *  ? ----------------------------------
     */
    const handledEventChange = (info: EventChangeArg) => {
        const { oldEvent, event } = info;

        const oldEventId = oldEvent.id;
        const eventID = event.id;

        if (oldEventId !== eventID) {
            return;
        }

        const { start, end } = event;

        const findEvent = events.find((event) => event.id === eventID);

        if (!findEvent || !start || !end) {
            return;
        }

        const eventFormat: InterfaceCalendarEvent = {
            ...findEvent,
            startDate: start,
            endDate: end
        };

        onEventChange(eventFormat);
    };

    /**
     *  ? ----------------------------------
     *  *  handled Calendar Change Date
     *  ? ----------------------------------
     */
    const hanledOnChangeDateCalendar = (info: DatesSetArg) => {
        const {
            end,
            //endStr,
            start
            //   startStr,
            // view
        } = info;

        onChangeDaysRange(start, end);
    };
    /**
     *  ? ----------------------------------
     *  *  handled Calendar day on click
     *  ? ----------------------------------
     */
    const handledOnClickDay = (info: DateClickArg) => {
        const { dateStr } = info;

        const currentHour = dayjs().hour();
        const currentMinute = dayjs().minute();
        const minutSlot = currentMinute < 30 ? 0 : 30;

        const date = dayjs(`${dateStr} ${currentHour}:${minutSlot}`).toDate();

        onClickDay(date);
    };
    /**
     *  ? ----------------------------------
     *  *  handled Calendar event click
     *  ? ----------------------------------
     */
    const hanledOnEventClik = (info: EventClickArg) => {
        const { event } = info;

        const id = event.id;

        const eventIndex = events.findIndex((event) => event.id === id);

        if (eventIndex === -1) {
            return;
        }

        onClickEvent(events[eventIndex]);
    };

    /**
     *  ? ----------------------------------
     *  *  handled Calendar on Select
     *  ? ----------------------------------
     */
    // Manejador de doble click en evento
    const handleEventDblClick = (clickInfo: EventClickArg) => {
        // console.log('Doble click en evento:', clickInfo.event);

        hanledOnEventClik(clickInfo);
    };

    // Manejador de doble click en celda
    const handleDateClick = (arg: DateClickArg) => {
        if (clickTimeout) {
            // Si hay un timeout activo, es un doble click
            clearTimeout(clickTimeout);
            clickTimeout = null;

            // Lógica para doble click
            // console.log('Doble click en fecha:', arg.date);
            // Ejemplo: Crear nuevo evento
            // const newEvent: EventInput = {
            //     id: String(Date.now()),
            //     title: 'Nuevo Evento',
            //     start: arg.date,
            //     end: new Date(arg.date.getTime() + 3600000) // 1 hora después
            // };

            // console.log('newEvent', newEvent);
            handledOnClickDay(arg);
        } else {
            // Primer click - establecer timeout
            clickTimeout = setTimeout(() => {
                // Lógica para click simple
                // console.log('Click simple en fecha:', arg.date);
                clickTimeout = null;
            }, 300); // 300ms para detectar doble click
        }
    };

    /**
     *  ? ----------------------------------
     *  *  handled View Controller
     *  ? ----------------------------------
     */
    const SetMonthView = useCallback(() => {
        if (!fullCalendarRef.current) {
            return;
        }

        const calendarApi = fullCalendarRef.current.getApi();

        calendarApi.changeView('dayGridMonth');
    }, [fullCalendarRef]);

    const SetWeekView = useCallback(() => {
        if (!fullCalendarRef.current) {
            return;
        }

        const calendarApi = fullCalendarRef.current.getApi();

        calendarApi.changeView('timeGridWeek');
    }, [fullCalendarRef]);

    const SetDayView = useCallback(() => {
        if (!fullCalendarRef.current) {
            return;
        }

        const calendarApi = fullCalendarRef.current.getApi();

        calendarApi.changeView('timeGridDay');
    }, [fullCalendarRef]);

    const SetListView = useCallback(() => {
        if (!fullCalendarRef.current) {
            return;
        }

        const calendarApi = fullCalendarRef.current.getApi();

        calendarApi.changeView('listWeek');
    }, [fullCalendarRef]);
    /**
     *  ? ----------------------------------
     *  *  handled Calendar Previous and Next
     *  ? ----------------------------------
     */
    const handledToday = () => {
        if (!fullCalendarRef.current) {
            return;
        }

        const calendarApi = fullCalendarRef.current.getApi();

        calendarApi.today();
    };
    const handledPrevious = () => {
        if (!fullCalendarRef.current) {
            return;
        }

        const calendarApi = fullCalendarRef.current.getApi();

        calendarApi.prev();

        // const month = dayjs();
        // const newMonth = month.subtract(1, 'month');
        // const date = newMonth.set('date', 1);

        // setFirstDayOfMonth(date.toDate());
    };

    const handledNext = () => {
        if (!fullCalendarRef.current) {
            return;
        }

        const calendarApi = fullCalendarRef.current.getApi();

        calendarApi.next();

        // const month = dayjs();
        // const newMonth = month.add(1, 'month');
        // const date = newMonth.set('date', 1);

        // setFirstDayOfMonth(date.toDate());
    };
    /**
     *  ? ----------------------------------
     *  *  handled TimeZone
     *  ? ----------------------------------
     */
    const handledOnShowTimeZone = () => {
        setShowModal((prev) => {
            return {
                ...prev,
                timeZone: !prev.timeZone
            };
        });
    };
    /**
     *  ? -----------------------------
     *  *  Render
     *  ? -----------------------------
     */
    const calendarH = useBreakpointValue({
        base: window.screen.height,
        md: window.screen.height * 0.5,
        lg: window.screen.height * 0.74
    });

    return (
        <MyFlex
            direction={'column'}
            flex={1}
            flexGrow={1}
            position={'relative'}
            minW={'1000px'}
            height={'100vh'}
            p={0}
            m={0}
            zIndex={0}
        >
            <MyFlex
                direction={'column'}
                borderRadius={'md'}
                py={1}
                px={2}
                position={'relative'}
            >
                <MyFlex
                    gap="1"
                    direction={'row'}
                    position={'absolute'}
                    top={'15px'}
                    left={'5px'}
                >
                    <MyButton
                        aria-label="Previous"
                        icon={'ArrowLeft'}
                        onClick={handledPrevious}
                    />
                    <MyButton onClick={handledToday}>Hoy</MyButton>
                    <MyButton
                        aria-label="Next"
                        icon={'ArrowRight'}
                        onClick={handledNext}
                    />
                </MyFlex>

                <MyFlex
                    gap="1"
                    direction={'row'}
                    position={'absolute'}
                    top={'15px'}
                    right={'5px'}
                >
                    <MyButton onClick={SetMonthView} leftIcon={'CALENDAR'}>
                        Mes
                    </MyButton>

                    <MyButton onClick={SetWeekView} leftIcon={'WEEEK'}>
                        Semana
                    </MyButton>

                    <MyButton onClick={SetDayView} leftIcon={'DAY'}>
                        Día
                    </MyButton>

                    <MyButton onClick={SetListView} leftIcon={'LIST'}>
                        Lista
                    </MyButton>

                    <MyButton onClick={handledOnShowTimeZone}>
                        {timeZone}
                    </MyButton>

                    <MyButton
                        aria-label="Settings"
                        icon={'SETTINGS'}
                        onClick={() => setShowModal(prev => ({ ...prev, settings: true }))}
                    />
                </MyFlex>
            </MyFlex>

            {/* Configuración del calendario */}
            <FullCalendar
                ref={fullCalendarRef}
                plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin
                ]}
                initialView="dayGridMonth"
                timeZone={timeZone}
                headerToolbar={{
                    left: '', //'prev,next today',
                    center: 'title',
                    right: '' //'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                }}
                selectable={true}
                editable={true}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                contentHeight={calendarH}
                // Eventos de ejemplo
                events={[
                    //  {
                    //     title: 'Evento de ejemplo',
                    //     start: new Date().toISOString(),
                    //     end: new Date(Date.now() + 3600000).toISOString()
                    // }
                    ...CostaRicanatioNalHolidays,
                    ...adapterEvents(events, timeZone),
                    ...birthdayEvents
                ]}
                // Manejador de click en evento
                eventClick={(info) => {
                    if (clickTimeout) {
                        clearTimeout(clickTimeout);
                        clickTimeout = null;
                        handleEventDblClick(info);
                    } else {
                        clickTimeout = setTimeout(() => {
                            console.log('Click simple en evento');
                            clickTimeout = null;
                        }, 300);
                    }
                }}
                // Manejador de click en fecha
                datesSet={hanledOnChangeDateCalendar}
                dateClick={handleDateClick}
                eventChange={handledEventChange}
                // Configuraciones adicionales
                // weekNumbers={true}
                // weekText="s"
                fixedWeekCount={false} // true = mostrar todos los días de la semana
                slotDuration="00:30:00" // Duración de cada slot
                scrollTime="08:00:00" // Hora a la que se posiciona el scroll inicialmente
                firstDay={1} // 1 = Lunes
                locale="es" // Para español
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5], // Lunes a Viernes
                    startTime: '08:00',
                    endTime: '18:00'
                }}
                slotLabelFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                }}
                eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                    meridiem: 'short'
                }}
            />

            {/* Selector de zona horaria */}
            <SelectedTimeZoneDrawer
                showModal={showModal.timeZone}
                onClose={() => {
                    setShowModal((prev) => {
                        return {
                            ...prev,
                            timeZone: false
                        };
                    });
                }}
                timeZone={timeZone}
                onChangeTimeZone={setTimeZone}
            />

            <SettingsDrawer
                isOpen={showModal.settings}
                onClose={() => setShowModal(prev => ({ ...prev, settings: false }))}
                highlightedDays={highlightedDays}
                setHighlightedDays={setHighlightedDays}
                highlightedColor={highlightedColor}
                setHighlightedColor={setHighlightedColor}
            />
        </MyFlex>
    );
};

export default CalendarPanel;

const SettingsDrawer: FC<{
    isOpen: boolean;
    onClose: () => void;
    highlightedDays: number[];
    setHighlightedDays: (days: number[]) => void;
    highlightedColor: string;
    setHighlightedColor: (color: string) => void;
}> = ({
    isOpen,
    onClose,
    highlightedDays,
    setHighlightedDays,
    highlightedColor,
    setHighlightedColor
}) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    const handleDayToggle = (day: number) => {
        setHighlightedDays(
            highlightedDays.includes(day)
                ? highlightedDays.filter(d => d !== day)
                : [...highlightedDays, day]
        );
    };

    return (
        <MyDrawer isOpen={isOpen} onOpenChange={onClose} header="Settings" placement="end">
            <MyFlex direction="column" p={4}>
                <MyHeading size="md" mb={2}>Highlight Weekdays</MyHeading>
                <MyFlex direction="row" wrap="wrap" gap={2}>
                    {days.map((day, index) => (
                        <MyButton
                            key={day}
                            onClick={() => handleDayToggle(index)}
                            variant={highlightedDays.includes(index) ? 'solid' : 'outline'}
                        >
                            {day}
                        </MyButton>
                    ))}
                </MyFlex>

                <MyHeading size="md" mt={4} mb={2}>Highlight Color</MyHeading>
                <MyInputText
                    type="color"
                    value={highlightedColor}
                    onChange={e => setHighlightedColor(e.target.value)}
                />
            </MyFlex>
        </MyDrawer>
    );
};

// 4. Componente React de ejemplo
export const TimeZoneConverter: React.FC = () => {
    useEffect(() => {
        // 1. Uso básico
        const converter = new DateConverter();

        // Convertir de Costa Rica a New York
        const crToNy = converter.convertTimezone(
            new Date(),
            TIME_ZONES.COSTA_RICA,
            TIME_ZONES.NEW_YORK
        );

        // 2. Uso con formato personalizado
        const timeOnly = converter.convertTimezone(
            new Date(),
            TIME_ZONES.COSTA_RICA,
            TIME_ZONES.LONDON,
            'HH:mm:ss'
        );

        // 3. Funciones de utilidad
        const dateUtils = {
            // Formatear fecha para mostrar
            formatDate: (
                date: Date | string,
                timezone: string,
                format?: DateFormat
            ) => {
                return dayjs(date).tz(timezone).format(format);
            },

            // Validar si una fecha es válida
            isValidDate: (date: string): boolean => {
                return dayjs(date).isValid();
            },

            // Comparar fechas entre zonas horarias
            compareDates: (
                date1: Date | string,
                zone1: string,
                date2: Date | string,
                zone2: string
            ): number => {
                const d1 = dayjs.tz(date1, zone1);
                const d2 = dayjs.tz(date2, zone2);
                return d1.diff(d2);
            }
        };

        console.log('converter', converter);
        console.log('crToNy', crToNy);
        console.log('timeOnly', timeOnly);
        console.log('dateUtils', dateUtils);
    }, []);

    return (
        <div>
            <h3>Convertidor de Zona Horaria</h3>
        </div>
    );
};

// 5. Ejemplo de uso en una función asíncrona
export async function processDateWithTimezone(
    eventDate: string,
    eventTimezone: string
): Promise<void> {
    const converter = new DateConverter();

    // Convertir a UTC para almacenamiento
    const utcDate = converter.toUTC(eventDate, eventTimezone);

    // Almacenar en base de datos...
    // await saveToDatabase(utcDate);

    // Convertir de vuelta a la zona horaria local para mostrar
    const localDate = converter.fromUTC(utcDate, TIME_ZONES.COSTA_RICA);

    console.log(`Fecha almacenada (UTC): ${utcDate}`);
    console.log(`Fecha local: ${localDate}`);
}

// Extiende dayjs con los plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

// Simula una respuesta de una API con una fecha en formato UTC
const apiResponse = {
    eventName: 'Lanzamiento del Proyecto',
    eventDateUTC: '2025-12-10T18:00:00Z'
};

export const EventDateDisplay: FC = () => {
    const [localEventDate, setLocalEventDate] = useState<string>('');
    const [userTimezone, setUserTimezone] = useState<string>('');

    useEffect(() => {
        // Obtenemos la fecha UTC de la "API"
        const utcDate = apiResponse.eventDateUTC;

        // Detectamos la zona horaria del navegador del usuario
        const detectedTimezone = dayjs.tz.guess();
        setUserTimezone(detectedTimezone);

        // Creamos un objeto Day.js a partir del string UTC,
        // lo convertimos a la zona horaria local y lo formateamos
        const formattedDate = dayjs(utcDate)
            .tz(detectedTimezone)
            .format('dddd, D [de] MMMM [de] YYYY [a las] h:mm A');

        setLocalEventDate(formattedDate);
    }, []);

    return (
        <div>
            <h2>Detalles del Evento</h2>
            <p>
                <strong>Nombre:</strong> {apiResponse.eventName}
            </p>
            <p>
                <strong>Fecha (UTC guardada):</strong>{' '}
                {apiResponse.eventDateUTC}
            </p>
            <hr />
            <p>
                Tu zona horaria detectada es: <strong>{userTimezone}</strong>
            </p>
            <p>
                Verás el evento en tu hora local:{' '}
                <strong>{localEventDate}</strong>
            </p>
        </div>
    );
};
