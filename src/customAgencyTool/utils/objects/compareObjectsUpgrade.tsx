import type { InterfaceChangesItem } from '@src/customAgencyTool/features/orderTraking/domain/model';

/**
 * Aplana un objeto o arreglo anidado en un mapa de una sola dimensión.
 * La clave del mapa es el "path" completo hasta el valor.
 * @param data El objeto o arreglo a aplanar.
 * @returns Un Map donde las claves son paths y los valores son los valores primitivos.
 */
const flattenObject = (data: unknown): Map<string, unknown> => {
    const resultMap = new Map<string, unknown>();

    const dive = (current: unknown, path: string) => {
        // Si es nulo o indefinido, no hacemos nada.
        if (current === null || current === undefined) {
            return;
        }

        // Si es un arreglo, decidimos cómo construir el path.
        if (Array.isArray(current)) {
            // Estrategia: Si los elementos son objetos con 'id', usamos el id en el path.
            const useIdAsKey = current.every(
                (item) =>
                    typeof item === 'object' &&
                    item !== null &&
                    item.id !== undefined
            );
            current.forEach((item, index) => {
                const newPath = useIdAsKey
                    ? `${path}[id=${item.id}]`
                    : `${path}[${index}]`;
                dive(item, newPath);
            });
            // Si es un objeto (pero no un Date, que tratamos como valor), seguimos anidando.
        } else if (typeof current === 'object' && !(current instanceof Date)) {
            Object.entries(current).forEach(([key, value]) => {
                const newPath = path ? `${path}.${key}` : key;
                dive(value, newPath);
            });
            // Si es un valor primitivo o una fecha, lo agregamos al mapa.
        } else {
            resultMap.set(path, current);
        }
    };

    dive(data, '');
    return resultMap;
};
/**
 * Compare two objects deeply and return a list of changes.
 *
 * This function compares two objects and returns a list of changes.
 * It uses a recursive approach to compare the objects, and it can handle nested objects and arrays.
 * It also supports ignoring specific keys in the objects.
 *
 * The function takes two objects as input and returns a list of changes.
 * It compares the two objects and returns a list of changes.
 * It uses a recursive approach to compare the objects, and it can handle nested objects and arrays.
 * It also supports ignoring specific keys in the objects.
 *
 * @param obj1 - The first object to compare.
 * @param obj2 - The second object to compare.
 * @param noCompareKeys - An array of strings representing the keys to ignore during the comparison.
 * @returns An object of type InterfaceHistory with a list of changes.
 */
export const CompareObjs = <T extends Record<string, unknown>>(
    obj1: T,
    obj2: T,
    noCompareKeys: string[]
): InterfaceChangesItem[] => {
    const changesList: InterfaceChangesItem[] = [];
    const ignoreSet = new Set(noCompareKeys);

    // --- STEP 1: Convertir los dos objetos en una dimensión (usando la función correcta) ---
    const map1 = flattenObject(obj1);
    const map2 = flattenObject(obj2);

    // Obtenemos un conjunto de todas las claves únicas de ambos mapas para no perder ninguna.
    const allKeys = new Set([...map1.keys(), ...map2.keys()]);

    // --- STEP 2 & 3: Iterar, filtrar y comparar ---
    for (const key of allKeys) {
        // Se genera un "path genérico" para verificar si debe ser ignorado.
        // Ej: 'bills[id=bl-1].name' se convierte en 'bills.name' para la comparación.
        const genericPath = key.replace(/\[(id=)?[^\]]+\]/g, '');

        // Si el path genérico está en la lista de ignorados, saltamos a la siguiente clave.
        if (ignoreSet.has(genericPath)) {
            continue;
        }

        const value1 = map1.get(key);
        const value2 = map2.get(key);

        // Si los valores son diferentes, se registra el cambio.
        if (String(value1) !== String(value2)) {
            // Extraemos el nombre del arreglo base si existe.
            const arrayNameMatch = key.match(/^([^.[]+)/);
            const arrayName =
                map1.get(arrayNameMatch?.[0] ?? '') instanceof Array ||
                obj1[arrayNameMatch?.[0] ?? ''] instanceof Array
                    ? arrayNameMatch?.[0]
                    : undefined;

            changesList.push({
                ...(arrayName && { arrayName }),
                modifiedKey: key,
                oldValue:
                    value1 === undefined ? 'N/A (Agregado)' : String(value1),
                newValue:
                    value2 === undefined ? 'N/A (Eliminado)' : String(value2)
            });
        }
    }

    return changesList;
};

export const CompareObjs1 = <T extends Record<string, any>>(
    obj1: T,
    obj2: T,
    noCompareKeys: string[]
): InterfaceChangesItem[] => {
    const changesList: InterfaceChangesItem[] = [];
    const keysToIgnore = new Set(noCompareKeys);

    const findDifferences = (
        o1: any,
        o2: any,
        path = '',
        currentArrayName?: string
    ) => {
        // Si los objetos son idénticos, no hay nada que hacer.
        if (o1 === o2) return;

        // Aseguramos que o1 y o2 sean objetos para evitar errores en Object.keys.
        const safeO1 = o1 || {};
        const safeO2 = o2 || {};

        const allKeys = new Set([
            ...Object.keys(safeO1),
            ...Object.keys(safeO2)
        ]);

        for (const key of allKeys) {
            const currentPath = path ? `${path}.${key}` : key;
            const val1 = safeO1[key];
            const val2 = safeO2[key];

            const genericPath = currentPath.replace(/\[\d+\]/g, '');
            if (keysToIgnore.has(genericPath)) {
                continue;
            }

            // 1. Manejo de Arreglos: La lógica clave está aquí.
            if (Array.isArray(val1) || Array.isArray(val2)) {
                handleArrayComparison(val1 || [], val2 || [], currentPath, key);
                continue;
            }

            // 2. Manejo de Objetos: Se excluyen los tipo Date para tratarlos como primitivos.
            if (
                typeof val1 === 'object' &&
                val1 !== null &&
                !(val1 instanceof Date) &&
                typeof val2 === 'object' &&
                val2 !== null &&
                !(val2 instanceof Date)
            ) {
                findDifferences(val1, val2, currentPath, currentArrayName);
                continue;
            }

            // 3. Manejo de Primitivos (y Fechas): Si los valores son diferentes, se registra el cambio.
            // Se convierten a string para una comparación consistente.
            if (String(val1) !== String(val2)) {
                // Solo registrar si el valor no es 'undefined' en ambos lados al mismo tiempo
                if (val1 !== undefined || val2 !== undefined) {
                    changesList.push({
                        ...(currentArrayName && {
                            arrayName: currentArrayName
                        }),
                        modifiedKey: currentPath,
                        oldValue:
                            val1 === undefined
                                ? 'N/A (Agregado)'
                                : String(val1),
                        newValue:
                            val2 === undefined
                                ? 'N/A (Eliminado)'
                                : String(val2)
                    });
                }
            }
        }
    };

    /**
     * Lógica especializada para comparar dos arreglos.
     * - Si los elementos son objetos con 'id', los compara usando esa clave.
     * - Si no, recurre a la comparación por índice (para arreglos de primitivos).
     */
    const handleArrayComparison = (
        arr1: any[],
        arr2: any[],
        path: string,
        arrayName: string
    ) => {
        const isObjectArrayWithId =
            arr1.every(
                (item) => typeof item === 'object' && item.id !== undefined
            ) ||
            arr2.every(
                (item) => typeof item === 'object' && item.id !== undefined
            );

        if (isObjectArrayWithId) {
            // --- Estrategia de Mapeo por ID (más robusta) ---
            const map1 = new Map(arr1.map((item) => [item.id, item]));
            const map2 = new Map(arr2.map((item) => [item.id, item]));

            const allIds = new Set([...map1.keys(), ...map2.keys()]);

            for (const id of allIds) {
                const item1 = map1.get(id);
                const item2 = map2.get(id);
                // El path ahora es más semántico, usando el ID en lugar del índice.
                findDifferences(item1, item2, `${path}[id=${id}]`, arrayName);
            }
        } else {
            // --- Estrategia por Índice (para arreglos simples) ---
            const maxLength = Math.max(arr1.length, arr2.length);
            for (let i = 0; i < maxLength; i++) {
                findDifferences(arr1[i], arr2[i], `${path}[${i}]`, arrayName);
            }
        }
    };

    findDifferences(obj1, obj2);

    // it returns the final object with the requested format.
    return changesList;
};
