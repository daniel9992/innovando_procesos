import { createAppSlice } from '@src/customAgencyTool/app/createAppSlice';
import {
    ReduxPosition,
    ReduxStatus
} from '@src/customAgencyTool/constants/reduxConstants';
import {
    AddArrayToCollection,
    AddDocToSpecificCollection,
    AddDocToSpecificCollectionAndID
} from './action/create';
import { DelteDocToSpecificCollection } from './action/delete';
import type {
    InterfaceDocReturn,
    InterfaceInstructionsProps,
    InterfaceNotificationRedux
} from './action/iCrud';
import {
    FindFirstDocumentByCollection,
    GetSuggestHighestByKey,
    ReadDocToSpecificCollection,
    ReadDocToSpecificCollectionByArrayIds
} from './action/read';
import {
    GetTheDateRangeToSpecificCollection,
    SearchToSpecificCollection
} from './action/search';
import {
    UpdateArrayDocToSpecificCollection,
    UpdateDocToSpecificCollection
} from './action/update';

interface InterfaceCrudsSliceState {
    result?:
        | Record<string, unknown>
        | Array<Record<string, unknown>>
        | number;

    status: ReduxStatus;
    notification: InterfaceNotificationRedux;
}

const defaultNotificationPosition = ReduxPosition.topCenter;

const notificationInitialState: InterfaceNotificationRedux = {
    id: '',
    isShowNotification: false,
    status: ReduxStatus.INIT,
    title: '',
    message: '',
    position: defaultNotificationPosition
};

export const initialState: InterfaceCrudsSliceState = {
    status: ReduxStatus.INIT,
    notification: notificationInitialState
};

export const crudsSlice = createAppSlice({
    name: 'cruds',
    initialState,
    reducers: (create) => ({
        rdCreate: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await AddDocToSpecificCollection(args).then(
                    (result: InterfaceDocReturn) => {
                        return result;
                    }
                );
                return result;

                // const result = await getTest()
                // 	.then((result) => {
                // 		return result;
                // 	})
                // 	.catch((error) => {
                // 		if (error instanceof ErrorSys) {
                // 			return thunkApi.rejectWithValue(error as ErrorSys);
                // 		}
                // 		return thunkApi.rejectWithValue(error.messageas as string);
                // 	});
                // return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-AddDocToSpecificCollection`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdCreateWithID: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await AddDocToSpecificCollectionAndID(
                    args
                ).then((result: InterfaceDocReturn) => {
                    return result;
                });
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-AddDocToSpecificCollection`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdRead: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await ReadDocToSpecificCollection(
                    args
                ).then((result: InterfaceDocReturn) => {
                    return result;
                });
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-ReadDocToSpecificCollection`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdFindFirst: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await FindFirstDocumentByCollection(
                    args
                ).then((result: InterfaceDocReturn) => {
                    return result;
                });
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-FindFirstDocumentByCollection`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdUpdate: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await UpdateDocToSpecificCollection(
                    args
                ).then((result: InterfaceDocReturn) => {
                    return result;
                });
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-UpdateDocToSpecificCollection`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdDelete: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await DelteDocToSpecificCollection(
                    args
                ).then((result: InterfaceDocReturn) => {
                    return result;
                });
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-DelteDocToSpecificCollection`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdSearch: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await SearchToSpecificCollection(args).then(
                    (result: InterfaceDocReturn) => {
                        return result;
                    }
                );
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-SearchToSpecificCollection`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdSearchNew: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await SearchToSpecificCollection(args).then(
                    (result: InterfaceDocReturn) => {
                        return result;
                    }
                );
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-SearchToSpecificCollection`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdReadByArrayIds: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await ReadDocToSpecificCollectionByArrayIds(
                    args
                ).then((result: InterfaceDocReturn) => {
                    return result;
                });
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-ReadDocToSpecificCollectionByArrayIds`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdHighest: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await GetSuggestHighestByKey(args).then(
                    (result: InterfaceDocReturn) => {
                        return result;
                    }
                );
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    if (action.payload.result) {
                        if (
                            !Array.isArray(action.payload.result) &&
                            typeof action.payload.result === 'object' &&
                            'suggesthighest' in action.payload.result
                        ) {
                            const suggesthighest = Number(
                                action.payload.result.suggesthighest
                            );
                            // Ahora puedes usar suggesthighest como un número
                            state.result = suggesthighest;
                        }
                    }

                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-GetSuggestHighestByKey`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdDateRange: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await GetTheDateRangeToSpecificCollection(
                    args
                ).then((result: InterfaceDocReturn) => {
                    return result;
                });
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-rdDateRange`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdAddArray: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await AddArrayToCollection(args).then(
                    (result: InterfaceDocReturn) => {
                        return result;
                    }
                );
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-AddArrayToCollection`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdUpdateArray: create.asyncThunk(
            async (args: InterfaceInstructionsProps) => {
                const result = await UpdateArrayDocToSpecificCollection(
                    args
                ).then((result: InterfaceDocReturn) => {
                    return result;
                });
                return result;
            },
            {
                pending: (state) => {
                    state.status = ReduxStatus.LOADING;
                },
                fulfilled: (state, action) => {
                    state.status = ReduxStatus.SUCCESS;

                    const result = action.payload as InterfaceDocReturn;

                    state.result = result.result;
                    state.notification = result.notification;
                },

                rejected: (state, action) => {
                    state.status = ReduxStatus.FAILED;

                    const error = action.error;

                    state.notification = {
                        id: error.code
                            ? `${error.code}`
                            : `Error-UpdateArrayDocToSpecificCollection`,
                        isShowNotification: true,
                        status: ReduxStatus.ERROR,
                        title: 'Error',
                        message: error.message ? error.message : '',
                        position: defaultNotificationPosition
                    };
                }
            }
        ),
        rdClean: create.asyncThunk(async () => {}, {
            fulfilled: (state) => {
                state.status = ReduxStatus.INIT;
                state.notification = notificationInitialState;
                state.result = {};
            }
        })
    }),
    selectors: {
        selectResult: (state) => state.result,
        selectStatus: (state) => state.status,
        selectNotification: (state) => state.notification
    }
});

export const {
    rdCreate,
    rdCreateWithID,
    rdRead,
    rdFindFirst,
    rdReadByArrayIds,
    rdUpdate,
    rdUpdateArray,
    rdDelete,
    rdSearch,
    rdSearchNew,
    rdHighest,
    rdDateRange,
    rdAddArray,
    rdClean
} = crudsSlice.actions;
export const { selectResult, selectStatus, selectNotification } =
    crudsSlice.selectors;

/*
const getTest = (): Promise<InterfaceDocReturn> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const result: InterfaceDocReturn = {
				notyStatus: STATUSES.info,
				message: 'test',
			};
			// throw new ErrorSys(100, 'Esto es un error');
			// const error: Error = new ErrorSys(100, 'Esto es un error Perros desde CRUDS');
			// reject(error as ErrorSys);
			reject(new ErrorSys(100, 'Esto es un error Perros desde CRUDS'));
			//resolve(result);
		}, 100);
	});
};

const getTestArray = (): Promise<InterfaceDocReturn | ErrorSys> => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const result: InterfaceDocReturn = {
				notyStatus: STATUSES.success,
				message: 'test',
			};
			// throw new ErrorSys(100, 'Esto es un error');
			// const error: Error = new ErrorSys(100, 'Esto es un error Perros desde CRUDS');
			// reject(error as ErrorSys);
			//reject(new ErrorSys(100, 'Esto es un error Perros desde CRUDS'));
			resolve(result);
		}, 100);
	});
};
*/
