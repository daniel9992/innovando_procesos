import { addSpacesEveryThreeDigits } from './addSpaceEveryThreeDigits';

/**
 *
 * NumberToFixSTR redondea un número a un número fijo de decimales y devuelve el resultado como string.
 *
 * @param {number | string} num - El número a redondear o una cadena de texto.
 * @returns {string} - El número redondeado como string.
 */
export const numberToFixSTR = (num: number | string | undefined): string => {
	try {
		if (num === null || num === undefined || num === '') {
			return '0.00';
		}

		let numParse: number;

		if (typeof num === 'string') {
			const numStr = num.replace(/,/g, '.');
			numParse = parseFloat(numStr);
		} else {
			numParse = num;
		}

		if (Number.isNaN(numParse)) {
			return '0.00';
		}

		return addSpacesEveryThreeDigits(Number(numParse.toFixed(2)));
	} catch (error) {
		console.error(error);
		return '0.00';
	}
};
