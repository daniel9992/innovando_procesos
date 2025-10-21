/**
 * addSpacesEveryThreeDigits
 *
 * @param input - El número a procesar
 * @returns - La cadena con espacios agregados
 */
export function addSpacesEveryThreeDigits(input: number): string {
	// Convertir el número a cadena utilizando dos decimales fijos
	const cleanedInput = input.toFixed(2).replace(/\s+/g, '');

	// Separar la parte entera y la parte decimal
	const [integerPart, decimalPart] = cleanedInput.split('.');

	// Utilizar expresiones regulares para insertar espacios cada tres dígitos
	const formattedIntegerPart = integerPart.replace(
		/\B(?=(\d{3})+(?!\d))/g,
		' '
	);

	// Construir el resultado con la parte entera y la parte decimal
	return `${formattedIntegerPart}.${decimalPart}`;
}
