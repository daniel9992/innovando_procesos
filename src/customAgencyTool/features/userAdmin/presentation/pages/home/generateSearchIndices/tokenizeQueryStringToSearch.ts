import { getNormalizedString } from './getNormalizedString';
import { soundex } from './soundex';

// Tokenize a query string into a set of search tokens
// @param queryString The query string to tokenize
// @return A set of search tokens

export const tokenizeQueryStringToSearch = (queryString: string) => {
  // step 1 -  Normalize the string
  const normalized = getNormalizedString(queryString);

  // step 2 - Soundex
  const soundDex = soundex(normalized);

  // step 3 - Split the string into an array of words
  const searchArray = [...normalized.split(' '), ...soundDex.split(' ')];

  // step 4 - Create a set of unique tokens
  const tokens = new Set<string>(searchArray);

  // step 5 - Return the set of tokens
  return [...tokens];
};
