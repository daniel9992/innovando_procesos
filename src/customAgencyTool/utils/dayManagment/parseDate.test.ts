import dayjs from 'dayjs';
import { parseDate } from './parseDate';

describe('parseDate', () => {
	it('should return undefined for invalid date', () => {
		const str = '2023-04-26T12:00:00';
		const result = parseDate(str);
		const expectedResult = dayjs(str).toDate();
		expect(result).toStrictEqual(expectedResult);
	});
	it('should return undefined for invalid number', () => {
		const str = 16780480000001;
		const result = parseDate(str);
		expect(result).toBeUndefined();
	});
	it('should return undefined for invalid string', () => {
		const str = 'invalid-date';
		const result = parseDate(str);
		expect(result).toBeUndefined();
	});

	it('should return date for YYYY-MM-DD', () => {
		const str = '2025-03-31';
		const result = parseDate(str);
		const expectedResult = dayjs(str).toDate();
		expect(result).toStrictEqual(expectedResult);
	});

	it('should return undefined for DD/MM/YYYY', () => {
		const str = '31/03/2025';
		const result = parseDate(str);
		expect(result).toBeUndefined();
	});

	it('should return undefined for D/M/YYYY', () => {
		const str = '31/3/2025';
		const result = parseDate(str);
		expect(result).toBeUndefined();
	});

	it('should return undefined for D/MM/YYYY', () => {
		const str = '31/03/2025';
		const result = parseDate(str);
		expect(result).toBeUndefined();
	});

	it('should return undefined for DD/M/YYYY', () => {
		const str = '31/03/2025';
		const result = parseDate(str);
		expect(result).toBeUndefined();
	});

	it('should return date for YYYY/MM/DD', () => {
		const str = '2025/03/31';
		const result = parseDate(str);
		const expectedResult = dayjs(str).toDate();
		expect(result).toStrictEqual(expectedResult);
	});

	it('should return date for MM-DD-YYYY', () => {
		const str = '03-31-2025';
		const result = parseDate(str);
		const expectedResult = dayjs(str).toDate();
		expect(result).toStrictEqual(expectedResult);
	});

	it('should return undefined for invalid string case 1', () => {
		const str = 'id-2';
		const result = parseDate(str);
		expect(result).toBeUndefined();
	});
});
