import { useBreakpointValue } from '@chakra-ui/react';
import { AppConfig } from '@src/customAgencyTool/_appConfig/appConfig';
import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import {
    Logout,
    selectCurrentUser
} from '@src/customAgencyTool/features/auth/infrastructure/authSlice';
import { type FC, memo, useEffect, useState } from 'react';
import { useColorModeValue } from '../ui/color-mode';
import type { MenuItemButon } from '../ui/myMenu';
import AsideMenuDesktopView from './desktopView/asideMenuDesktopView';
import AsideMenuDrawerView from './mobileView/asideMenuDrawerView';

interface AsideMenuProps {
    menuItems: MenuItemButon[];
    tinyMenuItems: MenuItemButon[];
    // Ejemplo de cómo podrías pasar el rol actual
    // currentRole: string;
}

const AsideMenuBeforeMemo: FC<AsideMenuProps> = ({
    menuItems,
    tinyMenuItems
}) => {
    /**
     *  ? ----------------------------------
     *  *  Variables
     *  ? ----------------------------------
     */

    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);

    const displayMode = useBreakpointValue<string>({
        base: 'mobile',
        md: 'tablet',
        xl: 'desktop'
    });

    const asideBgColor = useColorModeValue(
        AppConfig.PrimaryColor,
        AppConfig.PrimaryColorDark
    );
    const asideTextColor = useColorModeValue('white', 'white');

    /**
     *  ? ----------------------------------
     *  *  Handled Filter by Role
     *  ? ----------------------------------
     */
    const [filterdMenuItems, setFilterdMenuItems] = useState<MenuItemButon[]>(
        []
    );

    // Filtrar menuItems basado en currentRole (si se implementa)
    useEffect(() => {
        const allowedRole = currentUser.role;

        const filterdMenuItems = menuItems.filter((item) => {
            if (item.isActive) {
                return item.allowRoles.includes(allowedRole);
            }
            return false;
        });

        setFilterdMenuItems(filterdMenuItems);
    }, [currentUser, menuItems]);

    const handledLogout = () => {
        dispatch(Logout());
    };

    /**
     *  ? ----------------------------------
     *  *  Render
     *  ? ----------------------------------
     */
    // Vista para Mobile/Tablet (Drawer en la parte superior)
    if (displayMode === 'mobile' || displayMode === 'tablet') {
        return (
            <AsideMenuDrawerView
                asideBgColor={asideBgColor}
                asideTextColor={asideTextColor}
                onLogout={handledLogout}
                menuItems={filterdMenuItems}
                tinyMenuItems={tinyMenuItems}
            />
        );
    }

    // Vista para Desktop (Aside con iconos, flyouts para submenús)
    return (
        <AsideMenuDesktopView
            asideBgColor={asideBgColor}
            asideTextColor={asideTextColor}
            onLogout={handledLogout}
            menuItems={filterdMenuItems}
            tinyMenuItems={tinyMenuItems}
        />
    );
};

const AsideMenu = memo(AsideMenuBeforeMemo);

export default AsideMenu;
