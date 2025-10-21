/**
 * GetNormalizedString
 * @param str string to normalize
 * @returns
 */

export const getNormalizedString = (str: string): string => {
    if (typeof str !== 'string' || !str) return '';
    let result = str
        .toLocaleLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quita diacríticos
        .replace(/[^\w\s@.-]/gi, '') // Conserva alfanuméricos, espacios, @, ., -
        .replace(/\s+/g, ' ')
        .trim();

    // Mapeo específico después de la normalización básica por si algún carácter especial quedó
    const specialCharacterMap: Record<string, string> = {
        ñ: 'n',
        ç: 'c',
        ü: 'u'
    };
    Object.keys(specialCharacterMap).forEach((char) => {
        result = result.replaceAll(char, specialCharacterMap[char]);
    });

    // Limpieza final de caracteres que no queremos en nuestros tokens finales (si RemoveStopWords re-introdujo espacios o algo)
    result = result
        .replace(/[^\w@.-]/gi, ' ') // Reemplaza no alfanuméricos (excepto @.-) por espacio
        .replace(/\s+/g, ' ') // Normaliza espacios múltiples
        .trim();
    return result;
};
