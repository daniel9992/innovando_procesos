import { getLabelForKey } from '@src/customAgencyTool/utils/getLabelForKey/getLabelForKey';

interface ErrorItem {
    message: string;
}

interface ErrorObject {
    [key: string]: string | ErrorObject[] | undefined;
}

/**
 * Convert a simple error object to an array of ErrorItem objects.
 * @param errors Error object to convert
 * @returns Array of ErrorItem objects
 */
export const getErrorMessage = (errors: ErrorObject): ErrorItem[] => {
    return Object.entries(errors)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => ({
            message: `${getLabelForKey(key)}: ${value}`
        }));
};

/**
 *
 * Recursively processes an error object and generates a flat list of messages.
 * @param errors Error object to process
 * @returns
 */
export const formatErrorList = (errors: ErrorObject): string[] => {
    const result: string[] = [];

    Object.entries(errors).forEach(([key, value]) => {
        if (!value) return;

        if (Array.isArray(value)) {
            // Procesa arrays de errores
            value.forEach((item) => {
                if (typeof item === 'object') {
                    const nestedErrors = formatErrorList(item as ErrorObject);
                    result.push(...nestedErrors);
                }
            });
        } else if (typeof value === 'object') {
            // Procesa objetos de error anidados
            const nestedErrors = formatErrorList(value as ErrorObject);
            result.push(...nestedErrors);
        } else {
            // Procesa errores simples
            result.push(`${getLabelForKey(key)}: ${value}`);
        }
    });

    return result;
};
