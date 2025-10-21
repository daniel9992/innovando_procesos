import type { InterfaceAppSetting } from '../domain/modelFather';
import type { InterfaceISettingRepository } from './iRepository';

export interface InterfaceDeleteSetting {
    values: InterfaceAppSetting;
}

export class DeleteSettingUseCase {
    constructor(
        private readonly settingRepository: InterfaceISettingRepository
    ) {}

    async execute(args: InterfaceDeleteSetting): Promise<void> {
        return this.settingRepository.deleteSetting(args);
    }
}
