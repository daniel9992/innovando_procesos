/**
 *  GenerateSearchIndices
 *  Generates search indices from a document
 *  @param doc Document to generate the search indices
 *  @param valueKeys Keys of the document to generate the search indices
 *  @param config Configuration options for the search indices
 * 	@returns
 */
import { generateNgrams } from './generateNgrams';
import { getNormalizedString } from './getNormalizedString';
import { getValueFromPath } from './getValueFromPath';
import { soundex } from './soundex';

export interface SearchIndexable {
  id: string; // Asumimos que el objeto de entrada T tendrá una propiedad 'id'
  searchTerms: string[];
}

export interface GenerateSearchIndicesConfig {
  includeExactTokens?: boolean;
  includeSoundex?: boolean;
  includeNgrams?: boolean; // Global default for N-grams
  ngramSize?: number; // Global default N-gram size
  minWordLengthForNgrams?: number; // Global default min word length for N-grams

  minWordLengthForSoundex?: number;
  enableNumberExtraction?: boolean;
  minDigitsForNumberHandling?: number;
}

// Configuration for each specific path to be indexed
export interface ValueKeyConfigItem {
  path: string;
  applyNgrams?: boolean; // Override global 'includeNgrams' for this specific path
  ngramSize?: number; // Override global 'ngramSize' for this path
  minWordLengthForNgrams?: number; // Override global 'minWordLengthForNgrams' for this path
  // Future: could add similar overrides for Soundex, exact tokens, etc.
  // applySoundex?: boolean;
  // minWordLengthForSoundex?: number;
}

const defaultConfig: Required<GenerateSearchIndicesConfig> = {
  includeExactTokens: true,
  includeSoundex: true,
  includeNgrams: true, // N-grams are on by default globally
  ngramSize: 3,
  minWordLengthForNgrams: 2,

  minWordLengthForSoundex: 3,
  enableNumberExtraction: true,
  minDigitsForNumberHandling: 4,
};

/**
 * Generates search indices for a document based on specified paths and configuration
 * @param doc - The document to generate indices for, must have an id property
 * @param valueKeyConfigs - Array of configurations specifying which paths to index and how
 * @param config - Optional global configuration overrides
 * @returns An object containing the document id and generated search terms
 */

export function generateSearchIndices<T extends { id: string }>(
  doc: T,
  valueKeyConfigs: ValueKeyConfigItem[],
  config?: Partial<GenerateSearchIndicesConfig>,
): SearchIndexable {
  const mergedGlobalConfig: Required<GenerateSearchIndicesConfig> = {
    ...defaultConfig,
    ...config,
  };
  const allTokens = new Set<string>();

  if (!doc || typeof doc.id === 'undefined') {
    console.error("El documento debe tener una propiedad 'id'.", doc);
    throw new Error("El documento debe tener una propiedad 'id'.");
  }

  for (const keyConfig of valueKeyConfigs) {
    const pathString = keyConfig.path;
    const rawValuesFromPath = getValueFromPath(doc, pathString);

    for (const rawValue of rawValuesFromPath) {
      const stringValue =
        typeof rawValue === 'string' ? rawValue : String(rawValue);
      if (!stringValue || stringValue.trim() === '') continue;

      const normalizedFullValue = getNormalizedString(stringValue);
      const words = normalizedFullValue
        .split(' ')
        .filter((word) => word.length > 0);

      for (const word of words) {
        if (mergedGlobalConfig.includeExactTokens && word.length > 0) {
          allTokens.add(word);
        }

        if (
          mergedGlobalConfig.includeSoundex &&
          word.length >= mergedGlobalConfig.minWordLengthForSoundex
        ) {
          const soundexCode = soundex(word);
          if (soundexCode && soundexCode !== word) {
            allTokens.add(soundexCode);
          }
        }

        let applyNgramsForCurrentPath = mergedGlobalConfig.includeNgrams;
        if (keyConfig.applyNgrams !== undefined) {
          applyNgramsForCurrentPath = keyConfig.applyNgrams;
        }

        if (applyNgramsForCurrentPath) {
          const ngramSizeForCurrentPath =
            keyConfig.ngramSize !== undefined
              ? keyConfig.ngramSize
              : mergedGlobalConfig.ngramSize;
          const minWordLengthForNgramsCurrentPath =
            keyConfig.minWordLengthForNgrams !== undefined
              ? keyConfig.minWordLengthForNgrams
              : mergedGlobalConfig.minWordLengthForNgrams;

          if (word.length >= minWordLengthForNgramsCurrentPath) {
            generateNgrams(word, ngramSizeForCurrentPath).forEach((ngram) =>
              allTokens.add(ngram),
            );
          }
        }

        if (mergedGlobalConfig.enableNumberExtraction) {
          const numberRegex = new RegExp(
            `\\d{${mergedGlobalConfig.minDigitsForNumberHandling},}`,
            'g',
          );
          const extractedNumbers = word.match(numberRegex);

          if (extractedNumbers) {
            extractedNumbers.forEach((numStr) => {
              if (mergedGlobalConfig.includeExactTokens) {
                allTokens.add(numStr);
              }
              if (applyNgramsForCurrentPath) {
                const ngramSizeForCurrentPath =
                  keyConfig.ngramSize !== undefined
                    ? keyConfig.ngramSize
                    : mergedGlobalConfig.ngramSize;
                const minWordLengthForNgramsCurrentPath =
                  keyConfig.minWordLengthForNgrams !== undefined
                    ? keyConfig.minWordLengthForNgrams
                    : mergedGlobalConfig.minWordLengthForNgrams;

                if (numStr.length >= minWordLengthForNgramsCurrentPath) {
                  generateNgrams(numStr, ngramSizeForCurrentPath).forEach(
                    (ngram) => allTokens.add(ngram),
                  );
                }
              }
            });
          }
        }
      }
    }
  }

  return {
    id: doc.id,
    searchTerms: Array.from(allTokens).filter((term) => term.length > 0),
  };
}
