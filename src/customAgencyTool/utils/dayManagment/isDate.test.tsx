import { isDate } from './isDate';

describe('isDate', () => {
	it('should return true YYYY-MM-DD', () => {
		expect(isDate('2025-03-31')).toBe(true);
	});
	it('should return true DD/MM/YYYY', () => {
		expect(isDate('31/03/2025')).toBe(true);
	});
	it('should return true D/M/YYYY', () => {
		expect(isDate('31/03/2025')).toBe(true);
	});
	it('should return true D/MM/YYYY', () => {
		expect(isDate('31/03/2025')).toBe(true);
	});
	it('should return true DD/M/YYYY', () => {
		expect(isDate('31/03/2025')).toBe(true);
	});
	it('should return true YYYY/MM/DD', () => {
		expect(isDate('2025/03/31')).toBe(true);
	});
	it('should return true MM-DD-YYYY', () => {
		expect(isDate('03-31-2025')).toBe(true);
	});

	it('should return true for valid date', () => {
		expect(isDate('2023-04-26')).toBe(true);
	});

	it('should return false for invalid date', () => {
		expect(isDate('2023-04-26T12:00:00')).toBe(false);
	});

	it('should return false for invalid number', () => {
		expect(isDate(10101)).toBe(false);
	});

	it('should return true for valid timestamp', () => {
		expect(isDate(1678048000000)).toBe(true);
	});

	it('should return false for invalid timestamp', () => {
		expect(isDate(16780480000001)).toBe(false);
	});

	it('should return false for invalid string', () => {
		expect(isDate('invalid-date')).toBe(false);
	});

	it('should return false for invalid string case 1', () => {
		expect(isDate('id-2')).toBe(false);
	});

	it('should return false for invalid string case 2', () => {
		expect(isDate('DUA 002-2025-123456')).toBe(false);
	});

	it('should return true for valid string case 3', () => {
		expect(isDate('31/03/2025')).toBe(true);
	});

	it('should return true for valid string case 4', () => {
		expect(isDate('4/04/2025')).toBe(true);
	});
});
