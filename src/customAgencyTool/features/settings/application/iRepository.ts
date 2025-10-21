import type { InterfaceAppSetting } from '../domain/modelFather';
import type { InterfaceCreateSetting } from './createSetting.useCase';
import type { InterfaceDeleteSetting } from './deleteSetting.useCase';
import type { InterfaceReadSetting } from './readSetting.useCase';
import type { InterfaceUpdateSetting } from './updateSetting.useCase';

export interface InterfaceISettingRepository {
    createSetting(args: InterfaceCreateSetting): Promise<InterfaceAppSetting>;
    updateSetting(args: InterfaceUpdateSetting): Promise<InterfaceAppSetting>;
    deleteSetting(args: InterfaceDeleteSetting): Promise<void>;
    readSetting(args: InterfaceReadSetting): Promise<InterfaceAppSetting>;
}
