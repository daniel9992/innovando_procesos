import { expect } from 'vitest';
import { numberToFixSTR } from './numberToFixSTR';

describe('numberToFixSTR()', () => {
	it('numberToFixSTR-string with length less than 2', () => {
		const result = numberToFixSTR(0);
		expect(result).toBe('0.00');
	});

	it('numberToFixSTR-string with length greater than 2', () => {
		const result = numberToFixSTR(123456789);
		expect(result).toBe('123 456 789.00');
	});

	it('numberToFixSTR-string with 2 decimal points', () => {
		const result = numberToFixSTR(12345678.55);
		expect(result).toBe('12 345 678.55');
	});

	it('numberToFixSTR-string with 0 decimal points', () => {
		const result = numberToFixSTR(1234567.0);
		expect(result).toBe('1 234 567.00');
	});

	it('numberToFixSTR-string with 3 numbers', () => {
		const result = numberToFixSTR(123);
		expect(result).toBe('123.00');
	});
});
