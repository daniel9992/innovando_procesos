/**
 * 	Transforma el texto de un objeto a mayúsculas
 *
 * @param obj  - Objeto a transformar
 * @param keysToNotUppercase  - Lista de claves que no se deben transformar a mayúsculas
 * @returns
 */
export const CapitalizeFirstLetter = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};
