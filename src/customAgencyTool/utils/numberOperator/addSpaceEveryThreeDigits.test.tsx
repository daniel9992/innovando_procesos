import { expect } from 'vitest';
import { addSpacesEveryThreeDigits } from './addSpaceEveryThreeDigits';

describe('addSpaceEveryThreeDigits', () => {
	it('addSpacesEveryThreeDigits-string with length less than 2', () => {
		const result = addSpacesEveryThreeDigits(0);
		expect(result).toBe('0.00');
	});

	it('addSpacesEveryThreeDigits-string with length greater than 2', () => {
		const result = addSpacesEveryThreeDigits(123456789);
		expect(result).toBe('123 456 789.00');
	});

	it('addSpacesEveryThreeDigits-string with 2 decimal points', () => {
		const result = addSpacesEveryThreeDigits(12345678.55);
		expect(result).toBe('12 345 678.55');
	});

	it('addSpacesEveryThreeDigits-string with 0 decimal points', () => {
		const result = addSpacesEveryThreeDigits(1234567.0);
		expect(result).toBe('1 234 567.00');
	});
});
