/**
 *  isNumber
 * @param value - The value to be checked if it is a number
 * @returns true if the value is a number, false otherwise
 */
export function isNumber(value?: string | number | any): boolean {
	return value != null && value !== '' && !isNaN(Number(value.toString()));
}
