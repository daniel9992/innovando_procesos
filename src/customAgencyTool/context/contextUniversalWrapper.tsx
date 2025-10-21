import { type FC, type ReactNode } from 'react';
import { DialogProvider } from './appAlertDialog/alertDialogContext';
import { DrawerProvider } from './appDrawer/drawerProvider';
import { NotificationProvider as AdapterNotificationProvider } from './toastAppNotification/notificationProvider';

interface ContextUniversalWrapperProps {
  children?: ReactNode;
}

const ContextUniversalWrapper: FC<ContextUniversalWrapperProps> = ({
  children
}) => {
  return (
    <>
      <AdapterNotificationProvider>
        <DrawerProvider>
          <DialogProvider>{children}</DialogProvider>
        </DrawerProvider>
      </AdapterNotificationProvider>
    </>
  );
};

export default ContextUniversalWrapper;
