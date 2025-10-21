import dayjs from 'dayjs';

/**
 * Parsea un string CSV y convierte los valores a sus tipos correspondientes
 * @param csvString String CSV a parsear
 * @param options Opciones de configuración
 * @returns Array de valores convertidos (string | number | Date)
 */

// Función para parsear una fecha
export const parseDate = (
	value: string | number | undefined | null
): Date | undefined => {
	if (typeof value === 'number') {
		const length = value.toString().length;

		if (length !== 13) return undefined; // Timestamp en milisegundos

		const parsed = dayjs(value);

		return parsed.isValid() ? parsed.toDate() : undefined;
	}

	// 1/1/2025 = 8 characters
	// minimal length is 8 characters
	if (typeof value === 'string' && value.length < 8) return undefined;

	const parsed = dayjs(value);

	return parsed.isValid() ? parsed.toDate() : undefined;
};
