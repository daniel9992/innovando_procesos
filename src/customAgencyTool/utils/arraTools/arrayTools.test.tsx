import { expect } from 'vitest';
import {
	DividerLinesPerLinesAvailable,
	removeDuplicates,
	removeDuplicatesByKey,
	SortArrayByKey,
} from './arrayTools';

describe('ArrayTools', () => {
	/*
	 *  -/- Pruebas exitosas -/-
	 */
	/**
	 *  Prueba la función removeDuplicates
	 */

	it('removeDuplicates', () => {
		const array = [{ a: 1 }, { b: 2 }, { a: 1 }];
		const result = removeDuplicates(array);
		expect(result).toEqual([{ a: 1 }, { b: 2 }]);
	});

	/**
	 *  Prueba la función removeDuplicatesByKey
	 */
	it('removeDuplicatesByKey', () => {
		const array = [
			{ id: 1, value: 'a' },
			{ id: 2, value: 'b' },
			{ id: 1, value: 'c' },
		];
		const result = removeDuplicatesByKey(array, 'id');
		expect(result).toEqual([
			{ id: 1, value: 'a' },
			{ id: 2, value: 'b' },
		]);
	});

	/**
	 *  Prueba la función SortArrayByKey
	 */
	it('SortArrayByKey', () => {
		const array = [
			{ id: 'item2', value: 'b' },
			{ id: 'item1', value: 'a' },
			{ id: 'item3', value: 'c' },
		];
		const result = SortArrayByKey(array, 'id', 'asc');
		const expected = [
			{ id: 'item1', value: 'a' },
			{ id: 'item2', value: 'b' },
			{ id: 'item3', value: 'c' },
		];
		expect(result).toStrictEqual(expected);
	});

	/*
	 *  -/- Pruebas fallidas -/-
	 */
	/**
	 *  Prueba la función removeDuplicates
	 */
	it('removeDuplicatesFail', () => {
		const array = [{ a: 1 }, { b: 2 }, { a: 1 }];
		const result = removeDuplicates(array);
		expect(result).toEqual([{ a: 1 }, { b: 2 }]);
	});

	/**
	 *  Prueba la función removeDuplicatesByKey
	 */
	it('removeDuplicatesByKeyFail', () => {
		const array = [
			{ id: 1, value: 'a' },
			{ id: 2, value: 'b' },
			{ id: 1, value: 'c' },
		];
		const result = removeDuplicatesByKey(array, 'id');
		expect(result).toEqual([
			{ id: 1, value: 'a' },
			{ id: 2, value: 'b' },
		]);
	});

	/**
	 *  Prueba la función SortArrayByKey
	 */
	it('SortArrayByKey with wrong key', () => {
		const array = [
			{ id: 'item2', value: 'b' },
			{ id: 'item1', value: 'a' },
			{ id: 'item3', value: 'c' },
		];
		const result = SortArrayByKey(array, 'name', 'asc');
		expect(result).toEqual([
			{ id: 'item2', value: 'b' },
			{ id: 'item1', value: 'a' },
			{ id: 'item3', value: 'c' },
		]);
	});

	it('SortArrayByKey with regex on id', () => {
		const array = [
			{ id: 'id-003', name: 'b' },
			{ id: 'id-001', name: 'a' },
			{ id: 'id-002', name: 'c' },
		];
		// Regex to extract the number from format 'id-001'
		const idRegex = /id-(\d+)/;

		const result = SortArrayByKey(array, 'id', 'asc', idRegex);

		expect(result).toEqual([
			{ id: 'id-001', name: 'a' },
			{ id: 'id-002', name: 'c' },
			{ id: 'id-003', name: 'b' },
		]);
	});

	/**
	 *  Prueba la función DividerLinesPerLinesAvailable
	 *  Se divide un array en dos arrays de un tamaño determinado
	 */
	it('DividerLinesPerLinesAvailable', () => {
		const lines = [
			{ id: 1, value: 'a' },
			{ id: 2, value: 'b' },
			{ id: 3, value: 'c' },
		];

		const result = DividerLinesPerLinesAvailable({
			lines: lines,
			linesAvailable: 2,
		});

		expect(result).toEqual([
			[
				{ id: 1, value: 'a' },
				{ id: 2, value: 'b' },
			],
			[{ id: 3, value: 'c' }],
		]);
	});
});
