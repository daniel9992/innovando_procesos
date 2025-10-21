import {
    ReduxPosition,
    ReduxStatus
} from '@src/customAgencyTool/constants/reduxConstants';
import { db } from '@src/customAgencyTool/core';
import { deleteDoc, doc } from 'firebase/firestore';
import {
    HandledNotification,
    type InterfaceDocReturn,
    type InterfaceInstructionsProps
} from './iCrud';

const isOffline = false;

export async function DelteDocToSpecificCollection({
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

        await deleteDoc(docRef);

        const result: InterfaceDocReturn = {
            notification: HandledNotification(
                id,
                isNotification,
                'Importante',
                'Se elimino con éxito',
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
}
