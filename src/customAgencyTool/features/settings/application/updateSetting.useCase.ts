import type { InterfaceAppSetting } from '../domain/modelFather';
import type { InterfaceISettingRepository } from './iRepository';

export interface InterfaceUpdateSetting {
    values: InterfaceAppSetting;
}

export class UpdateSettingUseCase {
    constructor(
        private readonly settingRepository: InterfaceISettingRepository
    ) {}

    async execute(args: InterfaceUpdateSetting): Promise<InterfaceAppSetting> {
        return this.settingRepository.updateSetting(args);
    }
}
