import {
    type Action,
    combineReducers,
    configureStore,
    type ThunkAction
} from '@reduxjs/toolkit';
import logger from 'redux-logger';

import { agendaSlice } from '../features/agenda/infrastructure/agendaSlice';
import { authSlice } from '../features/auth/infrastructure/authSlice';
import { calendarSlice } from '../features/calendar/infrastructure/calendarSlice';
import { crudsSlice } from '../features/crud/crudSlice';
import { iaChatSlice } from '../features/iAChat/infrastructure/chat.reducer';
import { settingSlice } from '../features/settings/infrastructure/settingSlice';
import { userAdminSlice } from '../features/userAdmin/infrastructure/userAdminSlice';

// `combineSlices` automatically combines the reducers using
// their `reducerPath`s, therefore we no longer need to call `combineReducers`.
// const rootReducer = combineSlices(notificationsSlice, userSlice);

const reducer = {
    //
    auth: authSlice.reducer,
    calendar: calendarSlice.reducer,
    cruds: crudsSlice.reducer,
    userAdmin: userAdminSlice.reducer,
    agenda: agendaSlice.reducer,
    setting: settingSlice.reducer,
    iaChat: iaChatSlice.reducer
};

export const rootReducer = combineReducers(reducer);

// Infer the `RootState` type from the root reducer
export type RootState = ReturnType<typeof rootReducer>;

// The store setup is wrapped in `makeStore` to allow reuse
// when setting up tests that need the same store config
export const makeStore = (preloadedState?: Partial<RootState>) => {
    const store = configureStore({
        reducer: rootReducer,
        // Adding the api middleware enables caching, invalidation, polling,
        // and other useful features of `rtk-query`.
        // middleware: (getDefaultMiddleware) => {
        // 	return getDefaultMiddleware({ serializableCheck: false }).concat(logger);
        // },
        middleware: (getDefaultMiddleware) => {
            if (import.meta.env.VITE_REACT_ENV === 'development') {
                return getDefaultMiddleware({
                    serializableCheck: false
                }).concat(logger);
            } else {
                return getDefaultMiddleware({
                    serializableCheck: false
                });
            }
        },
        preloadedState,

        // Enable Redux DevTools in development mode
        //import.meta.env.VITE_REACT_ENV
        devTools: import.meta.env.VITE_REACT_ENV === 'development'
    });

    return store;
};

export const store = makeStore();

// Infer the type of `store`
export type AppStore = typeof store;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ThunkReturnType = void> = ThunkAction<
    ThunkReturnType,
    RootState,
    unknown,
    Action
>;

export interface ThunkAPI {
    dispatch: AppDispatch;
    getState: () => RootState;
    rejectWithValue: <T>(value: T) => T;
    fulfillWithValue: <T>(value: T) => T;
}
