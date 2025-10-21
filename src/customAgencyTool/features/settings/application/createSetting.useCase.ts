import type { InterfaceAppSetting } from '../domain/modelFather';
import type { InterfaceISettingRepository } from './iRepository';

export interface InterfaceCreateSetting {
    values: InterfaceAppSetting;
}

export class CreateSettingUseCase {
    constructor(
        private readonly settingRepository: InterfaceISettingRepository
    ) {}

    async execute(args: InterfaceCreateSetting): Promise<InterfaceAppSetting> {
        return this.settingRepository.createSetting(args);
    }
}
