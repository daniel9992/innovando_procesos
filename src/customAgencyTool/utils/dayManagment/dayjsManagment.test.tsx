import dayjs from 'dayjs';
import { expect, test } from 'vitest';
import { EnumActionDateManagement } from './dayjsEnum';
import { DateManagement } from './dayjsManagment';

test('DateManagement-SUM', () => {
	const date = DateManagement({
		action: EnumActionDateManagement.SUM,
		value1: new Date('2024-08-12'),
		value2: 5,
		language: 'es',
	});
	expect(date).toEqual(new Date('2024-08-17T00:00:00.000Z'));
});

test('DateManagement-LEST', () => {
	const date = DateManagement({
		action: EnumActionDateManagement.LEST,
		value1: new Date('2024-08-12'),
		value2: 5,
		language: 'es',
	});
	expect(date).toEqual(new Date('2024-08-07T00:00:00.000Z'));
});

test('DateManagement-MIDDLE', () => {
	const date = DateManagement({
		action: EnumActionDateManagement.END,
		value1: new Date('2024-08-12'),
	});
	//   expect(date).toEqual(new Date("2024-08-12T23:59:59.999Z"));
	expect(date).toEqual(new Date('2024-08-12T05:59:59.999Z'));
});

test('DateManagement-NUMBER', () => {
	const date = DateManagement({
		action: EnumActionDateManagement.NUMBER,
		value1: new Date('2024-08-12'),
		value2: 5,
		language: 'es',
	});
	expect(date).toEqual(Date.parse('2024-08-12'));
});

test('DateManagement-STRING', () => {
	const date = DateManagement({
		action: EnumActionDateManagement.STRING,
		value1: '2024-08-12',
		value2: 5,
		language: 'es',
	});
	expect(date).toEqual(new Date('2024-08-12T06:00:00.000Z'));
});

test('DateManagement-SHOW', () => {
	const date = DateManagement({
		action: EnumActionDateManagement.SHOW,
		value1: dayjs('2024-08-12').toDate(),
		value2: 'D [de] MMMM [del] YYYY',
		language: 'es',
	});
	expect(date).toBe('12 de agosto del 2024');
});

test('DateManagement-OBJECT', () => {
	const dateText = dayjs('2024-08-12');
	const date = DateManagement({
		action: EnumActionDateManagement.OBJECT,
		value1: '',
		dateObj: { seconds: dateText.valueOf() / 1000, nanoseconds: 0 },
		language: 'es',
	});
	expect(date).toEqual(dateText.toDate());
});

test('DateManagement-SELECTEDDATEISTODAY', () => {
	const date = DateManagement({
		action: EnumActionDateManagement.SELECTEDDATEISTODAY,
		value1: dayjs('2024-08-12').toDate(),
		value2: dayjs('2024-08-12').toDate(),
		language: 'es',
	});
	expect(date).toBe(-1);
});

/**
 *  ? -----------------------------
 *  *  CompareDates
 *  ? -----------------------------
 */
describe('DateManagement-COMPAREDATES', () => {
	it('CompareDate Same', () => {
		const date = DateManagement({
			action: EnumActionDateManagement.COMPAREDATES,
			value1: dayjs('2024-08-12').toDate(),
			value2: dayjs('2024-08-12').toDate(),
		});
		expect(date).toBe(0);
	});

	it('CompareDate Before', () => {
		const date = DateManagement({
			action: EnumActionDateManagement.COMPAREDATES,
			value1: dayjs('2024-08-12').toDate(),
			value2: dayjs('2024-08-11').toDate(),
		});
		expect(date).toBe(1);
	});

	it('CompareDate After', () => {
		const date = DateManagement({
			action: EnumActionDateManagement.COMPAREDATES,
			value1: dayjs('2024-08-12').toDate(),
			value2: dayjs('2024-08-13').toDate(),
		});
		expect(date).toBe(-1);
	});

	it('CompareDate Before with same date but different time', () => {
		const date = DateManagement({
			action: EnumActionDateManagement.COMPAREDATES,
			value1: dayjs('2024-08-12 10:00:00').toDate(),
			value2: dayjs('2024-08-12 09:00:00').toDate(),
		});
		expect(date).toBe(1);
	});

	it('CompareDate After with same date but different time', () => {
		const date = DateManagement({
			action: EnumActionDateManagement.COMPAREDATES,
			value1: dayjs('2024-08-12 10:00:00').toDate(),
			value2: dayjs('2024-08-12 10:00:00').toDate(),
		});
		expect(date).toBe(0);
	});

	it('CompareDate After with same date but different time', () => {
		const date = DateManagement({
			action: EnumActionDateManagement.COMPAREDATES,
			value1: dayjs('2024-08-12 10:00:00').toDate(),
			value2: dayjs('2024-08-12 23:00:00').toDate(),
		});
		expect(date).toBe(-1);
	});

	it('CompareDate before with milliseconds', () => {
		const date = DateManagement({
			action: EnumActionDateManagement.COMPAREDATES,
			value1: dayjs('2024-08-12 10:00:00').toDate(),
			value2: dayjs('2024-08-12 10:00:00').toDate(),
			value3: 'millisecond',
		});
		expect(date).toBe(0);
	});

	it('CompareDate after with milliseconds', () => {
		const date = DateManagement({
			action: EnumActionDateManagement.COMPAREDATES,
			value1: dayjs('2024-08-12 10:00:00').toDate(),
			value2: dayjs('2024-08-12 11:00:00').toDate(),
			value3: 'millisecond',
		});
		expect(date).toBe(-1);
	});

	it('CompareDate before with day', () => {
		const date = DateManagement({
			action: EnumActionDateManagement.COMPAREDATES,
			value1: dayjs('2024-08-12 10:00:00').toDate(),
			value2: dayjs('2024-08-12 09:00:00').toDate(),
			value3: 'day',
		});
		expect(date).toBe(0);
	});

	it('CompareDate after with day', () => {
		const date = DateManagement({
			action: EnumActionDateManagement.COMPAREDATES,
			value1: dayjs('2024-08-12 10:00:00').toDate(),
			value2: dayjs('2024-08-12 11:00:00').toDate(),
			value3: 'day',
		});
		expect(date).toBe(0);
	});

	it.only('Case 1', () => {
		const date = DateManagement({
			action: EnumActionDateManagement.COMPAREDATES,
			value1: dayjs('2025-03-11 23:59:59').toDate(),
			value2: dayjs('2025-03-11 11:57:53').toDate(),
			value3: 'day',
		});
		expect(date).toBe(0);
	});
});
