import {
    ReduxPosition,
    ReduxStatus
} from '@src/customAgencyTool/constants/reduxConstants';
import { db } from '@src/customAgencyTool/core';
import { adapterDate } from '@src/customAgencyTool/utils/adapter';
import {
    collection,
    getDocs,
    limit,
    query,
    where,
    type Query
} from 'firebase/firestore';
import {
    HandledNotification,
    type InterfaceDocReturn,
    type InterfaceInstructionsProps
} from './iCrud';

const isOffline = false;
const LIMIT_PER_ITEM = 50;

function isNumber(value?: string | number): boolean {
    if (value == null || value === '') return false;
    return /^-?\d*\.?\d+$/.test(value.toString());
}

const queryLikeNumber = (
    field: string,
    queryString: string | number,
    collectionName: string
): Query => {
    return query(
        collection(db, collectionName),
        where(field, '==', parseFloat(queryString as string)),
        limit(LIMIT_PER_ITEM)
    );
};

const queryLikeString = (
    field: string,
    queryString: string | number,
    collectionName: string
): Query => {
    return query(
        collection(db, collectionName),
        where(field, '>=', queryString),
        where(field, '<=', queryString + '\uf8ff'),
        limit(LIMIT_PER_ITEM)
    );
};

const queryLikeArray = (
    field: string,
    queryString: string | number,
    collectionName: string
): Query => {
    return query(
        collection(db, collectionName),
        where(field, 'array-contains', queryString),
        limit(LIMIT_PER_ITEM)
    );
};

const createQuery = (
    field: string,
    queryString: string | number,
    collectionName: string
): Query => {
    if (isNumber(queryString)) {
        return queryLikeNumber(field, queryString, collectionName);
    }

    if (field.endsWith('List')) {
        return queryLikeArray(field, queryString, collectionName);
    }

    return queryLikeString(field, queryString, collectionName);
};

export async function SearchToSpecificCollection({
    collectionName,
    queryString,
    searchArrayKeys,
    searchLikeA = [],

    isNotification = false,
    notification = {}
}: InterfaceInstructionsProps): Promise<InterfaceDocReturn> {
    try {
        // Verificar conexión a internet del tipo test
        if (isOffline) {
            throw new Error('No hay conexión a internet');
        }
        // Verificar conexión a internet
        if (!navigator.onLine) {
            // lanzar error si no hay conexión
            throw new Error('No hay conexión a internet');
        }

        if (!collectionName || !queryString || !searchArrayKeys) {
            throw new Error('Falta información');
        }

        const queries = [];

        // searchLikeA more than one
        if (searchLikeA.length > 0) {
            // lanzar error si no tiene el mismo numero de elementos
            if (searchLikeA.length !== searchArrayKeys.length) {
                throw new Error('Falta información');
            }

            type SearchResult = {
                _seachLikeA: string;
                _searchArrayKeys: string;
            };

            const createSearchResult = (
                searchArrayKeys: string[],
                searchLikeA: string[]
            ): SearchResult[] => {
                if (searchArrayKeys.length !== searchLikeA.length) {
                    throw new Error(
                        'Both arrays must have the same length'
                    );
                }

                return searchArrayKeys.map((key, index) => ({
                    _seachLikeA: key,
                    _searchArrayKeys: searchLikeA[index]
                }));
            };

            const result = createSearchResult(
                searchArrayKeys,
                searchLikeA
            );

            for (const item of result) {
                switch (item._searchArrayKeys) {
                    case 'string':
                        queries.push(
                            queryLikeString(
                                item._seachLikeA,
                                queryString,
                                collectionName
                            )
                        );
                        break;
                    case 'number':
                        queries.push(
                            queryLikeNumber(
                                item._seachLikeA,
                                queryString,
                                collectionName
                            )
                        );
                        // Todo: add both number and string
                        // queries.push(
                        // 	queryLikeString(item._seachLikeA, queryString, collectionName)
                        // );
                        break;
                    case 'list':
                        queries.push(
                            queryLikeArray(
                                item._seachLikeA,
                                queryString,
                                collectionName
                            )
                        );
                        break;
                    default:
                        throw new Error('Invalid type');
                }
            }
        }

        // searchLikeA lest than one
        if (searchLikeA.length === 0) {
            for (const item of searchArrayKeys) {
                queries.push(
                    createQuery(item, queryString, collectionName)
                );
            }
        }

        const promiseResult: Array<Record<string, unknown>> = [];

        try {
            const querySnapshots = await Promise.all(
                queries.map((query) => getDocs(query))
            );
            for (const querySnapshot of querySnapshots) {
                querySnapshot.forEach((doc) => {
                    let temp = {
                        ...doc.data(),
                        id: doc.id
                    };
                    temp = adapterDate(temp);
                    promiseResult.push(temp);
                });
            }
        } catch (error) {
            console.error(error);
            const localError = error as Error;
            throw localError;
        }

        const result: InterfaceDocReturn = {
            notification: HandledNotification(
                'searchArrayKeys',
                isNotification,
                'Importante',
                `Se encontraron ${promiseResult.length} documentos.`,
                ReduxStatus.SUCCESS,
                ReduxPosition.bottomRight,
                notification
            ),
            result: promiseResult
        };

        return result;
    } catch (error) {
        console.error(error);
        const localError = error as Error;
        throw localError;
    }
}

export async function GetTheDateRangeToSpecificCollection({
    collectionName,
    values,
    searchKey,
    extraWhere,

    isNotification = false,
    notification = {}
}: InterfaceInstructionsProps): Promise<InterfaceDocReturn> {
    try {
        // Verificar conexión a internet del tipo test
        if (isOffline) {
            throw new Error('No hay conexión a internet');
        }
        // Verificar conexión a internet
        if (!navigator.onLine) {
            // lanzar error si no hay conexión
            throw new Error('No hay conexión a internet');
        }

        if (!collectionName || !values || !searchKey) {
            throw new Error('Falta información');
        }

        const docRef = collection(db, collectionName);

        const keyToSearch = searchKey ? searchKey : 'date';

        const whereList = [
            where(keyToSearch, '>=', values.date),
            where(keyToSearch, '<=', values.endDate)
        ];

        if (extraWhere) {
            const newWhere = where(
                extraWhere.fieldPath,
                extraWhere.opStr,
                extraWhere.value
            );

            whereList.push(newWhere);
        }

        const q = query(
            docRef,
            // orderBy(keyToSearch, 'desc'),
            // where(keyToSearch, '>=', values.date),
            // where(keyToSearch, '<=', values.endDate),
            ...whereList
        );

        const querySnapshot = await getDocs(q);

        const results = querySnapshot.docs
            .map((doc) => {
                const data = doc.data();

                return {
                    ...data,
                    id: doc.id
                };
            })
            .map(adapterDate);

        const result: InterfaceDocReturn = {
            notification: HandledNotification(
                'GetTheDateRangeToSpecificCollection',
                isNotification,
                'Importante',
                `Se encontro ${results.length} resultados.`,
                ReduxStatus.SUCCESS,
                ReduxPosition.bottomRight,
                notification
            ),
            result: results
        };

        return result;
    } catch (error) {
        console.error(error);
        const localError = error as Error;
        throw localError;
    }
}
