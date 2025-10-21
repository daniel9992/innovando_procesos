import { type SerializedError } from '@reduxjs/toolkit';
import { createAppSlice } from '@src/customAgencyTool/app/createAppSlice';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import type { NotificationUpdatePayload } from '@src/customAgencyTool/context/toastAppNotification/notyModel';
import {
    getFromSessionStorage,
    persistSessionStorage
} from '@src/customAgencyTool/utils/manageStorage/manageStorage';
import type { ILoginCredentials } from '../application/login.useCase';
import { type IRegisterUserData } from '../application/register.useCase';
import type { IResetPasswordCredentials } from '../domain/resetPass.entity';
import { initialUser, type InterfaceCurrentUser } from '../domain/user.entity';
import {
    loginUserUseCase,
    logoutUserUseCase,
    registerUserUseCase,
    resetPasswordUseCase,
    watchAuthStateChangeUseCase
} from './compositionRoot';

interface InterfaceUserSliceState {
    currentUser: InterfaceCurrentUser;
    status: ReduxStatus;
    authIsReady: boolean;

    error?: SerializedError | Error;
    notification?: NotificationUpdatePayload;
}

export const initialState: InterfaceUserSliceState = {
    currentUser: initialUser,
    status: ReduxStatus.INIT,
    authIsReady: false
};

export const UserKey = 'user';

const getInitialState = () => {
    const session = getFromSessionStorage(UserKey) as InterfaceCurrentUser;

    if (session) {
        initialState.currentUser = session;
        initialState.authIsReady = session.uid !== '';
        return initialState;
    } else {
        return initialState;
    }
};

export const authSlice = createAppSlice({
    name: 'auth',
    initialState: getInitialState(),
    reducers: (create) => ({
        RegisterNewUser: create.asyncThunk(
            async (args: IRegisterUserData) => {
                const user = await registerUserUseCase.execute(args);

                return user;
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
        Login: create.asyncThunk(
            async (args: ILoginCredentials) => {
                const user = await loginUserUseCase.execute(args);

                return user;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                    state.error = undefined;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;
                    state.currentUser = action.payload;
                    state.authIsReady = true;
                    persistSessionStorage(UserKey, action.payload);
                },
                rejected: (state, action) => {
                    console.log('rejected', action);
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        Logout: create.asyncThunk(
            async () => {
                await logoutUserUseCase.execute();

                return;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state) => {
                    state.status = ReduxStatus.SUCCESS;
                    state.currentUser = initialUser;
                    state.authIsReady = false;
                    persistSessionStorage(UserKey, null);
                },
                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;
                    state.error = action.error;
                }
            }
        ),
        ResetPassword: create.asyncThunk(
            async (args: IResetPasswordCredentials) => {
                const user = await resetPasswordUseCase.execute(args);

                return user;
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
        WatchAuthStateChange: create.asyncThunk(
            async () => {
                const user = await watchAuthStateChangeUseCase.execute();

                return user;
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
        selectCurrentUser: (auth) => auth.currentUser,
        selectCurrentRole: (auth) => auth.currentUser.role,
        selectStatus: (auth) => auth.status,
        selectNotification: (auth) => auth.notification,
        selectIsAuthReady: (auth) => auth.authIsReady,
        selectError: (auth) => auth.error
    }
});

export const {
    RegisterNewUser,
    Login,
    Logout,
    ResetPassword,
    WatchAuthStateChange
} = authSlice.actions;

export const {
    selectCurrentUser,
    selectCurrentRole,
    selectStatus,
    selectNotification,
    selectIsAuthReady,
    selectError
} = authSlice.selectors;
