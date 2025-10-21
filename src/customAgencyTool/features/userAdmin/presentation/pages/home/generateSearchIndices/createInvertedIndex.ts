import type { SearchIndexable } from './generateSearchIndices';

interface TermInfo {
    id: string; // ID del objeto original
    type: 'word' | 'ngram' | 'soundex'; // Tipo de término para el scoring
}

// Mapa: clave = término de búsqueda, valor = array de objetos que lo contienen
export type InvertedIndex = Map<string, TermInfo[]>;

/**
 * Crea un índice invertido a partir de una lista de objetos ya indexados.
 * @param indexedObjects - Array de objetos con sus searchTerms.
 * @returns Un Map que funciona como índice invertido.
 */
export function createInvertedIndex(
    indexedObjects: SearchIndexable[]
): InvertedIndex {
    const index: InvertedIndex = new Map();

    for (const obj of indexedObjects) {
        // Para diferenciar los tipos de términos y darles puntuación
        const words = new Set<string>();

        obj.searchTerms.forEach((term) => {
            // Identificamos el tipo de término para el scoring
            let type: 'word' | 'ngram' | 'soundex' = 'ngram';
            if (/^[A-Z][0-9]{3}$/.test(term)) {
                // Heurística para Soundex (ej. M630)
                type = 'soundex';
            } else if (
                !obj.searchTerms.some(
                    (t) => t.startsWith(term) && t.length > term.length
                )
            ) {
                // Si no hay otra palabra más larga que empiece con este término, es una palabra completa
                words.add(term);
                type = 'word';
            }

            // Añadimos la información al índice
            const existing = index.get(term) || [];
            index.set(term, [...existing, { id: obj.id, type }]);
        });
    }
    return index;
}
