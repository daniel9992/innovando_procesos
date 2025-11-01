// import dayjs from 'dayjs';
// import isToday from 'dayjs/plugin/isToday';
// import isYesterday from 'dayjs/plugin/isYesterday';
// import type { ICustomChatSession } from '../../domain/customChat.model';

// // Extender dayjs con los plugins necesarios
// dayjs.extend(isToday);
// dayjs.extend(isYesterday);

// export interface GroupedSessions {
//     heading: string;
//     sessions: ICustomChatSession[];
// }

// const sortOrder = [
//     'Hoy',
//     'Ayer',
//     'La Semana Pasada',
//     'El Mes Pasado',
//     'Enero',
//     'Febrero',
//     'Marzo',
//     'Abril',
//     'Mayo',
//     'Junio',
//     'Julio',
//     'Agosto',
//     'Septiembre',
//     'Octubre',
//     'Noviembre',
//     'Diciembre',
//     'El Año Pasado'
// ];

// export function groupSessionsByDate(
//     sessions: ICustomChatSession[]
// ): GroupedSessions[] {
//     const grouped: Record<string, ICustomChatSession[]> = {};

//     sessions.forEach((session) => {
//         const createdAt = dayjs(session.createdAt);
//         const now = dayjs();

//         if (createdAt.isToday()) {
//             if (!grouped['Hoy']) grouped['Hoy'] = [];
//             grouped['Hoy'].push(session);
//         } else if (createdAt.isYesterday()) {
//             if (!grouped['Ayer']) grouped['Ayer'] = [];
//             grouped['Ayer'].push(session);
//         } else if (createdAt.isSame(now, 'week')) {
//             if (!grouped['La Semana Pasada']) grouped['La Semana Pasada'] = [];
//             grouped['La Semana Pasada'].push(session);
//         } else if (createdAt.isSame(now, 'year')) {
//             const monthDiff = now.diff(createdAt, 'month');
//             if (
//                 monthDiff === 1 ||
//                 (monthDiff === 0 && now.date() > createdAt.date())
//             ) {
//                 if (!grouped['El Mes Pasado']) grouped['El Mes Pasado'] = [];
//                 grouped['El Mes Pasado'].push(session);
//             } else {
//                 const monthName = createdAt.format('MMMM');
//                 if (!grouped[monthName]) grouped[monthName] = [];
//                 grouped[monthName].push(session);
//             }
//         } else {
//             if (!grouped['El Año Pasado']) grouped['El Año Pasado'] = [];
//             grouped['El Año Pasado'].push(session);
//         }
//     });

//     // Remove empty groups
//     Object.keys(grouped).forEach((key) => {
//         if (grouped[key].length === 0) {
//             delete grouped[key];
//         }
//     });

//     // Sort groups
//     const sortedGroups = Object.keys(grouped).sort(
//         (a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b)
//     );

//     console.log('sortedGroups', sortedGroups);

//     return sortedGroups.map((heading) => ({
//         heading,
//         sessions: grouped[heading].sort(
//             (a, b) =>
//                 dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
//         )
//     }));
// }

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
    const now = dayjs();

    sessions.forEach((session) => {
        const createdAt = dayjs(session.createdAt);
        let groupKey: string;

        // 1. Comprobaciones relativas
        if (createdAt.isToday()) {
            groupKey = 'Hoy';
        } else if (createdAt.isYesterday()) {
            groupKey = 'Ayer';
        } else if (createdAt.isSame(now, 'week')) {
            // Nota: Esto significa "Esta Semana". Tu array lo llama "La Semana Pasada".
            // Asumiré que quieres mantener la clave 'La Semana Pasada'.
            groupKey = 'La Semana Pasada';
        } else if (createdAt.isSame(now.subtract(1, 'month'), 'month')) {
            // 2. Lógica MEJORADA para 'El Mes Pasado'
            groupKey = 'El Mes Pasado';
        } else if (createdAt.isSame(now, 'year')) {
            // 3. ¡LA SOLUCIÓN! Obtener el mes desde el array sortOrder
            // createdAt.month() devuelve un índice 0-11 (0 = Enero)
            // 'Enero' está en el índice 4 de tu array sortOrder.
            const monthIndex = createdAt.month();
            groupKey = sortOrder[monthIndex + 4]; // Ej: 0 (Enero) + 4 = 4 -> sortOrder[4] = 'Enero'
        } else {
            // 4. Todo lo demás (años anteriores)
            groupKey = 'El Año Pasado';
        }

        // Añadir al grupo
        if (!grouped[groupKey]) {
            grouped[groupKey] = [];
        }
        grouped[groupKey].push(session);
    });

    // 5. El bloque "Remove empty groups" es innecesario con esta lógica.

    // 6. Esta lógica de ordenación AHORA funcionará
    // porque las claves (ej. 'Enero') coincidirán exactamente con 'sortOrder'.
    const sortedGroups = Object.keys(grouped).sort(
        (a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b)
    );

    // console.log('sortedGroups', sortedGroups); // Esto ahora debería imprimir el orden correcto

    return sortedGroups.map((heading) => ({
        heading,
        // Ordenar las sesiones DENTRO de cada grupo (más nuevas primero)
        sessions: grouped[heading].sort(
            (a, b) =>
                dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
        )
    }));
}
