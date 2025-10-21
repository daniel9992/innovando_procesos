/**
 * Remove keys from an object
 * @param obj - Object to remove keys from
 * @param keys - Array of keys to remove
 * @returns Partial<T> - Object with removed keys
 */
export const removeKeys = <T extends Record<string, unknown>>(
    obj: T,
    keys: string[]
): Partial<T> => {
    if (!obj) return obj;

    const newObj = { ...obj };
    keys.forEach((key) => {
        if (key in newObj) {
            delete newObj[key];
        }
    });
    return newObj;
};
