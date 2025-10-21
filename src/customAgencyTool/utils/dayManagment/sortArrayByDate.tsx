import dayjs, { Dayjs } from 'dayjs';

// Interfaz para objetos con un método toDate(), como los de Firebase
interface FirebaseTimestamp {
    toDate: () => Date;
}

// Interfaz para objetos con segundos y nanosegundos
interface SecondsTimestamp {
    _seconds: number;
    _nanoseconds: number;
}

/**
 * Normaliza diferentes formatos de fecha a un tipo que Day.js puede interpretar directamente.
 * @param value El valor de fecha en cualquier formato.
 * @returns Un objeto Date, un timestamp en milisegundos, o el valor original.
 */
function normalizeDateInput(
    value: FlexibleDateInput | null | undefined
): Date | number | string | Dayjs {
    // Maneja nulos o indefinidos
    if (value === null || value === undefined) {
        return null as any; // Será tratado como fecha inválida por dayjs
    }

    // Check 1: ¿Es un objeto tipo Firebase con método toDate()?
    if (
        typeof value === 'object' &&
        'toDate' in value &&
        typeof (value as any).toDate === 'function'
    ) {
        return (value as FirebaseTimestamp).toDate(); // Devuelve un objeto Date
    }

    // Check 2: ¿Es un objeto con _seconds?
    if (
        typeof value === 'object' &&
        '_seconds' in value &&
        typeof (value as any)._seconds === 'number'
    ) {
        // Convierte segundos a milisegundos
        return (value as SecondsTimestamp)._seconds * 1000;
    }

    // Si no es ninguno de los anteriores, devuelve el valor tal cual
    return value as Date | number | string | Dayjs;
}

// Un tipo de unión que abarca todos los formatos de fecha posibles
type FlexibleDateInput =
    | string
    | number
    | Date
    | Dayjs
    | FirebaseTimestamp
    | SecondsTimestamp;
type SortOrder = 'asc' | 'desc';

/**
 * Sort a array of objects by a date property, accepting multiple date formats.
 *
 * @param array The array of objects to sort.
 * @param dateKey The key of the object that contains the date.
 * @param order The order of sorting: 'asc' (ascending) or 'desc' (descending).
 * @returns The sorted array.
 */
export function sortArrayByDate<T>(
    array: T[],
    dateKey: keyof T,
    order: SortOrder = 'asc'
): T[] {
    return [...array].sort((a, b) => {
        // ¡Paso clave! Normalizar los valores antes de pasarlos a Day.js
        const normalizedA = normalizeDateInput(a[dateKey] as FlexibleDateInput);
        const normalizedB = normalizeDateInput(b[dateKey] as FlexibleDateInput);

        const dateA = dayjs(normalizedA);
        const dateB = dayjs(normalizedB);

        if (!dateA.isValid()) return 1;
        if (!dateB.isValid()) return -1;

        const difference = dateA.diff(dateB);
        return order === 'asc' ? difference : -difference;
    });
}
