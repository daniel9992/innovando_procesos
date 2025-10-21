import {
    getFromSessionStorage,
    persistSessionStorage
} from '@src/customAgencyTool/utils/manageStorage/manageStorage';
import { isEmptyObject } from '@src/customAgencyTool/utils/objects/isEmptyObj';
import { AddDocToSpecificCollectionAndID } from '../../crud/action/create';
import { DelteDocToSpecificCollection } from '../../crud/action/delete';
import { ReadDocToSpecificCollection } from '../../crud/action/read';
import { UpdateDocToSpecificCollection } from '../../crud/action/update';
import type { InterfaceCreateSetting } from '../application/createSetting.useCase';
import type { InterfaceDeleteSetting } from '../application/deleteSetting.useCase';
import type { InterfaceISettingRepository } from '../application/iRepository';
import type { InterfaceReadSetting } from '../application/readSetting.useCase';
import type { InterfaceUpdateSetting } from '../application/updateSetting.useCase';
import type { InterfaceAppSetting } from '../domain/modelFather';

export class FirebaseSettingRepository implements InterfaceISettingRepository {
    private static readonly SETTINGS_COLLECTION = 'appSettings';

    private validateId(id: string): boolean {
        if (id === '') {
            return false;
        }

        return true;
    }

    async createSetting(
        args: InterfaceCreateSetting
    ): Promise<InterfaceAppSetting> {
        try {
            const { values } = args;

            if (!this.validateId(values.id)) {
                throw new Error('El id no puede estar en blanco');
            }

            const result = await AddDocToSpecificCollectionAndID({
                collectionName: FirebaseSettingRepository.SETTINGS_COLLECTION,
                id: values.id,
                values: values
            });

            // save to local storage
            persistSessionStorage(values.id, result.result);

            return result.result as InterfaceAppSetting;
        } catch (error) {
            console.error(error);
            const localError = error as Error;
            throw localError;
        }
    }

    async updateSetting(
        args: InterfaceUpdateSetting
    ): Promise<InterfaceAppSetting> {
        try {
            const { values } = args;

            if (!this.validateId(values.id)) {
                throw new Error('El id no puede estar en blanco');
            }

            const result = await UpdateDocToSpecificCollection({
                collectionName: FirebaseSettingRepository.SETTINGS_COLLECTION,
                id: values.id,
                values: values
            });

            // save to local storage
            persistSessionStorage(values.id, result.result);

            return result.result as InterfaceAppSetting;
        } catch (error) {
            console.error(error);
            const localError = error as Error;
            throw localError;
        }
    }

    async deleteSetting(args: InterfaceDeleteSetting): Promise<void> {
        try {
            const { values } = args;

            if (!this.validateId(values.id)) {
                throw new Error('El id no puede estar en blanco');
            }

            await DelteDocToSpecificCollection({
                collectionName: FirebaseSettingRepository.SETTINGS_COLLECTION,
                id: values.id
            });
        } catch (error) {
            console.error(error);
            const localError = error as Error;
            throw localError;
        }
    }

    async readSetting(
        args: InterfaceReadSetting
    ): Promise<InterfaceAppSetting> {
        try {
            const { id } = args;

            if (!this.validateId(id)) {
                throw new Error('El id no puede estar en blanco');
            }

            // read from session storage
            // if it does not exist, read from the collection
            // but if it remains unread in the session
            // unnecessary requests will be made
            const readSession = getFromSessionStorage(id);

            if (readSession) {
                return readSession as InterfaceAppSetting;
            }

            const result = await ReadDocToSpecificCollection({
                collectionName: FirebaseSettingRepository.SETTINGS_COLLECTION,
                id: id
            });

            if (isEmptyObject(result.result)) {
                throw new Error('No se encontró la configuración');
            }
            // save to local storage
            persistSessionStorage(id, result.result);

            return result.result as InterfaceAppSetting;
        } catch (error) {
            console.error(error);
            const localError = error as Error;
            throw localError;
        }
    }
}
