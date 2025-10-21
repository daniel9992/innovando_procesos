import NotificationsSystem, {
  atalhoTheme,
  bootstrapTheme,
  POSITIONS,
  setUpNotifications,
  useNotifications
} from 'reapop';
import { useColorMode } from '../components/ui/color-mode';

const NotificationByReapop = () => {
  const { colorMode } = useColorMode();

  // 1. Retrieve the notifications to display, and the function used to dismiss a notification.
  const { notifications, dismissNotification } = useNotifications();

  // run this function when your application starts before creating any notifications
  setUpNotifications({
    defaultProps: {
      position: POSITIONS.bottomRight,
      dismissible: true,
      dismissAfter: 5000
    }
  });

  return (
    <>
      <NotificationsSystem
        // 2. Pass the notifications you want Reapop to display.
        notifications={notifications}
        // 3. Pass the function used to dismiss a notification.
        dismissNotification={(id) => dismissNotification(id)}
        // 4. Pass a builtIn theme or a custom theme.
        theme={colorMode === 'light' ? bootstrapTheme : atalhoTheme}
      />
    </>
  );
};

export default NotificationByReapop;
