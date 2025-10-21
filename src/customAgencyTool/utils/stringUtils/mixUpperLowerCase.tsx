/**
 * Alphabetic characters in a string are case-sensitive.
 * Non-alphabetic characters are preserved as they are.
 * The alternation is based on the sequence of letters, not on the absolute position in the string.
 *
 * @param text The input string.
 * @param startWithMayuscule Optional. If true, the first alphabetic character will be uppercase.
 * If false (default), the first alphabetic character will be lowercase.
 * @returns The string with the alphabetic character case alternated.
 */

export const MixUpperLowerCase = (
	text: string,
	startWithMayuscule: boolean = false
): string => {
	if (!text) {
		return '';
	}

	let resultado = '';
	// Esta bandera determina si el *próximo* carácter alfabético debe ser mayúscula.
	let proximoCaracterEsMayuscula = startWithMayuscule;

	for (let i = 0; i < text.length; i++) {
		const caracter = text[i];

		// Regex para verificar si el caracter es una letra del alfabeto inglés.
		// Para incluir letras acentuadas y otros caracteres alfabéticos Unicode,
		// se podría usar una regex más compleja o librerías, pero para el caso común:
		if (/[a-zA-Z]/.test(caracter)) {
			if (proximoCaracterEsMayuscula) {
				resultado += caracter.toUpperCase();
			} else {
				resultado += caracter.toLowerCase();
			}
			// Invertir la bandera para el siguiente carácter alfabético
			proximoCaracterEsMayuscula = !proximoCaracterEsMayuscula;
		} else {
			// Si no es un carácter alfabético, añadirlo tal cual
			resultado += caracter;
		}
	}

	return resultado;
};
