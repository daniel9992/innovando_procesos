import { STOP_WORDS } from './stopWords/stopWords';

/**
 * Filters out stop-words from a normalized string.
 * @param str Normalized string.
 * @return String without stop-words.
 */

export const removeStopWords = (
  str: string,
  stopWordsSet: Set<string> = STOP_WORDS,
): string => {
  return str
    .split(' ')
    .filter((word) => !stopWordsSet.has(word.toLowerCase()))
    .join(' ');
};
