const capitalize = (text: string): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.toLowerCase().slice(1);
};

const LOWERCASE_WORDS = new Set([
    'de',
    'del',
    'la',
    'las',
    'los',
    'y',
    'e',
    'o',
    'u'
]);

export const capitalizeWords = (str: string): string => {
    if (!str) return '';

    return str
        .toLowerCase()
        .split(/\s+/)
        .map((word, index) =>
            index === 0 || !LOWERCASE_WORDS.has(word) ? capitalize(word) : word
        )
        .join(' ');
};
