import { type SerializedError } from '@reduxjs/toolkit';
import { createAppSlice } from '@src/customAgencyTool/app/createAppSlice';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import type { NotificationUpdatePayload } from '@src/customAgencyTool/context/toastAppNotification/notyModel';
import type { IUpdateCategory } from '../application/category.useCase';
import type { ICreateCalendar } from '../application/createCalendar.useCase';
import type { IDeleteCalendar } from '../application/deleteCalendar.useCase';
import type { IReadCalendar } from '../application/readCalendar.useCase';
import type { IUpdateCalendar } from '../application/updateCalendar.useCase';
import type {
    InterfaceCalendarEvent,
    InterfaceCategory
} from '../domain/calendarEvent.entity';
import {
    categoryUseCase,
    createEventOnCalendarUseCase,
    deleteCalendarUseCase,
    readCalendarUseCase,
    updateCalendarUseCase
} from './compositionRoot';

interface InterfaceUserSliceState {
    events: InterfaceCalendarEvent[];
    categories: InterfaceCategory[];
    status: ReduxStatus;
    authIsReady: boolean;

    error?: SerializedError | Error;
    notification?: NotificationUpdatePayload;
}

export const initialState: InterfaceUserSliceState = {
    events: [],
    categories: [],
    status: ReduxStatus.INIT,
    authIsReady: false
};

export const UserKey = 'calendar';

const getInitialState = () => {
    return initialState;
};

export const calendarSlice = createAppSlice({
    name: 'calendar',
    initialState: getInitialState(),
    reducers: (create) => ({
        updateEvent: create.asyncThunk(
            async (args: IUpdateCalendar) => {
                const event = await updateCalendarUseCase.execute(args);
                return event;
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
        ),
        deleteEvent: create.asyncThunk(
            async (args: IDeleteCalendar) => {
                const event = await deleteCalendarUseCase.execute(args);
                return event;
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
        ),
        createEvent: create.asyncThunk(
            async (args: ICreateCalendar) => {
                const event = await createEventOnCalendarUseCase.execute(args);
                return event;
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
        ),
        readCalendar: create.asyncThunk(
            async (args: IReadCalendar) => {
                const event = await readCalendarUseCase.execute(args);
                return event;
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
        ),
        readCategory: create.asyncThunk(
            async () => {
                const event = await categoryUseCase.read();
                return event;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;
                    state.categories = action.payload;
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        updateCategory: create.asyncThunk(
            async (args: IUpdateCategory) => {
                const event = await categoryUseCase.update(args);
                return event;
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
        selectEvents: (calendar) => calendar.events,
        selectCategories: (calendar) => calendar.categories,
        selectStatus: (calendar) => calendar.status,
        selectNotification: (calendar) => calendar.notification,
        selectError: (calendar) => calendar.error
    }
});

export const {
    updateEvent,
    deleteEvent,
    createEvent,
    readCalendar,
    readCategory,
    updateCategory
} = calendarSlice.actions;

export const {
    selectEvents,
    selectCategories,
    selectStatus,
    selectNotification,
    selectError
} = calendarSlice.selectors;
