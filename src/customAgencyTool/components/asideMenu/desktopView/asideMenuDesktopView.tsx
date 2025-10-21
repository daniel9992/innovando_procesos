import { useAppSelector } from '@src/customAgencyTool/app/hooks';
import Logo from '@src/customAgencyTool/assets/_logo/logo';
import { selectCurrentUser } from '@src/customAgencyTool/features/auth/infrastructure/authSlice';
import AuthDivGuard from '@src/customAgencyTool/guard/auth.div.guard';
import { type FC } from 'react';
import { MyButton, MyDivider, MyFlex } from '../../ui';
import { ColorModeButton } from '../../ui/color-mode';
import { MyMenu, type MenuItemButon } from '../../ui/myMenu';

interface AsideMenuProps {
    asideBgColor: string;
    asideTextColor: string;
    menuItems: MenuItemButon[];
    tinyMenuItems: MenuItemButon[];
    onLogout: () => void;
}

const AsideMenuDesktopView: FC<AsideMenuProps> = ({
    asideBgColor,
    asideTextColor,
    menuItems,
    tinyMenuItems,
    onLogout
}) => {
    const currentUser = useAppSelector(selectCurrentUser);

    const handledLogout = () => {
        onLogout();
    };

    return (
        <MyFlex
            as="aside"
            direction="column"
            w="65px" // Ancho del aside colapsado
            h="100vh"
            bg={asideBgColor}
            color={asideTextColor}
            boxShadow="md"
            alignItems="center"
            py={4}
            p={0}
            borderRadius={'0px'}
            justifyContent={'space-between'}
            gap={2}
        >
            <MyFlex flex={1} alignContent={'center'} justifyContent={'center'}>
                <MyFlex my={'auto'}>
                    <Logo />
                </MyFlex>
            </MyFlex>

            <MyDivider m={0} p={0} />
            <MyFlex
                direction="column"
                flex={8}
                alignContent={'center'}
                justifyContent={'center'}
            >
                {menuItems.map((item) => {
                    if (item.subMenus && item.subMenus.length > 0) {
                        return (
                            <MyMenu
                                key={`key-${item.id}`}
                                placement={'right-start'}
                                triggerAsChild={
                                    <MyButton
                                        icon={
                                            item.leftIcon ||
                                            item.rightIcon ||
                                            item.icon
                                        }
                                        aria-label={item.label}
                                        variant={'ghost'}
                                        colorPalette={'aside'}
                                        onClick={() => item.onClick?.()}
                                    />
                                }
                                verticalMenuItems={item.subMenus.filter(
                                    (item) => {
                                        if (
                                            item.allowRoles.includes(
                                                currentUser.role
                                            )
                                        ) {
                                            return true;
                                        }
                                        return false;
                                    }
                                )}
                            />
                        );
                    } else {
                        return (
                            <AuthDivGuard key={item.id} role={item.allowRoles}>
                                <MyButton
                                    key={`key-${item.id}`}
                                    icon={
                                        item.leftIcon ||
                                        item.rightIcon ||
                                        item.icon
                                    }
                                    aria-label={item.label}
                                    variant={'ghost'}
                                    colorPalette={'aside'}
                                    url={item.url}
                                    onClick={() => item.onClick?.()}
                                />
                            </AuthDivGuard>
                        );
                    }
                })}
            </MyFlex>
            <MyDivider m={0} p={0} />
            <MyFlex
                flex={1}
                direction={'column'}
                alignContent={'center'}
                justifyContent={'center'}
                gap={2}
            >
                <ColorModeButton color={'white'} />

                {tinyMenuItems.map((item, index) => {
                    if (item.isActive === false) return null;
                    return (
                        <AuthDivGuard
                            key={`key-tiny-menu-item-${index}`}
                            role={item.allowRoles}
                        >
                            <MyButton
                                key={`key-tiny-menu-item-${item.label}`}
                                icon={item.leftIcon}
                                aria-label={item.label}
                                variant={'ghost'}
                                color={'white'}
                                // colorPalette={'aside'}
                                onClick={() => item.onClick?.()}
                                url={item.url}
                            />
                        </AuthDivGuard>
                    );
                })}

                <MyButton
                    icon={'EXIT'}
                    aria-label="Cerrar sesion"
                    size={'sm'}
                    variant={'ghost'}
                    colorPalette={'aside'}
                    onClick={handledLogout}
                />
            </MyFlex>
        </MyFlex>
    );
};

export default AsideMenuDesktopView;
