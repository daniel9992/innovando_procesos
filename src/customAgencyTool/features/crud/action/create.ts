import {
    ReduxPosition,
    ReduxStatus
} from '@src/customAgencyTool/constants/reduxConstants';
import { db } from '@src/customAgencyTool/core';
import { adapterDate } from '@src/customAgencyTool/utils/adapter';
import {
    addDoc,
    collection,
    doc,
    setDoc,
    updateDoc
} from 'firebase/firestore';
import {
    HandledNotification,
    type InterfaceDocReturn,
    type InterfaceInstructionsProps
} from './iCrud';

const isOffline = false;

export async function AddDocToSpecificCollection({
    collectionName,
    values,
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

        if (!collectionName || !values) {
            throw new Error('Falta información');
        }

        const docRef = collection(db, collectionName);

        const dateAdapter = adapterDate(values);

        const docId = await addDoc(docRef, dateAdapter).then((doc) => {
            return doc.id;
        });

        // actualizar el registro con el id asignado
        const docRefUpdate = doc(db, collectionName, docId);

        await updateDoc(docRefUpdate, {
            id: docId
        });

        const notificationIdLocal = docId;
        const notificationTitleLocal = 'Se agrego con éxito';
        const notificationMessageLocal = `Se creó con éxito el registro #${docId}`;
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
            result: { ...values, id: docId }
        };

        return result;
    } catch (error) {
        console.error(error);
        const localError = error as Error;
        throw localError;
    }
}

export async function AddDocToSpecificCollectionAndID({
    collectionName,
    id,
    values,
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

        if (!collectionName || !values || !id) {
            throw new Error('Falta información');
        }

        const docRef = doc(db, collectionName, id);

        const dateAdapter = adapterDate(values);

        await setDoc(docRef, dateAdapter);

        const notificationIdLocal = id;
        const notificationTitleLocal = 'Se agrego con éxito';
        const notificationMessageLocal = `Se creó con éxito el registro #${id}`;
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
            result: { ...values, id: id }
        };

        return result;
    } catch (error) {
        console.error(error);
        const localError = error as Error;
        throw localError;
    }
}

export async function AddArrayToCollection({
    collectionName,
    arrayValues,

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

        if (!collectionName || !arrayValues) {
            throw new Error('Falta información');
        }

        const chunkSize = 50;

        const groupsArray = [];

        for (let i = 0; i < arrayValues.length; i += chunkSize) {
            groupsArray.push(arrayValues.slice(i, i + chunkSize));
        }

        const uploadGroups: InterfaceDocReturn[] = await Promise.all(
            groupsArray
                .map((group) => {
                    return group.map((item) => {
                        return AddDocToSpecificCollection({
                            collectionName: collectionName,
                            values: item
                        });
                    });
                })
                .flat(2)
        );

        const result: InterfaceDocReturn = {
            notification: HandledNotification(
                'AddArrayToCollection',
                isNotification,
                'Importante',
                `Se agregaron ${uploadGroups.length} documentos.`,
                ReduxStatus.SUCCESS,
                ReduxPosition.bottomRight,
                notification
            ),
            result: { ...uploadGroups }
        };

        return result;
    } catch (error) {
        console.error(error);
        const localError = error as Error;
        throw localError;
    }
}
