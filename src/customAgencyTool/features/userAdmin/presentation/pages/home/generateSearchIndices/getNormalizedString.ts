import { removeStopWords } from './removeStopWords';

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
    ü: 'u',
  };
  Object.keys(specialCharacterMap).forEach((char) => {
    result = result.replaceAll(char, specialCharacterMap[char]);
  });

  // Quitar stop words DESPUÉS de normalizar y antes de generar tokens finales
  // OJO: Si una "palabra" es un email, no se le deben quitar stop words internas si las tuviera (raro)
  // Esta implementación de RemoveStopWords es simple y podría separar un email si contiene espacios.
  // Para emails, es mejor tratarlos como un token único antes de este paso.
  // La regex /[^\w\s@.-]/gi ya ayuda a mantener los emails más intactos.
  // Si el email es una "palabra" única, RemoveStopWords no le afectará.
  result = removeStopWords(result);

  // Limpieza final de caracteres que no queremos en nuestros tokens finales (si RemoveStopWords re-introdujo espacios o algo)
  result = result
    .replace(/[^\w@.-]/gi, ' ') // Reemplaza no alfanuméricos (excepto @.-) por espacio
    .replace(/\s+/g, ' ') // Normaliza espacios múltiples
    .trim();
  return result;
};
