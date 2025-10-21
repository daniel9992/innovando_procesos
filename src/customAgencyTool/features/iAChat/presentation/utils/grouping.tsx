import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import type { ICustomChatSession } from '../../domain/customChat.model';

// Extender dayjs con los plugins necesarios
dayjs.extend(isToday);
dayjs.extend(isYesterday);

export interface GroupedSessions {
    heading: string;
    sessions: ICustomChatSession[];
}

const sortOrder = [
    'Hoy',
    'Ayer',
    'La Semana Pasada',
    'El Mes Pasado',
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
    'El Año Pasado'
];

export function groupSessionsByDate(
    sessions: ICustomChatSession[]
): GroupedSessions[] {
    const grouped: Record<string, ICustomChatSession[]> = {};

    sessions.forEach((session) => {
        const createdAt = dayjs(session.createdAt);
        const now = dayjs();

        if (createdAt.isToday()) {
            if (!grouped['Hoy']) grouped['Hoy'] = [];
            grouped['Hoy'].push(session);
        } else if (createdAt.isYesterday()) {
            if (!grouped['Ayer']) grouped['Ayer'] = [];
            grouped['Ayer'].push(session);
        } else if (createdAt.isSame(now, 'week')) {
            if (!grouped['La Semana Pasada']) grouped['La Semana Pasada'] = [];
            grouped['La Semana Pasada'].push(session);
        } else if (createdAt.isSame(now, 'year')) {
            const monthDiff = now.diff(createdAt, 'month');
            if (
                monthDiff === 1 ||
                (monthDiff === 0 && now.date() > createdAt.date())
            ) {
                if (!grouped['El Mes Pasado']) grouped['El Mes Pasado'] = [];
                grouped['El Mes Pasado'].push(session);
            } else {
                const monthName = createdAt.format('MMMM');
                if (!grouped[monthName]) grouped[monthName] = [];
                grouped[monthName].push(session);
            }
        } else {
            if (!grouped['El Año Pasado']) grouped['El Año Pasado'] = [];
            grouped['El Año Pasado'].push(session);
        }
    });

    // Remove empty groups
    Object.keys(grouped).forEach((key) => {
        if (grouped[key].length === 0) {
            delete grouped[key];
        }
    });

    // Sort groups
    const sortedGroups = Object.keys(grouped).sort(
        (a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b)
    );

    return sortedGroups.map((heading) => ({
        heading,
        sessions: grouped[heading].sort(
            (a, b) =>
                dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        )
    }));
}
