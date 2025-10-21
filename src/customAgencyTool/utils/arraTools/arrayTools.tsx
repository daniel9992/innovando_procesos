/* eslint-disable @typescript-eslint/no-explicit-any */
export function removeDuplicates(array: object[]): object[] {
    const uniqueJSONStrings = new Set(
        array.map((item) => JSON.stringify(item))
    );
    return Array.from(uniqueJSONStrings).map((itemJSON) =>
        JSON.parse(itemJSON)
    );
}

export function removeDuplicatesByKey(array: any[], key: string): any[] {
    return array.filter(
        (value, index, self) =>
            index === self.findIndex((item) => item[key] === value[key])
    );
}

/**
 * Ordena un array de objetos basándose en los números extraídos de una propiedad específica.
 *
 * @param {Object[]} array - El array a ordenar.
 * @param {string} key - La propiedad del objeto a utilizar para la ordenación.
 * @param {RegExp} regex - La expresión regular para extraer los números de la propiedad.
 * @param {'asc' | 'desc'} direction - La dirección de la ordenación ('asc' para ascendente, 'desc' para descendente).
 * @returns {Object[]} El array ordenado.
 */
export function SortArrayByKey(
    array: any[],
    key: string,
    direction: 'asc' | 'desc',
    regex?: RegExp
): any[] {
    return array.sort((a, b) => {
        let valueA = a[key];
        let valueB = b[key];

        if (valueA === undefined || valueB === undefined) {
            return 0;
        }

        // Use regex to extract numeric values if regex is provided
        if (regex) {
            const matchA = String(valueA).match(regex);
            const matchB = String(valueB).match(regex);
            valueA = matchA ? Number(matchA[1]) : 0; // Use match groups for extraction
            valueB = matchB ? Number(matchB[1]) : 0;
        }

        // Sort based on type of data
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return direction === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        } else {
            return direction === 'asc' ? valueA - valueB : valueB - valueA;
        }
    });
}

/**
 * Move an item from one index to another in an array.
 *
 * @param {any[]} arr - The array to move the item from.
 * @param {number} fromIndex - The index of the item to move.
 * @param {number} toIndex - The index to move the item to.
 * @returns {any[]} The updated array with the item moved.
 */
export const ArrayMove = (arr: any[], fromIndex: number, toIndex: number) => {
    const newArr = [...arr];
    newArr.splice(toIndex, 0, newArr.splice(fromIndex, 1)[0]);
    return newArr;
};

/**
 * Actualiza un elemento en un array.
 *
 * @param arr - Array en el que actualizar el elemento.
 * @param index - Índice del elemento a actualizar.
 * @param newItem - Nuevo valor del elemento.
 * @returns El array con el elemento actualizado.
 */
export const UpdateItemInArray = <T,>(
    arr: T[],
    index: number,
    newItem: T
): T[] => {
    return [...arr.slice(0, index), newItem, ...arr.slice(index + 1)];
};

/**
 * Agrupa los elementos de un array según un valor de una propiedad clave.
 *
 * @param arr - Array de elementos a agrupar.
 * @param key - Nombre de la propiedad por la cual agrupar.
 * @returns Un objeto donde las claves son los valores de la propiedad clave y los valores son arrays de elementos.
 */
export interface InterfaceGroupBy<T> {
    [key: string]: T[];
}

export const GroupBy = <T,>(
    arr: T[],
    key: keyof T,
    options: {
        trim?: boolean;
        toLowerCase?: boolean;
        ignoreEmpty?: boolean;
        customKeyTransform?: (key: any) => string;
    } = {
        trim: true,
        toLowerCase: false,
        ignoreEmpty: true
    }
): InterfaceGroupBy<T> => {
    if (!Array.isArray(arr) || arr.length === 0) {
        return {};
    }

    return arr.reduce((accumulator, currentItem) => {
        if (!currentItem || typeof currentItem !== 'object') {
            return accumulator;
        }

        const groupKey = currentItem[key];

        // Ignore null or undefined values if ignoreEmpty is true
        if (
            options.ignoreEmpty &&
            (groupKey === null || groupKey === undefined)
        ) {
            return accumulator;
        }

        // Convert to string and apply transformations
        let processedKey = String(groupKey);

        if (options.trim) {
            processedKey = processedKey.trim();
        }

        if (options.toLowerCase) {
            processedKey = processedKey.toLowerCase();
        }

        if (options.customKeyTransform) {
            processedKey = options.customKeyTransform(processedKey);
        }

        // Skip empty keys after processing
        if (options.ignoreEmpty && !processedKey) {
            return accumulator;
        }

        // Initialize array if key doesn't exist
        if (!accumulator[processedKey]) {
            accumulator[processedKey] = [];
        }

        accumulator[processedKey].push(currentItem);
        return accumulator;
    }, {} as InterfaceGroupBy<T>);
};

/**
 * Divide un array en varios arrays de un tamaño determinado.
 *
 * @param {Array} lines - El array a dividir.
 * @param {number} linesAvailable - El tamaño del array dividido.
 * @returns {Array<Array>} El array dividido.
 */
interface InterfaceDivideLines {
    lines: Array<unknown>; // Cambiado a any para que ignore el tipo específico
    linesAvailable: number;
}

export const DividerLinesPerLinesAvailable = ({
    lines,
    linesAvailable
}: InterfaceDivideLines) => {
    return lines.reduce(
        (acc: Array<Array<unknown>>, item: unknown, index: number) => {
            const groupIndex = Math.floor(index / linesAvailable);
            if (!acc[groupIndex]) {
                acc[groupIndex] = [];
            }
            acc[groupIndex].push(item);
            return acc;
        },
        []
    );
};

/**
 * Divide un array en varios sub-arrays (chunks) de un tamaño determinado.
 *
 * @template T El tipo de los elementos en el array.
 * @param {T[]} array - El array a dividir.
 * @param {number} chunkSize - El tamaño máximo de cada sub-array.
 * @returns {T[][]} Un array de arrays, donde cada sub-array tiene el tamaño de chunkSize.
 */
export const ChunkArrayByChunkSize = <T,>(array: T[], chunkSize: number) => {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
};
