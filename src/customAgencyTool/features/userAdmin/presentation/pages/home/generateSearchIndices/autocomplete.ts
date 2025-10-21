import type { InvertedIndex } from './createInvertedIndex';

/**
 * Realiza una búsqueda de autocompletado sobre un conjunto de datos.
 * @param query - El texto de búsqueda introducido por el usuario.
 * @param index - El índice invertido pre-calculado.
 * @param originalDataMap - Un Map de ID -> Objeto original para un acceso rápido.
 * @param n - El número máximo de sugerencias a devolver.
 * @returns Un array con los 'n' objetos más relevantes.
 */
export function autocomplete<T extends { id: string }>(
    query: string,
    index: InvertedIndex,
    originalDataMap: Map<string, T>,
    n: number
): T[] {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
        return [];
    }

    // Mapa para acumular la puntuación de cada objeto encontrado
    const scores = new Map<string, number>();

    // Iteramos sobre las claves del índice (mucho más rápido que escanear todos los objetos)
    for (const [term, objects] of index.entries()) {
        if (term.startsWith(normalizedQuery)) {
            // Calculamos la puntuación basada en el tipo de coincidencia
            for (const objInfo of objects) {
                let score = 0;
                if (term === normalizedQuery) {
                    // Coincidencia exacta
                    score = objInfo.type === 'word' ? 20 : 5;
                } else {
                    // Coincidencia de prefijo
                    score =
                        objInfo.type === 'word'
                            ? 10
                            : objInfo.type === 'ngram'
                            ? 2
                            : 1;
                }

                // Añadimos un bono por la longitud de la coincidencia
                score += normalizedQuery.length;

                const currentScore = scores.get(objInfo.id) || 0;
                scores.set(objInfo.id, currentScore + score);
            }
        }
    }

    // Convertimos el mapa de puntuaciones a un array para ordenarlo
    const sortedScores = Array.from(scores.entries()).sort(
        (a, b) => b[1] - a[1]
    );

    // Tomamos los 'n' mejores resultados y los mapeamos a los objetos originales
    const topResults = sortedScores
        .slice(0, n)
        .map(([id]) => originalDataMap.get(id));

    // Filtramos posibles resultados indefinidos y devolvemos
    return topResults.filter((obj): obj is T => obj !== undefined);
}
