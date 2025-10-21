/**
 *  GenerateNgrams
 *  Generates n-grams from a string
 *  @param str string to generate the index
 *  @param n number of n-grams to generate
 * 	@returns
 */

export const generateNgrams = (str: string, n = 3): string[] => {
  // N-gramas sobre texto limpio y sin espacios
  const cleanedStr = str.replace(/\s+/g, '').toLowerCase();
  if (cleanedStr.length < n) return cleanedStr.length > 0 ? [cleanedStr] : [];

  const ngrams: Set<string> = new Set();
  for (let i = 0; i <= cleanedStr.length - n; i++) {
    ngrams.add(cleanedStr.substring(i, i + n));
  }
  return Array.from(ngrams);
};
