export enum ReduxStatus {
    INIT = 'init',
    SUCCESS = 'success',
    WARNING = 'warning',
    INFORMATION = 'information',
    INFO = 'info',
    LOADING = 'loading',
    FAILED = 'failed',
    ERROR = 'error',
    STREAMING = 'streaming'
}

export enum ReduxPosition {
    topCenter = 'top-center',
    topLeft = 'top-left',
    topRight = 'top-right',
    bottomCenter = 'bottom-center',
    bottomLeft = 'bottom-left',
    bottomRight = 'bottom-right'
}

export interface InterfaceNotificationOptions {
    notificationId?: string;
    notificationTitle?: string;
    notificationMessage?: string;
    notificationStatus?: ReduxStatus;
    notificationPosition?: ReduxPosition;
}

export interface ReduxBaseProps {
    collectionName: string;

    isNotification?: boolean;
    notification?: InterfaceNotificationOptions;
}
