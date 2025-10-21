/**
 * Redondea un número a un número fijo de decimales y devuelve el resultado como número.
 *
 * @param {number} num - El número a redondear.
 * @param {number} decimals - El número de decimales.
 * @returns {number} - El número redondeado.
 */
export function toFixedNumber(num: number, decimals: number): number {
	try {
		if (typeof num !== 'number' || typeof decimals !== 'number' || decimals < 0) {
			throw new Error('Parámetros inválidos');
		}

		const factor = 10 ** decimals;
		return Math.round(num * factor) / factor;
	} catch (error) {
		console.error(error);
		return 0;
	}
}
