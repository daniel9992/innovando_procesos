import { expect, test } from 'vitest';
import {
	clearLocalStorage,
	clearSessionStorage,
	getFromLocalStorage,
	getFromSessionStorage,
	persistLocalStorage,
	persistSessionStorage,
} from './manageStorage';

// -- Persist Local Storage
test('persistLocalStorage-getFromLocalStorage', () => {
	const key = 'test';
	const value = 'test';

	persistLocalStorage(key, value);

	const result = getFromLocalStorage(key);

	expect(result).toBe(value);

	clearLocalStorage(key);
});

test('persistLocalStorage-getFromLocalStorage-null', () => {
	const key = 'test';
	const value = null;

	persistLocalStorage(key, value);

	const result = getFromLocalStorage(key);

	expect(result).toBe(value);

	clearLocalStorage(key);
});

test('persistLocalStorage-getFromLocalStorage-undefined', () => {
	const key = 'test';
	const value = undefined;

	const result = persistLocalStorage(key, value);

	expect(result).toBe(value);

	clearLocalStorage(key);
});

test('persistLocalStorage-getFromLocalStorage custom object with string', () => {
	const key = 'test';
	const value = { test: 'test' };

	persistLocalStorage(key, value);

	const result = getFromLocalStorage(key);

	expect(result).toStrictEqual(value);

	clearLocalStorage(key);
});

/**
 *  --- Persist Session Storage ---
 */

test('persistSessionStorage-getFromSessionStorage', () => {
	const key = 'test';
	const value = 'test';

	persistSessionStorage(key, value);

	const result = getFromSessionStorage(key);

	expect(result).toBe(value);

	clearSessionStorage(key);
});

test('persistSessionStorage-getFromSessionStorage-null', () => {
	const key = 'test';

	const value = null;

	persistSessionStorage(key, value);

	const result = getFromSessionStorage(key);

	expect(result).toBe(value);

	clearSessionStorage(key);
});

test('persistSessionStorage-getFromSessionStorage-undefined', () => {
	const key = 'test';
	const value = undefined;

	const result = persistSessionStorage(key, value);

	expect(result).toBe(value);

	clearSessionStorage(key);
});

test('persistSessionStorage-getFromSessionStorage custom object with string', () => {
	const key = 'test';
	const value = { test: 'test' };

	persistSessionStorage(key, value);

	const result = getFromSessionStorage(key);

	expect(result).toStrictEqual(value);

	clearSessionStorage(key);
});
