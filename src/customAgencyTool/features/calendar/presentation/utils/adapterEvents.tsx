import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import type {
    InterfaceCalendarEvent,
    InterfaceFullcalendarEvent
} from '../../domain/calendarEvent.entity';

dayjs.extend(timezone);

export const adapterEvents = (
    events: InterfaceCalendarEvent[],
    timeZone: string
): InterfaceFullcalendarEvent[] => {
    const result: InterfaceFullcalendarEvent[] = [];

    console.log(timeZone);

    events.forEach((event) => {
        let color = '';

        if (event.category.length > 0) {
            color = event.category[0].color;
        }
        const temp: InterfaceFullcalendarEvent = {
            id: event.id,
            allDay: event.isAllDay,
            // start: event.startDate.toISOString(),
            // end: event.endDate.toISOString(),
            start: dayjs(event.startDate).format(),
            end: dayjs(event.endDate).format(),
            // start: dayjs(event.startDate).tz(timeZone).format(),
            // end: dayjs(event.endDate).tz(timeZone).format(),
            title: event.title,
            // url: event.path,
            // classNames: event.category.map((category) => category.label),
            // editable: true,
            // display: 'background',
            backgroundColor: color,
            borderColor: 'gray',
            textColor: 'black',
            extendedProps: {},
            source: {},
            resourceEditable: false
        };

        result.push(temp);
    });

    return result;
};
