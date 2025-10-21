import {
    type IObjectDate,
    NumberToDate,
    ObjectDate,
    StringDate
} from '../dayManagment/dayjsUtils';

type DateField =
    | 'date'
    | 'createAt'
    | 'createdAt'
    | 'dateOfarrival'
    | 'dateOfdeparture'
    | 'validupTo'
    | 'finishedDate'
    | 'lastUpdate'
    | 'fecha'
    | 'startDate'
    | 'endDate'
    | 'statusDate'
    | 'lastUdate'
    | 'expiration_date'
    | 'date_charged'
    | 'deliveredDate'
    | 'dateOfEntry'
    | 'dateOfInvoice'
    | 'dateCreateSummaryDoc'
    | 'updatedAt';

const dateFields: DateField[] = [
    'date',
    'createAt',
    'createdAt',
    'dateOfarrival',
    'dateOfdeparture',
    'validupTo',
    'finishedDate',
    'lastUpdate',
    'fecha',
    'startDate',
    'endDate',
    'statusDate',
    'lastUdate',
    'expiration_date',
    'date_charged',
    'deliveredDate',
    'dateOfEntry',
    'dateOfInvoice',
    'dateCreateSummaryDoc',
    'updatedAt'
];

/**
 * Recursively adapts a data object, converting specific string, number, or object fields into Date objects.
 *
 * @param data - The input data object to be adapted.
 * @returns The adapted data object with the converted date fields.
 */
export function adapterDate<T>(data: T): T {
    const convertDateFields = (item: Record<string, unknown>) => {
        dateFields.forEach((field) => {
            if (field in item) {
                const value = item[field];
                if (value instanceof Date) return; // Skip if already a Date object

                if (typeof value === 'string' && value !== '') {
                    item[field] = StringDate(value);
                } else if (typeof value === 'number') {
                    item[field] = NumberToDate(value);
                } else if (
                    typeof value === 'object' &&
                    value !== null &&
                    'seconds' in value &&
                    'nanoseconds' in value
                ) {
                    item[field] = ObjectDate(value as IObjectDate);
                }
                if (
                    typeof value === 'object' &&
                    value !== null &&
                    '_seconds' in value &&
                    '_nanoseconds' in value
                ) {
                    const newDate = {
                        seconds: value._seconds,
                        nanoseconds: value._nanoseconds
                    };
                    item[field] = ObjectDate(newDate as IObjectDate);
                }
            }
        });
    };

    const traverse = (obj: Record<string, unknown>) => {
        Object.values(obj).forEach((value) => {
            if (typeof value === 'object' && value !== null) {
                traverse(value as Record<string, unknown>); // Recurse for nested objects
            }
        });
        convertDateFields(obj);
    };

    if (typeof data === 'object' && data !== null) {
        traverse(data as Record<string, unknown>);
    }

    return data;
}

// /**
//  * This function adapts a data object to convert certain string date fields or date object to a date object.
//  *
//  * @param {any} data - The data object to be adapted.
//  *
//  * @returns {any} The adapted data object with the converted date fields.
//  */

// import {
// 	NumberToDate,
// 	ObjectDate,
// 	StringDate,
// } from '@tl_utils/dayManagment/dayjsUtils';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const adapterDate = (data: any) => {
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	const convertDateFields = (item: any) => {
// 		const fields = [
// 			'date',
// 			'createAt',
// 			'createdAt',
// 			'dateOfarrival',
// 			'dateOfdeparture',
// 			'validupTo',
// 			'finishedDate',
// 			'lastUpdate',
// 			'fecha',
// 			'startDate',
// 			'endDate',
// 			'statusDate',
// 			'lastUdate',
// 			'expiration_date',
// 			'date_charged',
// 		];
// 		fields.forEach((field) => {
// 			if (field in item) {
// 				if (item[field] instanceof Date) {
// 					// Omite si ya es una instancia de Date
// 					return;
// 				}
// 				if (typeof item[field] === 'string') {
// 					if (item[field] !== '') {
// 						const date = StringDate(item[field]);
// 						item[field] = date;
// 					}
// 				} else if (typeof item[field] === 'number') {
// 					const date = NumberToDate(item[field]);
// 					item[field] = date;
// 				} else if (typeof item[field] === 'object' && item[field] !== null) {
// 					const date = ObjectDate(item[field]);
// 					item[field] = date;
// 				}
// 			}
// 		});
// 	};

// 	/**
// 	 * En este código, he creado una función traverse que recorre recursivamente
// 	 * el objeto data y aplica convertDateFields a cada sub-objeto. De esta manera,
// 	 * la función AdapterDate puede manejar objetos anidados.
// 	 */
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	const traverse = (obj: any) => {
// 		for (const key in obj) {
// 			if (typeof obj[key] === 'object' && obj[key] !== null) {
// 				traverse(obj[key]);
// 			}
// 		}
// 		convertDateFields(obj);
// 	};

// 	traverse(data);

// 	return data;
// };
