import { expect, test } from 'vitest';
import { MaxLetterToShowStr, StartWithUpperCase } from './maxLetterToShowStr';

test('maxLetterToShowStr-the-Rush', () => {
	const text = 'the Rush';
	const result = MaxLetterToShowStr(text, 3);
	console.log(result);
	expect(result).toBe('the...');
});

test('maxLetterToShowStr-the-Rush-2', () => {
	const text = 'the Rush';
	const result = StartWithUpperCase(text);
	console.log(result);
	expect(result).toBe('The Rush');
});
