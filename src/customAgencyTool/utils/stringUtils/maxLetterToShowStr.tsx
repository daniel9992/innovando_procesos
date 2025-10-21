/**
 *  MaxLetterToShowStr
 *
 * @param str - La cadena a procesar
 * @param maxLetterPerLine - El número máximo de letras por línea
 * @returns
 */
export const MaxLetterToShowStr = (str: string, maxLetterPerLine: number) => {
    try {
        if (!str) {
            return '';
        }
        if (str.length > maxLetterPerLine) {
            return str.substring(0, maxLetterPerLine) + '...';
        }
        return str;
    } catch (error) {
        console.error(error);
        return '- Error -';
    }
};

/**
 * StartWithUpperCase
 *
 * @param str - La cadena a procesar
 * @returns - La cadena con el primer caracter en mayúscula
 */
export const StartWithUpperCase = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
