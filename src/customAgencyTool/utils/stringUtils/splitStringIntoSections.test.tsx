import { expect, test } from 'vitest';
import { splitStringIntoSections } from './splitStringIntoSections';

test('splitStringIntoSections-string with length less than 2', () => {
	const str = 'a';
	const result = splitStringIntoSections(str, 1);
	expect(result).toEqual(['a']);
});

test('splitStringIntoSections-string with length greater than 2', () => {
	const str = 'abcdef';
	const result = splitStringIntoSections(str, 2);
	expect(result).toEqual(['ab', 'cd', 'ef']);
});

test('splitStringIntoSections-string with length equal to 2', () => {
	const str = 'abcdef';
	const result = splitStringIntoSections(str, 3);
	expect(result).toEqual(['abc', 'def']);
});

test('splitStringIntoSections-string with length equal to 1', () => {
	const str = 'abcdef';
	const result = splitStringIntoSections(str, 4);
	expect(result).toEqual(['abcd', 'ef']);
});
