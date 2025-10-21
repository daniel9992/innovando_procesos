import type {
  ReduxPosition,
  ReduxStatus
} from '../constants/reduxConstants';

export interface InterfaceNotificationRedux {
  id: string;
  isShowNotification: boolean;
  status: ReduxStatus;
  title: string;
  message: string;
  position: ReduxPosition;
}
