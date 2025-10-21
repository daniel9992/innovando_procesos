import { GenerateColorText } from './generateColorText';

// Agrupamos todas las pruebas para la función generateColorText
describe('generateColorText', () => {
    // Caso de prueba 1: Colores de fondo oscuros
    it('should return "white" as text color for dark backgrounds', () => {
        const darkColors = [
            'black',
            '#3E0703',
            '#3B060A',
            '#000000',
            'darkblue'
        ];

        darkColors.forEach((color) => {
            const result = GenerateColorText(color);
            // Verificamos que el color de texto sea 'white'
            expect(result.colorText).toBe('white');
            // Verificamos también que el color original se mantenga
            expect(result.color).toBe(color);
        });
    });

    // Caso de prueba 2: Colores de fondo claros
    it('should return "black" as text color for light backgrounds', () => {
        // Corregimos 'whilte' a 'white' para una prueba válida
        const lightColors = [
            'white',
            '#FFF085',
            '#FDFBEE',
            '#FFEDFA',
            'yellow'
        ];

        lightColors.forEach((color) => {
            const result = GenerateColorText(color);
            // Verificamos que el color de texto sea 'black'
            expect(result.colorText).toBe('black');
            expect(result.color).toBe(color);
        });
    });

    // Caso de prueba 3: Manejo de colores inválidos
    it('should return "black" as a default text color for invalid color strings', () => {
        const invalidColor = 'esto-no-es-un-color';
        const result = GenerateColorText(invalidColor);

        expect(result.colorText).toBe('black');
        expect(result.color).toBe(invalidColor);
    });
});
