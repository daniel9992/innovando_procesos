import { type SerializedError } from '@reduxjs/toolkit';
import { createAppSlice } from '@src/customAgencyTool/app/createAppSlice';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import type { NotificationUpdatePayload } from '@src/customAgencyTool/context/toastAppNotification/notyModel';
import type { InterfaceCreateSetting } from '../application/createSetting.useCase';
import type { InterfaceDeleteSetting } from '../application/deleteSetting.useCase';
import type { InterfaceReadSetting } from '../application/readSetting.useCase';
import type { InterfaceUpdateSetting } from '../application/updateSetting.useCase';
import { type InterfaceAppSetting, initialValues } from '../domain/modelFather';
import {
    createSettingUseCase,
    deleteSettingUseCase,
    readSettingUseCase,
    updateSettingUseCase
} from './compositionRoot';

interface InterfaceSettingSliceState {
    setting: InterfaceAppSetting;
    status: ReduxStatus;

    error?: SerializedError | Error;
    notification?: NotificationUpdatePayload;
}

export const initialState: InterfaceSettingSliceState = {
    setting: initialValues,
    status: ReduxStatus.INIT
};

const getInitialState = () => {
    return initialState;
};

export const settingSlice = createAppSlice({
    name: 'setting',
    initialState: getInitialState(),
    reducers: (create) => ({
        createSetting: create.asyncThunk(
            async (args: InterfaceCreateSetting) => {
                const event = await createSettingUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;
                    state.setting = action.payload;
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        readSetting: create.asyncThunk(
            async (args: InterfaceReadSetting) => {
                const event = await readSettingUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;
                    state.setting = action.payload;
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        deleteSetting: create.asyncThunk(
            async (args: InterfaceDeleteSetting) => {
                const event = await deleteSettingUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state) => {
                    state.status = ReduxStatus.SUCCESS;
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        updateSetting: create.asyncThunk(
            async (args: InterfaceUpdateSetting) => {
                const event = await updateSettingUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;
                    state.setting = action.payload;
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        )
    }),
    selectors: {
        selectSetting: (state) => state.setting,

        selectStatus: (state) => state.status,
        selectNotification: (state) => state.notification,
        selectError: (state) => state.error
    }
});

export const {
    //
    createSetting,
    readSetting,
    deleteSetting,
    updateSetting
} = settingSlice.actions;

export const {
    //
    selectSetting,
    selectStatus,
    selectNotification,
    selectError
} = settingSlice.selectors;
