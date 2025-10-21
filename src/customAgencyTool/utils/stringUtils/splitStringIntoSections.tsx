/**
 * Divide un string en secciones iguales.
 * @param str - El string a dividir.
 * @param sectionLength - La longitud de cada sección.
 * @returns Un array de strings, cada uno con la longitud especificada.
 */
export function splitStringIntoSections(
	str: string,
	sectionLength: number
): string[] {
	const sections: string[] = [];

	for (let i = 0; i < str.length; i += sectionLength) {
		sections.push(str.slice(i, i + sectionLength));
	}

	return sections;
}

/**
 * Unir secciones de un string.
 * @param sections - Las secciones del string a unir.
 * @returns El string unido.
 */
export const mergeStringSections = (sections: string[]): string => {
	return sections.join('');
};
