import {
    ReduxPosition,
    ReduxStatus
} from '@src/customAgencyTool/constants/reduxConstants';
import { db } from '@src/customAgencyTool/core';
import { adapterDate } from '@src/customAgencyTool/utils/adapter';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    QueryFieldFilterConstraint,
    where,
    type DocumentData
} from 'firebase/firestore';
import {
    HandledNotification,
    type InterfaceDocReturn,
    type InterfaceInstructionsProps
} from './iCrud';

const isOffline = false;

export async function ReadDocToSpecificCollection({
    collectionName,
    id,
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

        if (!collectionName || !id) {
            throw new Error('Falta información');
        }

        const docRef = doc(db, collectionName, id);

        const docSnap = await getDoc(docRef);

        const notificationIdLocal = id;
        const notificationTitleLocal = 'Documento encontrado';
        const notificationMessageLocal = 'Se se encontro el documento';
        const notificationStatusLocal = ReduxStatus.SUCCESS;
        const notificationPositionLocal = ReduxPosition.bottomRight;

        const result: InterfaceDocReturn = {
            notification: HandledNotification(
                notificationIdLocal,
                isNotification,
                notificationTitleLocal,
                notificationMessageLocal,
                notificationStatusLocal,
                notificationPositionLocal,
                notification
            ),
            result: {}
        };

        if (docSnap.exists()) {
            const data = {
                ...docSnap.data(),
                id: docSnap.id
            };

            const copyData = { ...data };

            const dataRead = adapterDate(copyData);

            // se encontro el documento
            result.result = dataRead;
        } else {
            // no se encontro el documento
            result.result = {};
            result.notification.title = 'No se encontro el documento';
            result.notification.message = 'No se encontro el documento';
            result.notification.status = ReduxStatus.WARNING;
        }

        return result;
    } catch (error) {
        console.error(error);
        const localError = error as Error;
        throw localError;
    }
}

export async function ReadDocToSpecificCollectionByArrayIds({
    collectionName,
    searchArrayKeys,

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

        if (!collectionName) {
            throw new Error('Falta información');
        }

        if (
            !searchArrayKeys ||
            !Array.isArray(searchArrayKeys) ||
            searchArrayKeys.length === 0
        ) {
            throw new Error('Falta información');
        }

        const chunkSize = 50; // Default chunk size

        const resultTemp:
            | Record<string, unknown>
            | Array<Record<string, unknown>> = [];

        for (let i = 0; i < searchArrayKeys.length; i += chunkSize) {
            const chunk = searchArrayKeys.slice(i, i + chunkSize);

            const queryPromises: Promise<DocumentData>[] = chunk.map((item) => {
                const docRef = doc(db, collectionName, item);
                return getDoc(docRef);
            });

            const querySnapshots = await Promise.all(queryPromises);

            querySnapshots.map((docSnap) => {
                if (docSnap.exists()) {
                    const data = {
                        ...docSnap.data(),
                        id: docSnap.id
                    };

                    const tempData = adapterDate(data);

                    resultTemp.push(tempData);
                }
            });
        }

        const result: InterfaceDocReturn = {
            notification: HandledNotification(
                'ReadDocToSpecificCollectionByArrayIds',
                isNotification,
                'Importante',
                `Se encontraron ${resultTemp.length} documentos.`,
                ReduxStatus.SUCCESS,
                ReduxPosition.bottomRight,
                notification
            ),
            result: resultTemp
        };

        return result; // Return the results if needed
    } catch (error) {
        console.error(error);
        const localError = error as Error;
        throw localError;
    }
}

export const FindFirstDocumentByCollection = async ({
    collectionName,
    idValue,
    searchDataKey,
    isNotification = false,
    notification = {}
}: InterfaceInstructionsProps): Promise<InterfaceDocReturn> => {
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

        if (!collectionName || !idValue || !searchDataKey) {
            throw new Error('Falta información');
        }

        const itemsCollectionRef = collection(db, collectionName);

        // Crear la consulta: buscar donde searchDataKey sea igual a idValue, limitando a 1 resultado.
        const q = query(
            itemsCollectionRef,
            where(searchDataKey, '==', idValue),
            limit(1)
        );

        const querySnapshot = await getDocs(q);

        const notificationIdLocal = idValue;
        let notificationTitleLocal = 'Importante';
        let notificationMessageLocal = 'No se encontro el documento';
        let notificationStatusLocal = ReduxStatus.WARNING;
        let notificationPositionLocal = ReduxPosition.bottomRight;

        if (querySnapshot.empty) {
            const result: InterfaceDocReturn = {
                notification: HandledNotification(
                    notificationIdLocal,
                    isNotification,
                    notificationTitleLocal,
                    notificationMessageLocal,
                    notificationStatusLocal,
                    notificationPositionLocal,
                    notification
                ),
                result: {}
            };
            return result;
        }

        const data = querySnapshot.docs[0].data();

        notificationTitleLocal = 'Documento encontrado';
        notificationMessageLocal = 'Se se encontro el documento';
        notificationStatusLocal = ReduxStatus.SUCCESS;
        notificationPositionLocal = ReduxPosition.bottomRight;

        const result: InterfaceDocReturn = {
            notification: HandledNotification(
                notificationIdLocal,
                isNotification,
                notificationTitleLocal,
                notificationMessageLocal,
                notificationStatusLocal,
                notificationPositionLocal,
                notification
            ),
            result: data
        };

        return result;
    } catch (error) {
        console.error(error);
        const localError = error as Error;
        throw localError;
    }
};

export async function GetSuggestHighestByKey({
    collectionName,
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
            //if (true) {
            // lanzar error si no hay conexión
            throw new Error('No hay conexión a internet');
        }

        if (!collectionName || !searchKey) {
            // console.log('searchKey', searchKey);
            // console.log('collectionName', collectionName);

            throw new Error('Falta información');
        }

        const arrayWhere: Array<QueryFieldFilterConstraint> = [];

        if (extraWhere) {
            // interface InterfaceExtraWhere {
            // 	fieldPath: string;
            // 	opStr: WhereFilterOp;
            // 	value: unknown;
            // }
            const { fieldPath, opStr, value } = extraWhere;

            const whereObj = where(fieldPath, opStr, value);

            arrayWhere.push(whereObj);
        }

        const docRef = collection(db, collectionName);
        const q = query(
            docRef,
            ...arrayWhere,
            orderBy(searchKey, 'desc'),
            limit(1)
        );

        const querySnapshot = await getDocs(q);
        let suggesthighest: number = 0;

        if (!querySnapshot.empty) {
            const highestDoc = querySnapshot.docs[0];
            suggesthighest = highestDoc.data()[searchKey] + 1;
        }

        // console.log('GetSuggestHighestByKey', extraWhere);

        const result: InterfaceDocReturn = {
            notification: HandledNotification(
                'GetSuggestHighestByKey',
                isNotification,
                'Importante',
                `El número mayor encontrado es ${suggesthighest}`,
                ReduxStatus.SUCCESS,
                ReduxPosition.bottomRight,
                notification
            ),
            result: { suggesthighest }
        };

        return result;
    } catch (error) {
        console.error(error);
        const localError = error as Error;
        throw localError;
    }
}
