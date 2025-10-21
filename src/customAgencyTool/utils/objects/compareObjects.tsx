import { CompareDates } from '../dayManagment/dayjsUtils';

interface Change {
    indexLine?: number;
    modifiedKey: string;
    newValue: any;
    arrayName?: string;
}

export function CompareObjects(
    obj1: any,
    obj2: any,
    ignoreKeys: string[] = [],
    parentKey?: string,
    isArrayElement: boolean = false
): Change[] {
    const changes: Change[] = [];

    for (const key in obj1) {
        if (ignoreKeys.includes(key)) {
            continue;
        }

        if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
            if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
                const subChanges = CompareArrays(obj1[key], obj2[key], key);
                if (subChanges.length > 0) {
                    subChanges.forEach((item) => {
                        changes.push(item);
                    });
                }
            } else if (
                typeof obj1[key] === 'object' &&
                typeof obj2[key] === 'object' &&
                obj1[key] !== null &&
                obj2[key] !== null
            ) {
                const subChanges = CompareObjects(
                    obj1[key],
                    obj2[key],
                    ignoreKeys,
                    key,
                    isArrayElement
                );
                if (subChanges.length > 0) {
                    subChanges.forEach((item) => {
                        changes.push(item);
                    });
                }
            } else if (obj1[key] instanceof Date && obj2[key] instanceof Date) {
                if (CompareDates(obj1[key], obj2[key]) !== 0) {
                    changes.push({
                        modifiedKey: key,
                        newValue: obj2[key],
                        ...(isArrayElement ? { arrayName: parentKey } : {})
                    });
                }
            } else if (obj1[key] !== obj2[key]) {
                changes.push({
                    modifiedKey: key,
                    newValue: obj2[key],
                    ...(isArrayElement ? { arrayName: parentKey } : {})
                });
            }
        } else if (obj1.hasOwnProperty(key)) {
            changes.push({
                modifiedKey: key,
                newValue: null,
                ...(isArrayElement ? { arrayName: parentKey } : {})
            });
        } else if (obj2.hasOwnProperty(key)) {
            changes.push({
                modifiedKey: key,
                newValue: obj2[key],
                ...(isArrayElement ? { arrayName: parentKey } : {})
            });
        }
    }

    for (const key in obj2) {
        if (
            !obj1.hasOwnProperty(key) &&
            obj2.hasOwnProperty(key) &&
            !ignoreKeys.includes(key)
        ) {
            changes.push({
                modifiedKey: key,
                newValue: obj2[key],
                ...(isArrayElement ? { arrayName: parentKey } : {})
            });
        }
    }

    return changes;
}

export function CompareArrays(
    array1: any[],
    array2: any[],
    arrayName?: string
): Change[] {
    function isArrayObjetos(array: any[]): boolean {
        return (
            Array.isArray(array) &&
            array.every(
                (item) =>
                    typeof item === 'object' &&
                    item !== null &&
                    !Array.isArray(item)
            )
        );
    }

    function isArrayStrings(array: any[]): boolean {
        return (
            Array.isArray(array) &&
            array.every((item) => typeof item === 'string')
        );
    }

    const isArrayObj1 = isArrayObjetos(array1);
    const isArrayStr1 = isArrayStrings(array1);

    const isArrayObj2 = isArrayObjetos(array2);
    const isArrayStr2 = isArrayStrings(array2);

    if (isArrayObj1 && isArrayObj2) {
        const changes: Change[] = [];

        for (
            let index = 0;
            index < Math.max(array1.length, array2.length);
            index++
        ) {
            const item1 = array1[index] || {};
            const item2 = array2[index] || {};

            const changesInObject = CompareObjects(
                item1,
                item2,
                [],
                arrayName,
                true
            );

            if (changesInObject.length > 0) {
                changesInObject.forEach((item) => {
                    item.indexLine = index;
                    item.arrayName = arrayName;
                    changes.push(item);
                });
            }
        }

        return changes;
    }

    function compareStringArrays(array1: string[], array2: string[]): Change[] {
        const diferencias: Change[] = [];
        const maxLength = Math.max(array1.length, array2.length);

        for (let i = 0; i < maxLength; i++) {
            if (array1[i] !== array2[i]) {
                diferencias.push({
                    indexLine: i,
                    modifiedKey: 'array2',
                    newValue: array2[i],
                    arrayName
                });
            }
        }

        return diferencias;
    }

    if (isArrayStr1 && isArrayStr2) {
        return compareStringArrays(array1 as string[], array2 as string[]);
    }

    return [];
}

// interface Change<T> {
// 	indexLine?: number;
// 	modifiedKey: string;
// 	newValue: T;
// 	arrayName?: string;
// }

// export function CompareObjects<T>(
// 	obj1: Record<string, T>,
// 	obj2: Record<string, T>,
// 	ignoreKeys: string[] = [],
// 	parentKey?: string,
// 	isArrayElement: boolean = false
// ): Change<T>[] {
// 	const changes: Change<T>[] = [];

// 	for (const key in obj1) {
// 		if (ignoreKeys.includes(key)) {
// 			continue;
// 		}

// 		if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
// 			if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
// 				const subChanges = CompareArrays(obj1[key], obj2[key], key);
// 				if (subChanges.length > 0) {
// 					subChanges.forEach((item) => {
// 						changes.push(item);
// 					});
// 				}
// 			} else if (
// 				typeof obj1[key] === 'object' &&
// 				typeof obj2[key] === 'object' &&
// 				obj1[key] !== null &&
// 				obj2[key] !== null
// 			) {
// 				const subChanges = CompareObjects(
// 					obj1[key],
// 					obj2[key],
// 					ignoreKeys,
// 					key,
// 					isArrayElement
// 				);
// 				if (subChanges.length > 0) {
// 					subChanges.forEach((item) => {
// 						changes.push(item);
// 					});
// 				}
// 			} else if (obj1[key] instanceof Date && obj2[key] instanceof Date) {
// 				if (CompareDates(obj1[key], obj2[key]) !== 0) {
// 					changes.push({
// 						modifiedKey: key,
// 						newValue: obj2[key],
// 						...(isArrayElement ? { arrayName: parentKey } : {}),
// 					});
// 				}
// 			} else if (obj1[key] !== obj2[key]) {
// 				changes.push({
// 					modifiedKey: key,
// 					newValue: obj2[key],
// 					...(isArrayElement ? { arrayName: parentKey } : {}),
// 				});
// 			}
// 		} else if (obj1.hasOwnProperty(key)) {
// 			changes.push({
// 				modifiedKey: key,
// 				newValue: null as T,
// 				...(isArrayElement ? { arrayName: parentKey } : {}),
// 			});
// 		} else if (obj2.hasOwnProperty(key)) {
// 			changes.push({
// 				modifiedKey: key,
// 				newValue: obj2[key],
// 				...(isArrayElement ? { arrayName: parentKey } : {}),
// 			});
// 		}
// 	}

// 	for (const key in obj2) {
// 		if (
// 			!obj1.hasOwnProperty(key) &&
// 			obj2.hasOwnProperty(key) &&
// 			!ignoreKeys.includes(key)
// 		) {
// 			changes.push({
// 				modifiedKey: key,
// 				newValue: obj2[key],
// 				...(isArrayElement ? { arrayName: parentKey } : {}),
// 			});
// 		}
// 	}

// 	return changes;
// }

// export function CompareArrays<T>(
// 	array1: T[],
// 	array2: T[],
// 	arrayName?: string
// ): Change<T>[] {
// 	function isArrayObjetos(array: T[]): boolean {
// 		return (
// 			Array.isArray(array) &&
// 			array.every(
// 				(item) => typeof item === 'object' && item !== null && !Array.isArray(item)
// 			)
// 		);
// 	}

// 	function isArrayStrings(array: T[]): boolean {
// 		return Array.isArray(array) && array.every((item) => typeof item === 'string');
// 	}

// 	const isArrayObj1 = isArrayObjetos(array1);
// 	const isArrayStr1 = isArrayStrings(array1);

// 	const isArrayObj2 = isArrayObjetos(array2);
// 	const isArrayStr2 = isArrayStrings(array2);

// 	if (isArrayObj1 && isArrayObj2) {
// 		const changes: Change<T>[] = [];

// 		for (let index = 0; index < Math.max(array1.length, array2.length); index++) {
// 			const item1 = array1[index] || ({} as T);
// 			const item2 = array2[index] || ({} as T);

// 			const changesInObject = CompareObjects(item1, item2, [], arrayName, true);

// 			if (changesInObject.length > 0) {
// 				changesInObject.forEach((item) => {
// 					item.indexLine = index;
// 					item.arrayName = arrayName;
// 					changes.push(item);
// 				});
// 			}
// 		}

// 		return changes;
// 	}

// 	function compareStringArrays(array1: string[], array2: string[]): Change<string>[] {
// 		const diferencias: Change<string>[] = [];
// 		const maxLength = Math.max(array1.length, array2.length);

// 		for (let i = 0; i < maxLength; i++) {
// 			if (array1[i] !== array2[i]) {
// 				diferencias.push({
// 					indexLine: i,
// 					modifiedKey: 'array2',
// 					newValue: array2[i],
// 					arrayName,
// 				});
// 			}
// 		}

// 		return diferencias;
// 	}

// 	if (isArrayStr1 && isArrayStr2) {
// 		return compareStringArrays(
// 			array1 as unknown as string[],
// 			array2 as unknown as string[]
// 		);
// 	}

// 	return [];
// }
/*
import { CompareDates } from '@tl_utils/dayManagment/dayjsUtils';

interface Change {
	indexLine?: number;
	modifiedKey: string;
	newValue: any;
	arrayName?: string;
}

export function CompareObjects(
	obj1: Record<string, any>,
	obj2: Record<string, any>,
	ignoreKeys: string[] = [],
	parentKey?: string,
	isArrayElement: boolean = false
): Change[] {
	const changes: Change[] = [];

	const addChange = (key: string, newValue: any) => {
		changes.push({
			modifiedKey: key,
			newValue,
			...(isArrayElement ? { arrayName: parentKey } : {}),
		});
	};

	Object.keys({ ...obj1, ...obj2 }).forEach((key) => {
		if (ignoreKeys.includes(key)) return;

		const value1 = obj1[key];
		const value2 = obj2[key];

		if (value1 instanceof Date && value2 instanceof Date) {
			if (CompareDates(value1, value2) !== 0) addChange(key, value2);
		} else if (Array.isArray(value1) && Array.isArray(value2)) {
			CompareArrays(value1, value2, key).forEach((change) =>
				changes.push(change)
			);
		} else if (
			typeof value1 === 'object' &&
			typeof value2 === 'object' &&
			value1 &&
			value2
		) {
			CompareObjects(value1, value2, ignoreKeys, key, isArrayElement).forEach(
				(change) => changes.push(change)
			);
		} else if (value1 !== value2) {
			addChange(key, obj2.hasOwnProperty(key) ? value2 : null);
		}
	});

	return changes;
}

export function CompareArrays(
	array1: any[],
	array2: any[],
	arrayName?: string
): Change[] {
	const isArrayOfType = (array: any[], typeCheck: (item: any) => boolean) =>
		Array.isArray(array) && array.every(typeCheck);

	const isArrayObjetos = (array: any[]): boolean =>
		isArrayOfType(array, (item) => typeof item === 'object' && item !== null);

	const isArrayStrings = (array: any[]): boolean =>
		isArrayOfType(array, (item) => typeof item === 'string');

	if (isArrayObjetos(array1) && isArrayObjetos(array2)) {
		return array1
			.map((_, index) => {
				const item1 = array1[index] || {};
				const item2 = array2[index] || {};

				return CompareObjects(item1, item2, [], arrayName, true).map(
					(change) => ({
						...change,
						indexLine: index,
						arrayName,
					})
				);
			})
			.flat();
	}

	if (isArrayStrings(array1) && isArrayStrings(array2)) {
		return compareStringArrays(
			array1 as string[],
			array2 as string[],
			arrayName
		);
	}

	return [];
}

function compareStringArrays(
	array1: string[],
	array2: string[],
	arrayName?: string
): Change[] {
	const differences: Change[] = [];
	const maxLength = Math.max(array1.length, array2.length);

	for (let i = 0; i < maxLength; i++) {
		if (array1[i] !== array2[i]) {
			differences.push({
				indexLine: i,
				modifiedKey: 'arrayElement',
				newValue: array2[i],
				arrayName,
			});
		}
	}

	return differences;
}
*/

/*
import { CompareDates } from '@tl_utils/dayManagment/dayjsUtils';

interface Change {
	indexLine?: number;
	modifiedKey: string;
	newValue: unknown;
	arrayName?: string;
}

type CompareValue = Record<string, unknown> | unknown[] | Date | primitive;
type primitive = string | number | boolean | null | undefined;

export function CompareObjects<T extends Record<string, unknown>>(
	obj1: T,
	obj2: T,
	ignoreKeys: string[] = [],
	parentKey?: string,
	isArrayElement = false
): Change[] {
	if (!obj1 || !obj2) {
		throw new Error('Objects to compare cannot be null or undefined');
	}

	const changes: Change[] = [];
	const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);

	for (const key of allKeys) {
		if (ignoreKeys.includes(key)) continue;

		const value1 = obj1[key];
		const value2 = obj2[key];

		if (!hasOwnProperty(obj1, key)) {
			changes.push(createChange(key, value2, parentKey, isArrayElement));
			continue;
		}

		if (!hasOwnProperty(obj2, key)) {
			changes.push(createChange(key, null, parentKey, isArrayElement));
			continue;
		}

		const difference = compareValues(
			value1,
			value2,
			key,
			ignoreKeys,
			isArrayElement
		);
		if (difference.length > 0) {
			changes.push(...difference);
		}
	}

	return changes;
}

function compareValues(
	value1: unknown,
	value2: unknown,
	key: string,
	ignoreKeys: string[],
	isArrayElement: boolean,
	parentKey?: string
): Change[] {
	if (isArray(value1) && isArray(value2)) {
		return CompareArrays(value1, value2, key);
	}

	if (isObject(value1) && isObject(value2)) {
		return CompareObjects(
			value1 as Record<string, unknown>,
			value2 as Record<string, unknown>,
			ignoreKeys,
			key,
			isArrayElement
		);
	}

	if (isDate(value1) && isDate(value2)) {
		return CompareDates(value1, value2) !== 0
			? [createChange(key, value2, parentKey, isArrayElement)]
			: [];
	}

	return value1 !== value2
		? [createChange(key, value2, parentKey, isArrayElement)]
		: [];
}

export function CompareArrays(
	array1: unknown[],
	array2: unknown[],
	arrayName?: string
): Change[] {
	if (!array1 || !array2) {
		throw new Error('Arrays to compare cannot be null or undefined');
	}

	if (isArrayOfObjects(array1) && isArrayOfObjects(array2)) {
		return compareObjectArrays(array1, array2, arrayName);
	}

	if (isArrayOfStrings(array1) && isArrayOfStrings(array2)) {
		return compareStringArrays(array1, array2, arrayName);
	}

	return [];
}

// Helper functions
function createChange(
	modifiedKey: string,
	newValue: unknown,
	parentKey?: string,
	isArrayElement = false
): Change {
	return {
		modifiedKey,
		newValue,
		...(isArrayElement && parentKey && { arrayName: parentKey }),
	};
}

function isArray(value: unknown): value is unknown[] {
	return Array.isArray(value);
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDate(value: unknown): value is Date {
	return value instanceof Date;
}

function hasOwnProperty<T>(obj: T, key: PropertyKey): key is keyof T {
	return Object.prototype.hasOwnProperty.call(obj, key);
}

function isArrayOfObjects(
	array: unknown[]
): array is Record<string, unknown>[] {
	return array.every((item) => isObject(item));
}

function isArrayOfStrings(array: unknown[]): array is string[] {
	return array.every((item) => typeof item === 'string');
}

function compareObjectArrays(
	array1: Record<string, unknown>[],
	array2: Record<string, unknown>[],
	arrayName?: string
): Change[] {
	const changes: Change[] = [];
	const maxLength = Math.max(array1.length, array2.length);

	for (let index = 0; index < maxLength; index++) {
		const item1 = array1[index] || {};
		const item2 = array2[index] || {};

		const objectChanges = CompareObjects(item1, item2, [], arrayName, true);

		if (objectChanges.length > 0) {
			changes.push(
				...objectChanges.map((change) => ({
					...change,
					indexLine: index,
					arrayName,
				}))
			);
		}
	}

	return changes;
}

function compareStringArrays(
	array1: string[],
	array2: string[],
	arrayName?: string
): Change[] {
	const changes: Change[] = [];
	const maxLength = Math.max(array1.length, array2.length);

	for (let i = 0; i < maxLength; i++) {
		if (array1[i] !== array2[i]) {
			changes.push({
				indexLine: i,
				modifiedKey: 'value',
				newValue: array2[i],
				arrayName,
			});
		}
	}

	return changes;
}
*/
