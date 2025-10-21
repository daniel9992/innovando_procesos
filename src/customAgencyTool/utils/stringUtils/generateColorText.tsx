/**
 * Determines whether the text color should be white or black for a
 * given background color, based on luminance.
 *
 * @param color - The background color. Can be a name (‘black’),
 * hexadecimal code (‘#3E0703’), or RGB.
 * @returns An object with the original color and the suggested text color
 * (‘white’ or ‘black’).
 */
export const GenerateColorText = (
    color: string
): { color: string; colorText: 'white' | 'black' } => {
    // Función auxiliar para parsear el color a sus componentes RGB
    const getRgb = (
        colorStr: string
    ): { r: number; g: number; b: number } | null => {
        // Truco: Usamos un elemento del DOM para que el navegador parsee el color por nosotros.
        // Esto funciona con nombres, hex, rgb(), hsl(), etc.
        const d = document.createElement('div');
        d.style.color = colorStr;
        document.body.appendChild(d);

        // Obtenemos el color computado en formato "rgb(r, g, b)"
        const computedColor = window.getComputedStyle(d).color;
        document.body.removeChild(d);

        const match = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(computedColor);

        if (!match) {
            return null; // No se pudo parsear el color
        }

        return {
            r: parseInt(match[1], 10),
            g: parseInt(match[2], 10),
            b: parseInt(match[3], 10)
        };
    };

    const rgb = getRgb(color);

    if (!rgb) {
        // Si el color es inválido, devolvemos un valor por defecto.
        return { color, colorText: 'black' };
    }

    // Fórmula estándar para calcular la luminancia (YIQ)
    // Un valor > 128 se considera "claro", de lo contrario "oscuro".
    const luminance = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

    const colorText = luminance > 128 ? 'black' : 'white';

    return {
        color: color,
        colorText: colorText
    };
};
