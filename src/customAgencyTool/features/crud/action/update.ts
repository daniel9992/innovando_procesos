import {
    ReduxPosition,
    ReduxStatus
} from '@src/customAgencyTool/constants/reduxConstants';
import { db } from '@src/customAgencyTool/core';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import {
    HandledNotification,
    type InterfaceDocReturn,
    type InterfaceInstructionsProps,
    type InterfaceValues
} from './iCrud';

const isOffline = false;

export async function UpdateDocToSpecificCollection({
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

        if (!collectionName || !id || !values) {
            throw new Error('Falta información');
        }

        const docRef = doc(db, collectionName, id);

        //	const dateAdapter = adapterDate(values);

        await updateDoc(docRef, values);

        const notificationIdLocal = id;
        const notificationTitleLocal = 'Se actualizo con éxito';
        const notificationMessageLocal = `Se actualizo con éxito el registro #${id}`;
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

export const UpdateArrayDocToSpecificCollection = async ({
    collectionName,
    arrayValues,

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

        if (!collectionName || !arrayValues) {
            throw new Error('Falta información');
        }

        const chunkSize = 75;

        // Group into chunks
        const arrayChunks: Array<Array<InterfaceValues>> = [];
        for (let i = 0; i < arrayValues.length; i += chunkSize) {
            arrayChunks.push(arrayValues.slice(i, i + chunkSize));
        }

        const arrayOfPromises: Array<Promise<void>> = arrayChunks.flatMap(
            (chunk) =>
                chunk.map((chunkItem) => {
                    if (!chunkItem.id) {
                        return Promise.resolve();
                    }
                    const docRef = doc(
                        db,
                        collectionName,
                        chunkItem.id as string
                    );
                    return setDoc(docRef, chunkItem);
                })
        );

        await Promise.all(arrayOfPromises);

        const result: InterfaceDocReturn = {
            notification: HandledNotification(
                'UpdateArrayDocToSpecificCollection',
                isNotification,
                'Importante',
                `Se actualizo con éxito ${arrayValues.length} registros.  LOL !!!`,
                ReduxStatus.SUCCESS,
                ReduxPosition.bottomRight,
                notification
            ),
            result: {}
        };
        return result;
    } catch (error) {
        console.error(error);
        const localError = error as Error;
        throw localError;
    }
};
