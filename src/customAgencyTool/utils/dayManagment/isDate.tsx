import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

//DD/MM/YYYY'
const acceptedFormatsDefault = [
	'YYYY-MM-DD',
	'DD/MM/YYYY',
	'D/M/YYYY',
	'D/MM/YYYY',
	'DD/M/YYYY',
	'YYYY/MM/DD',
	'MM-DD-YYYY',
];

/**
 * Verifica si un valor es una fecha válida en formatos definidos
 */
export const isDate = (
	value: string | number | Date,
	options?: { acceptedFormats?: string[] }
): boolean => {
	const { acceptedFormats = acceptedFormatsDefault } = options || {};

	if (value instanceof Date) {
		return !isNaN(value.getTime());
	}

	if (typeof value === 'string') {
		const trimmed = value.trim();

		// Descartar claramente fechas ISO extendidas con tiempo
		if (trimmed.includes('T')) return false;

		// Evaluar formatos aceptados estrictamente
		return acceptedFormats.some((format) =>
			dayjs(trimmed, format, true).isValid()
		);
	}

	if (typeof value === 'number') {
		const numLength = value.toString().length;
		// Timestamp válido debe tener exactamente 13 dígitos
		if (numLength !== 13) return false;

		return dayjs(value).isValid();
	}

	return false;
};

// import dayjs from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';

// dayjs.extend(customParseFormat);

// /**
//  * Check if a value is a valid date using dayjs
//  * @param value - Value to check
//  * @returns true if the value is a valid date, false otherwise
//  */
// export const isDate = (value: string | number | Date): boolean => {
// 	if (value instanceof Date) {
// 		return !isNaN(value.getTime());
// 	}

// 	const acceptedFormats = [
// 		'YYYY-MM-DD',
// 		'DD/MM/YYYY',
// 		'MM-DD-YYYY',
// 		'YYYY/MM/DD',
// 	];

// 	if (typeof value === 'string') {
// 		// if (value.length < 10) return false;

// 		// Prueba contra formatos aceptados de forma estricta
// 		return acceptedFormats.some((format) =>
// 			dayjs(value, format, true).isValid()
// 		);
// 	}

// 	if (typeof value === 'number') {
// 		// Validar que sea un timestamp válido por la cantidad de números
// 		if (value < 1000000000000) return false;
// 		// Trata de convertir timestamp
// 		return dayjs(value).isValid();
// 	}

// 	return false;
// };

// import dayjs from 'dayjs';
// import customParseFormat from 'dayjs/plugin/customParseFormat';

// dayjs.extend(customParseFormat);

// const acceptedFormats = [
// 	'YYYY-MM-DD',
// 	'DD/MM/YYYY',
// 	'MM-DD-YYYY',
// 	'YYYY/MM/DD',
// ];

// /**
//  * Check if a value matches any accepted date format
//  * @param value - Value to check
//  * @returns true if it's a valid date, false otherwise
//  */
// export const isDate = (value: string | number | Date): boolean => {
// 	if (value instanceof Date) return !isNaN(value.getTime());

// 	if (typeof value === 'string' || typeof value === 'number') {
// 		return acceptedFormats.some((format) =>
// 			dayjs(value, format, true).isValid()
// 		);
// 	}

// 	return false;
// };
