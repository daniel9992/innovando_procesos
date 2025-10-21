import type { SerializedError } from '@reduxjs/toolkit';
import { createAppSlice } from '@src/customAgencyTool/app/createAppSlice';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import type { NotificationUpdatePayload } from '@src/customAgencyTool/context/toastAppNotification/notyModel';
import type { IReadUserToSelected } from '../domain/readUserToSelected';
import { readUserToSelectedUseCase } from './compositionRoot';

interface InterfaceUserSliceState {
    usersToSelected: IReadUserToSelected[];

    status: ReduxStatus;

    error?: SerializedError | Error;
    notification?: NotificationUpdatePayload;
}

export const initialState: InterfaceUserSliceState = {
    usersToSelected: [],
    status: ReduxStatus.INIT
};

const getInitialState = () => {
    return initialState;
};

export const userAdminSlice = createAppSlice({
    name: 'userAdmin',
    initialState: getInitialState(),
    reducers: (create) => ({
        readUserToSelected: create.asyncThunk(
            async () => {
                const event = await readUserToSelectedUseCase.execute();
                return event;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;
                    state.usersToSelected = action.payload;
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        )
    }),
    selectors: {
        selectUsersToSelected: (userAdmin) => userAdmin.usersToSelected,
        selectStatus: (userAdmin) => userAdmin.status,
        selectNotification: (userAdmin) => userAdmin.notification,
        selectError: (userAdmin) => userAdmin.error
    }
});

export const { readUserToSelected } = userAdminSlice.actions;

export const {
    selectUsersToSelected,
    selectStatus,
    selectNotification,
    selectError
} = userAdminSlice.selectors;
