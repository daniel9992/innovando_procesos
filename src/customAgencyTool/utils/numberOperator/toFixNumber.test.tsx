import { expect } from 'vitest';
import { toFixedNumber } from './toFixNumber';

describe('toFixedNumber()', () => {
	it('toFixedNumber-string with length less than 2', () => {
		const result = toFixedNumber(0, 2);
		expect(result).toBe(0);
	});

	it('toFixedNumber-string with length greater than 2', () => {
		const result = toFixedNumber(123.123456, 2);
		expect(result).toBe(123.12);
	});

	it('toFixedNumber-string with 2 decimal points', () => {
		const result = toFixedNumber(12345678.55, 2);
		expect(result).toBe(12345678.55);
	});

	it('toFixedNumber-string with 0 decimal points', () => {
		const result = toFixedNumber(1234567.0, 2);
		expect(result).toBe(1234567);
	});

	it('toFixedNumber-string with 3 numbers', () => {
		const result = toFixedNumber(123, 2);
		expect(result).toBe(123);
	});
});
