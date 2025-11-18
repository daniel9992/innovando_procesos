import { Outlet } from 'react-router';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import AsideMenu from '../components/asideMenu/asideFlexMenu';
import { MyFlex } from '../components/ui';
import type { MenuItemButon } from '../components/ui/myMenu';
import { AsideMenuAgenda } from '../features/agenda/presentation/routeAgenda';
import { AsideMenuDashboard } from '../features/dashboard/presentation/routeDashboard';
import { AsideMenuIAChat } from '../features/iAChat/presentation/routeIAChat';
import NotificationsSidebar from '../features/notifications/presentation/components/NotificationsSidebar';
import { AsideMenuNotifications } from '../features/notifications/presentation/routeNotifications';
import {
  selectIsSidebarOpen,
  toggleSidebar,
} from '../features/notifications/infrastructure/notificationsSlice';
import { AsideMenuSettings } from '../features/settings/presentation/routeSettings';
import { AsideMenuUserAdmin } from '../features/userAdmin/presentation/routeUserAdmin';
import { AsideMenuUserManagement } from '../features/userManagement/presentation/routeUserManagement';

const AppLayout = () => {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector(selectIsSidebarOpen);

  const asideMenuItems: MenuItemButon[] = [
    AsideMenuDashboard,
    AsideMenuAgenda,
    AsideMenuNotifications,
    AsideMenuIAChat,
    AsideMenuUserAdmin,
    AsideMenuUserManagement,
  ];

  const asideMenuSettings: MenuItemButon[] = [AsideMenuSettings];

  return (
    <MyFlex
      direction={{
        base: 'column',
        xl: 'row',
      }}
      height={'100vh'}
      width={'100vw'}
      maxWidth={'100vw'}
      justifyContent={'space-between'}
      p={0}
    >
      <AsideMenu
        menuItems={asideMenuItems}
        tinyMenuItems={asideMenuSettings}
      />

      <MyFlex
        flex={5}
        direction={'column'}
        alignItems={'center'}
        width={'100%'}
        p={0}
      >
        <button onClick={() => dispatch(toggleSidebar())}>
          Toggle Notifications
        </button>
        <Outlet />
      </MyFlex>

      <NotificationsSidebar
        isOpen={isSidebarOpen}
        onClose={() => dispatch(toggleSidebar())}
      />
    </MyFlex>
  );
};

export default AppLayout;
