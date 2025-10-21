import { Outlet } from 'react-router';
import AsideMenu from '../components/asideMenu/asideFlexMenu';
import { MyFlex } from '../components/ui';
import type { MenuItemButon } from '../components/ui/myMenu';
import { AsideMenuAgenda } from '../features/agenda/presentation/routeAgenda';
import { AsideMenuDashboard } from '../features/dashboard/presentation/routeDashboard';
import { AsideMenuIAChat } from '../features/iAChat/presentation/routeIAChat';
import { AsideMenuSettings } from '../features/settings/presentation/routeSettings';
import { AsideMenuUserAdmin } from '../features/userAdmin/presentation/routeUserAdmin';
import { AsideMenuUserManagement } from '../features/userManagement/presentation/routeUserManagement';

const AppLayout = () => {
    const asideMenuItems: MenuItemButon[] = [
        AsideMenuDashboard,
        AsideMenuAgenda,
        AsideMenuIAChat,
        AsideMenuUserAdmin,
        AsideMenuUserManagement
    ];

    const asideMenuSettings: MenuItemButon[] = [AsideMenuSettings];

    return (
        <MyFlex
            direction={{
                base: 'column',
                xl: 'row'
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
                // bg={'green'}
                direction={'column'}
                // justifyContent={'center'}
                alignItems={'center'}
                width={'100%'}
                p={0}
            >
                <Outlet />
            </MyFlex>
        </MyFlex>
    );
};

export default AppLayout;
