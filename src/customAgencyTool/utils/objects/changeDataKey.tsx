export interface IChangeDataKey {
    dataKey: string;
    newDataKey: string;
}

/**
 * Change the keys of an object based on a mapping array.
 * @param obj Original object
 * @param newDataKeyList List of data keys to change
 * @param options Options for the function
 * @returns New object with the changed keys
 */
export const changeDataKey = <T extends Record<string, any>>(
    obj: T,
    newDataKeyList: IChangeDataKey[],
    options: {
        removeUnmapped?: boolean; // Elimina las claves que no están en el mapeo
        preserveType?: boolean; // Preserva el tipo de dato original
        throwOnMissing?: boolean; // Lanza error si falta una clave en el mapeo
    } = {
        removeUnmapped: false,
        preserveType: true,
        throwOnMissing: false
    }
): Record<string, any> => {
    try {
        // Validaciones iniciales
        if (!obj || typeof obj !== 'object') {
            throw new Error('El objeto de entrada debe ser un objeto válido');
        }

        if (!Array.isArray(newDataKeyList) || newDataKeyList.length === 0) {
            throw new Error('La lista de mapeo debe ser un array no vacío');
        }

        // Crear el mapa de transformación
        const keyMap = new Map(
            newDataKeyList.map((item) => [item.dataKey, item.newDataKey])
        );

        // Validar que todas las claves del objeto tengan un mapeo si throwOnMissing es true
        if (options.throwOnMissing) {
            const missingKeys = Object.keys(obj).filter(
                (key) => !keyMap.has(key)
            );
            if (missingKeys.length > 0) {
                throw new Error(
                    `Claves sin mapeo encontradas: ${missingKeys.join(', ')}`
                );
            }
        }

        // Crear el nuevo objeto con las claves cambiadas
        const result = Object.entries(obj).reduce((acc, [key, value]) => {
            const newKey = keyMap.get(key);

            // Si la clave no está en el mapeo y removeUnmapped es true, la saltamos
            if (!newKey && options.removeUnmapped) {
                return acc;
            }

            // Si la clave no está en el mapeo, usamos la original
            const finalKey = newKey || key;

            // Manejar valores anidados si son objetos
            const finalValue =
                options.preserveType &&
                typeof value === 'object' &&
                value !== null
                    ? Array.isArray(value)
                        ? value.map((item) =>
                              typeof item === 'object'
                                  ? changeDataKey(item, newDataKeyList, options)
                                  : item
                          )
                        : changeDataKey(value, newDataKeyList, options)
                    : value;

            return {
                ...acc,
                [finalKey]: finalValue
            };
        }, {} as Record<string, any>);

        return result;
    } catch (error) {
        console.error('Error en changeDataKey:', error);
        throw error;
    }
};

/**
 * Reverse the keys of an object based on a mapping array.
 * @param mapping List of data keys to change
 * @returns New object with the changed keys
 */
export const reverseMapping = (mapping: IChangeDataKey[]): IChangeDataKey[] => {
    return mapping.map((item) => ({
        dataKey: item.newDataKey,
        newDataKey: item.dataKey
    }));
};
