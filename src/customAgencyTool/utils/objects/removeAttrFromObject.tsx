/**
 * Removes one or more attributes from an object
 * @param object The source object
 * @param attrs Single attribute or array of attributes to remove
 * @throws Error if object is null or undefined
 * @returns A new object without the specified attributes
 */
export const removeAttrFromObject = <T extends object, K extends keyof T>(
	object: T,
	attrs: K | K[]
): Omit<T, K> => {
	// Validaciones
	if (!object) {
		throw new Error('Object parameter cannot be null or undefined');
	}

	const attrsArray = Array.isArray(attrs) ? attrs : [attrs];

	// Validar que todos los atributos existan en el objeto
	const invalidAttrs = attrsArray.filter((attr) => !(attr in object));
	if (invalidAttrs.length > 0) {
		throw new Error(`Invalid attributes: ${invalidAttrs.join(', ')}`);
	}

	// Crear nuevo objeto omitiendo los atributos especificados
	return Object.entries(object).reduce<Partial<Omit<T, K>>>(
		(acc, [key, value]) => {
			if (!attrsArray.includes(key as K)) {
				acc[key as keyof Omit<T, K>] = value;
			}
			return acc;
		},
		{}
	) as Omit<T, K>;
};
