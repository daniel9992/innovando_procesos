import { CreateSettingUseCase } from '../application/createSetting.useCase';
import { DeleteSettingUseCase } from '../application/deleteSetting.useCase';
import { ReadSettingUseCase } from '../application/readSetting.useCase';
import { UpdateSettingUseCase } from '../application/updateSetting.useCase';
import { FirebaseSettingRepository } from './firebaseSettingRepository';

export const firebaseSettingRepository = new FirebaseSettingRepository();

export const readSettingUseCase = new ReadSettingUseCase(
    firebaseSettingRepository
);
export const createSettingUseCase = new CreateSettingUseCase(
    firebaseSettingRepository
);
export const updateSettingUseCase = new UpdateSettingUseCase(
    firebaseSettingRepository
);
export const deleteSettingUseCase = new DeleteSettingUseCase(
    firebaseSettingRepository
);
