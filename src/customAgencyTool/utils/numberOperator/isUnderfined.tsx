/**
 * Comprueba si un valor es undefined.
 *
 * @param {unknown} value - El valor a comprobar.
 * @returns {boolean} True si el valor es undefined, false en caso contrario.
 */
export const IsUnderFined = (value: unknown): boolean => {
	if (typeof value === 'undefined') {
		return true;
	} else {
		return false;
	}
};
