import { type SerializedError } from '@reduxjs/toolkit';
import { createAppSlice } from '@src/customAgencyTool/app/createAppSlice';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import type { NotificationUpdatePayload } from '@src/customAgencyTool/context/toastAppNotification/notyModel';
import type { ICreateAgenda } from '../application/create.useCase';
import type { IDeleteAgenda } from '../application/delete.useCase';
import type { IReadAgenda } from '../application/read.useCase';
import type { IReadCustomerContacts } from '../application/readCustomer.useCase';
import type { IUpdateAgenda } from '../application/update.useCase';
import type {
    InterfaceClient,
    InterfaceCustomerContact
} from '../domain/agendaModel';
import {
    createAgendaUseCase,
    deleteAgendaUseCase,
    readAgendaUseCase,
    readCustomerContactsUseCase,
    updateAgendaUseCase
} from './compositionRoot';

interface InterfaceAgendaSliceState {
    doc?: InterfaceClient;
    docs: InterfaceClient[];
    customerContacts?: InterfaceCustomerContact[];
    status: ReduxStatus;

    error?: SerializedError | Error;
    notification?: NotificationUpdatePayload;
}

export const initialState: InterfaceAgendaSliceState = {
    docs: [],
    status: ReduxStatus.INIT
};

const getInitialState = () => {
    return initialState;
};

export const agendaSlice = createAppSlice({
    name: 'agenda',
    initialState: getInitialState(),
    reducers: (create) => ({
        createAgenda: create.asyncThunk(
            async (args: ICreateAgenda) => {
                const event = await createAgendaUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;
                    state.doc = action.payload;
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        readAgenda: create.asyncThunk(
            async (args: IReadAgenda) => {
                const event = await readAgendaUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;
                    state.doc = action.payload;
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        readCustomerContacts: create.asyncThunk(
            async (args: IReadCustomerContacts) => {
                const event = await readCustomerContactsUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;
                    state.customerContacts = action.payload;
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        updateAgenda: create.asyncThunk(
            async (args: IUpdateAgenda) => {
                const event = await updateAgendaUseCase.execute(args);
                return event;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;
                    state.doc = action.payload;
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        deleteAgenda: create.asyncThunk(
            async (args: IDeleteAgenda) => {
                const event = await deleteAgendaUseCase.execute(args);
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
        )
    }),
    selectors: {
        selectPI: (proformaInvoice) => proformaInvoice.doc,
        selectPIs: (proformaInvoice) => proformaInvoice.docs,
        selectCustomerContacts: (proformaInvoice) =>
            proformaInvoice.customerContacts,

        selectStatus: (proformaInvoice) => proformaInvoice.status,
        selectNotification: (proformaInvoice) => proformaInvoice.notification,
        selectError: (proformaInvoice) => proformaInvoice.error
    }
});

export const {
    //
    createAgenda,
    readAgenda,
    readCustomerContacts,
    updateAgenda,
    deleteAgenda
} = agendaSlice.actions;

export const {
    //
    selectPI,
    selectPIs,
    selectCustomerContacts,
    selectStatus,
    selectNotification,
    selectError
} = agendaSlice.selectors;
