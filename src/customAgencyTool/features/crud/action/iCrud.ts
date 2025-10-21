import type {
    ReduxPosition,
    ReduxStatus
} from '@src/customAgencyTool/constants/reduxConstants';
import firebase from 'firebase/compat/app';
import type { WhereFilterOp } from 'firebase/firestore';

export interface InterfaceValues {
    [x: string]:
        | firebase.firestore.FieldValue
        | Partial<unknown>
        | undefined;
}

export interface InterfaceExtraWhere {
    fieldPath: string;
    opStr: WhereFilterOp;
    value: unknown;
}

export interface InterfaceNotificationOptions {
    notificationId?: string;
    notificationTitle?: string;
    notificationMessage?: string;
    notificationStatus?: ReduxStatus;
    notificationPosition?: ReduxPosition;
}
export interface InterfaceInstructionsProps {
    collectionName: string;
    id?: string;
    docId?: string;
    values?: InterfaceValues;
    arrayValues?: Array<InterfaceValues>;
    searchKey?: string;
    queryString?: string | number;
    searchLikeA?: string[];
    searchArrayKeys?: string[];
    noMessage?: boolean;
    isNotification?: boolean;
    extraWhere?: InterfaceExtraWhere;
    idValue?: string;
    searchDataKey?: string;

    notification?: InterfaceNotificationOptions;
}

export interface InterfaceNotificationRedux {
    id: string;
    isShowNotification: boolean;
    status: ReduxStatus;
    title: string;
    message: string;
    position: ReduxPosition;
}

export const HandledNotification = (
    defaultID: string,
    showNotification: boolean,
    defaultTitle: string,
    defaultMessage: string,
    defaultStatus: ReduxStatus,
    defaultPosition: ReduxPosition,
    notification?: InterfaceNotificationOptions
): InterfaceNotificationRedux => {
    if (!notification) {
        const result: InterfaceNotificationRedux = {
            id: defaultID,
            isShowNotification: showNotification,
            status: defaultStatus,
            title: defaultTitle,
            message: defaultMessage,
            position: defaultPosition
        };
        return result;
    }

    const {
        notificationId,
        notificationTitle,
        notificationMessage,
        notificationStatus,
        notificationPosition
    } = notification;

    let notificationIdLocal = defaultID;
    let notificationTitleLocal = defaultTitle;
    let notificationMessageLocal = defaultMessage;
    let notificationStatusLocal = defaultStatus;
    let notificationPositionLocal: ReduxPosition = defaultPosition;

    if (notificationId) {
        notificationIdLocal = notificationId;
    }
    if (notificationTitle) {
        notificationTitleLocal = notificationTitle;
    }
    if (notificationMessage) {
        notificationMessageLocal = notificationMessage;
    }

    if (notificationStatus) {
        notificationStatusLocal = notificationStatus;
    }

    if (notificationPosition) {
        notificationPositionLocal = notificationPosition;
    }

    const result: InterfaceNotificationRedux = {
        id: notificationIdLocal,
        isShowNotification: showNotification,
        status: notificationStatusLocal,
        title: notificationTitleLocal,
        message: notificationMessageLocal,
        position: notificationPositionLocal
    };

    return result;
};
export interface InterfaceDocReturn {
    notification: InterfaceNotificationRedux;
    result: Record<string, unknown> | Array<Record<string, unknown>>;
}
