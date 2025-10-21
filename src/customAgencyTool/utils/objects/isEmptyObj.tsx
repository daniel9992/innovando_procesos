/**
 *  Check if an object is empty
 *  @param obj - Object to check
 *  @returns true if the object is empty, false otherwise
 */
export const isEmptyObject = <T extends Record<string, any>>(
	obj: T
): boolean => {
	if (!obj) return true;
	return (
		Object.keys(obj).length === 0 ||
		Object.values(obj).every(
			(value) =>
				value === null ||
				value === undefined ||
				value === '' ||
				(Array.isArray(value) && value.length === 0) ||
				(typeof value === 'object' && isEmptyObject(value))
		)
	);
};
