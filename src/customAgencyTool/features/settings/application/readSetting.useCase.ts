import type { InterfaceAppSetting } from '../domain/modelFather';
import type { InterfaceISettingRepository } from './iRepository';

export interface InterfaceReadSetting {
    id: string;
}

export class ReadSettingUseCase {
    constructor(
        private readonly settingRepository: InterfaceISettingRepository
    ) {}

    async execute(args: InterfaceReadSetting): Promise<InterfaceAppSetting> {
        return this.settingRepository.readSetting(args);
    }
}
