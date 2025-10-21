import { expect, test } from 'vitest';
import { htmlNumberToSymbol } from './htmlNumberToSymbol';

test('htmlNumberToSymbol-123', () => {
	const text = '123';
	const result = htmlNumberToSymbol(text);
	expect(result).toBe('123');
});

test('htmlNumberToSymbol-123&nbsp;', () => {
	const text = '123&nbsp;';
	const result = htmlNumberToSymbol(text);
	expect(result).toBe('123 ');
});

test('htmlNumberToSymbol-123&&#198;', () => {
	const text = '123&#198;';
	const result = htmlNumberToSymbol(text);
	console.log(result);
	expect(result).toEqual('123ã');
});
