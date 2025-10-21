/**
 * 	Transforma el texto de un objeto a mayúsculas
 *
 * @param obj  - Objeto a transformar
 * @param keysToNotUppercase  - Lista de claves que no se deben transformar a mayúsculas
 * @returns
 */
type GenericObject = Record<string, unknown>;

export const transformTextToUppercase = (
	obj: unknown,
	keysToNotUppercase: string[] = []
): GenericObject | unknown[] | string => {
	if (Array.isArray(obj)) {
		return obj.map((item) =>
			transformTextToUppercase(item, keysToNotUppercase)
		);
	} else if (typeof obj === 'object' && obj !== null) {
		if (obj instanceof Date) {
			return obj.toISOString();
		}

		const transformedObj: GenericObject = {};
		for (const [key, value] of Object.entries(obj)) {
			transformedObj[key] = keysToNotUppercase.includes(key)
				? value
				: transformTextToUppercase(value, keysToNotUppercase);
		}
		return transformedObj;
	} else if (typeof obj === 'string') {
		return obj.toUpperCase().trim();
	} else {
		return obj as GenericObject | unknown[] | string;
	}
};
