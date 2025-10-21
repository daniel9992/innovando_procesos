import { type SerializedError } from '@reduxjs/toolkit';
import { createAppSlice } from '@src/customAgencyTool/app/createAppSlice';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import type { NotificationUpdatePayload } from '@src/customAgencyTool/context/toastAppNotification/notyModel';

interface InterfaceUserSliceState {
    docs: string[];
    status: ReduxStatus;

    error?: SerializedError | Error;
    notification?: NotificationUpdatePayload;
}

export const initialState: InterfaceUserSliceState = {
    docs: [],
    status: ReduxStatus.INIT
};

const getInitialState = () => {
    return initialState;
};

export const useManagementSlice = createAppSlice({
    name: 'useManagement',
    initialState: getInitialState(),
    reducers: (create) => ({
        updateProformaInvoice: create.asyncThunk(
            async (args: string) => {
                // const event = await updateCalendarUseCase.execute(args);
                // return event;
                return args;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;
                    console.log('fulfilled', action);
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        )
    }),
    selectors: {
        selectBLS: (useManagement) => useManagement.docs,

        selectStatus: (useManagement) => useManagement.status,
        selectNotification: (useManagement) => useManagement.notification,
        selectError: (useManagement) => useManagement.error
    }
});

export const {
    //
    updateProformaInvoice
} = useManagementSlice.actions;

export const {
    //
    selectBLS,
    selectStatus,
    selectNotification,
    selectError
} = useManagementSlice.selectors;
