/**
 * Function to check if a value is numeric
 * @param value The value to check can be a string, number, undefined or null
 * @returns True if the value is numeric, false otherwise
 */
export const isNumeric = (
    value: string | number | undefined | null
): boolean => {
    if (typeof value === 'number') return true;
    if (typeof value !== 'string') return false;
    // Expresión regular para verificar si es un número, potencialmente con decimales (punto o coma) y signo negativo
    const numericRegex = /^-?\d*([.,]\d+)?$/;
    return numericRegex.test(value.trim());
};

/**
 * Function to parse a string value to a number
 * @param value The value to parse can be a string, number, undefined or null
 * @returns The parsed number or 0 if the value is not numeric
 */
export const parseNumber = (
    value: string | number | undefined | null
): number => {
    if (typeof value === 'number') return value;
    if (typeof value !== 'string' || value.trim() === '') return 0; // O NaN si prefieres manejarlo diferente

    // Reemplaza comas por puntos para consistencia decimal y elimina otros caracteres no numéricos (excepto el signo - al inicio)
    const cleanedValue = value
        .trim()
        .replace(/,/g, '.')
        .replace(/[^\d.-]/g, '');

    // Maneja múltiples puntos decimales o formatos inválidos
    const parts = cleanedValue.split('.');
    if (parts.length > 2) return NaN; // Formato inválido

    const num = parseFloat(cleanedValue);
    return isNaN(num) ? 0 : num; // Devuelve '' si no es un número válido después de limpiar
};
