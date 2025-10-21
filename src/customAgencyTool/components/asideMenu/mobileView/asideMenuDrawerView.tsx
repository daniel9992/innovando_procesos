// En un nuevo archivo: /components/MenuItem.tsx

import Logo from '@src/customAgencyTool/assets/_logo/logo';
import AuthDivGuard from '@src/customAgencyTool/guard/auth.div.guard';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { useCallback, useMemo, useState, type FC } from 'react';
import { useNavigate } from 'react-router';
import { MyButton, MyDrawer, MyFlex, MyText } from '../../ui';
import { ColorModeButton } from '../../ui/color-mode';
import type { MenuItemButon } from '../../ui/myMenu';

interface MenuItemProps {
    item: MenuItemButon;
    onClick: (url?: string) => void;
}

export const MenuItem: FC<MenuItemProps> = ({ item, onClick }) => {
    return (
        <MyFlex
            direction="column"
            gap={2}
            alignItems="center"
            width="95px"
            cursor="pointer"
            py={3}
            px={2}
            borderRadius="md"
            _hover={{ bg: 'gray.300' }}
            onClick={() => onClick(item.url)}
        >
            {/* Renderiza el ícono principal o el izquierdo/derecho */}
            {item.icon && <SelectedIcons iconName={item.icon} />}
            {item.leftIcon && <SelectedIcons iconName={item.leftIcon} />}

            <MyText
                fontSize="0.8rem"
                fontWeight="semibold"
                color="gray.600"
                textAlign="center"
            >
                {item.label}
            </MyText>
        </MyFlex>
    );
};

interface MenuGroupProps {
    title: string;
    items: MenuItemButon[];
    onItemClick: (url?: string) => void;
}

export const MenuGroup: FC<MenuGroupProps> = ({
    title,
    items,
    onItemClick
}) => {
    // Si no hay items, no renderizamos nada.
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <MyFlex
            direction="column"
            bg="rgba(0, 0, 0, 0.05)"
            borderRadius="md"
            boxShadow="md"
            p={2}
            gap={3}
        >
            <MyText fontSize="0.8rem" fontWeight="semibold" color="gray.500">
                {title}
            </MyText>

            <MyFlex
                direction="row"
                flexWrap="wrap"
                justifyContent="space-evenly"
                gap={3}
            >
                {items.map((item) => (
                    // Usamos el AuthDivGuard para controlar el acceso
                    <AuthDivGuard key={item.id} role={item.allowRoles}>
                        {/* Verificamos si el item tiene submenús para llamar a la recursión */}
                        {item.subMenus && item.subMenus.length > 0 ? (
                            <MenuGroup
                                title={item.label}
                                items={item.subMenus}
                                onItemClick={onItemClick}
                            />
                        ) : (
                            <MenuItem item={item} onClick={onItemClick} />
                        )}
                    </AuthDivGuard>
                ))}
            </MyFlex>
        </MyFlex>
    );
};

// La interfaz de props no cambia
interface AsideMenuProps {
    asideBgColor: string;
    asideTextColor: string;
    menuItems: MenuItemButon[];
    tinyMenuItems: MenuItemButon[];
    onLogout: () => void;
}

const AsideMenuDrawerView: FC<AsideMenuProps> = ({
    asideBgColor,
    asideTextColor,
    onLogout,
    menuItems,
    tinyMenuItems
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    // Simplificamos el handler para abrir/cerrar
    const toggleDrawer = useCallback(() => {
        setIsOpen((prev) => !prev);
    }, []);

    const closeDrawer = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleNavigate = useCallback(
        (path?: string) => {
            closeDrawer();
            if (path) {
                navigate(path);
            }
        },
        [navigate, closeDrawer]
    );

    const handleLogout = useCallback(() => {
        closeDrawer();
        onLogout();
    }, [onLogout, closeDrawer]);

    // Usamos useMemo para evitar recalcular en cada render
    const { itemsWithSubMenus, itemsWithoutSubMenus } = useMemo(() => {
        const withSubMenus: MenuItemButon[] = [];
        const withoutSubMenus: MenuItemButon[] = [];

        menuItems.forEach((item) => {
            if (item.subMenus && item.subMenus.length > 0) {
                withSubMenus.push(item);
            } else {
                withoutSubMenus.push(item);
            }
        });

        return {
            itemsWithSubMenus: withSubMenus,
            itemsWithoutSubMenus: withoutSubMenus
        };
    }, [menuItems]);

    // El footer también se podría mover a su propio componente (MenuFooter.tsx)
    const renderFooter = () => (
        <MyFlex
            direction="row"
            justifyContent="center"
            gap={2}
            borderTopWidth="1px"
            w="100%"
        >
            <ColorModeButton />
            {tinyMenuItems.map(
                (item) =>
                    item.isActive && (
                        <AuthDivGuard key={item.id} role={item.allowRoles}>
                            <MyButton
                                icon={item.leftIcon}
                                aria-label={item.label}
                                variant="ghost"
                                onClick={() => item.onClick?.()}
                                url={item.url}
                            />
                        </AuthDivGuard>
                    )
            )}
            <MyButton
                icon="SignOut"
                aria-label="Cerrar sesión"
                variant="ghost"
                onClick={handleLogout}
            />
        </MyFlex>
    );

    return (
        <>
            <MyFlex
                as="header"
                py={1}
                bg={asideBgColor}
                color={asideTextColor}
                direction="row"
                align="center"
                justify="space-between"
                px={5}
                boxShadow="md"
                m={1}
            >
                <MyText fontSize="xl" fontWeight="bold">
                    Menú
                </MyText>
                <MyButton
                    icon={isOpen ? 'CLOSEMODAL' : 'MENU'}
                    aria-label="Abrir menú"
                    onClick={toggleDrawer}
                />
            </MyFlex>

            <MyDrawer
                isOpen={isOpen}
                onOpenChange={closeDrawer}
                placement="start"
                header="Menú"
                footer={renderFooter()}
            >
                <MyFlex justify="center" align="center" mb={2} boxShadow="md">
                    <Logo size="6rem" />
                </MyFlex>

                <MyFlex direction="column" gap={4} width="100%">
                    {/* Renderizamos el grupo de opciones principales */}
                    <MenuGroup
                        title="Opciones"
                        items={itemsWithoutSubMenus}
                        onItemClick={handleNavigate}
                    />

                    {/* Renderizamos cada grupo que tiene submenús */}
                    {itemsWithSubMenus.map((menuGroup) => (
                        <MenuGroup
                            key={menuGroup.id}
                            title={menuGroup.label}
                            items={menuGroup.subMenus ?? []}
                            onItemClick={handleNavigate}
                        />
                    ))}
                </MyFlex>
            </MyDrawer>
        </>
    );
};

export default AsideMenuDrawerView;

// import Logo from '@src/customAgencyTool/assets/_logo/logo';
// import AuthDivGuard from '@src/customAgencyTool/guard/auth.div.guard';
// import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
// import { type FC, useCallback, useRef, useState } from 'react';
// import { useNavigate } from 'react-router';
// import { MyButton, MyDrawer, MyFlex, MyText } from '../../ui';
// import { ColorModeButton } from '../../ui/color-mode';
// import type { MenuItemButon } from '../../ui/myMenu';

// // Componente principal del menú lateral, ahora refactorizado
// interface AsideMenuProps {
//     asideBgColor: string;
//     asideTextColor: string;
//     menuItems: MenuItemButon[];
//     tinyMenuItems: MenuItemButon[];
//     onLogout: () => void;
// }

// const AsideMenuDrawerView: FC<AsideMenuProps> = ({
//     asideBgColor,
//     asideTextColor,
//     onLogout,
//     menuItems,
//     tinyMenuItems
// }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const btnRef = useRef(null);
//     const navigation = useNavigate();

//     const handledOpen = useCallback(() => {
//         setIsOpen(true);
//     }, [setIsOpen]);

//     const handledClose = useCallback(() => {
//         setIsOpen(false);
//     }, [setIsOpen]);

//     const handledLogout = () => {
//         handledClose();
//         onLogout();
//     };

//     const handledOnNavigate = (path: string | undefined) => {
//         handledClose();
//         if (!path) return;

//         navigation(path);
//     };

//     // Separamos los items con y sin submenús para agrupar los que no tienen
//     const itemsWithSubMenus = menuItems.filter(
//         (item) => item.subMenus && item.subMenus.length > 0
//     );

//     const itemsWithoutSubMenus = menuItems.filter(
//         (item) => !item.subMenus || item.subMenus.length === 0
//     );

//     const futterRender = () => (
//         <MyFlex
//             flexDirection={'row'}
//             justifyContent={'center'}
//             gap={2}
//             borderTopWidth={'1px'}
//             w={'100%'}
//         >
//             <ColorModeButton />

//             {tinyMenuItems.map((item, index) => {
//                 if (item.isActive === false) return null;
//                 return (
//                     <AuthDivGuard
//                         key={`key-tiny-menu-item-${index}`}
//                         role={item.allowRoles}
//                     >
//                         <MyButton
//                             key={`key-tiny-menu-item-${item.label}`}
//                             icon={item.leftIcon}
//                             aria-label={item.label}
//                             variant={'ghost'}
//                             color={'white'}
//                             // colorPalette={'aside'}
//                             onClick={() => item.onClick?.()}
//                             url={item.url}
//                         />
//                     </AuthDivGuard>
//                 );
//             })}
//             {/* <AuthDivGuard role={[RoleUser.ADMIN]}>
//                 <MyButton
//                     icon={'COG'}
//                     aria-label="Configuración"
//                     size={'sm'}
//                     variant={'ghost'}
//                     // onClick={() => handledOnClick(PrivateRoutes.SETTINGS)}
//                     url={'/dashboard/' + SettingsRoutPath.SETTINGS_PAGE}
//                 />
//             </AuthDivGuard> */}
//             <MyButton
//                 icon={'SignOut'}
//                 aria-label="Cerrar sesion"
//                 size={'sm'}
//                 variant={'ghost'}
//                 onClick={handledLogout}
//             />
//         </MyFlex>
//     );

//     return (
//         <>
//             <MyFlex
//                 as="header"
//                 // w="full"
//                 py={1}
//                 bg={asideBgColor}
//                 color={asideTextColor}
//                 direction={'row'}
//                 align="center"
//                 justify="space-between"
//                 px={5}
//                 boxShadow="md"
//                 m={1}
//             >
//                 <MyText fontSize="xl" fontWeight="bold" p={0} m={0}>
//                     Menú
//                 </MyText>
//                 <MyButton
//                     ref={btnRef}
//                     icon={isOpen ? 'CLOSEMODAL' : 'MENU'}
//                     aria-label="Abrir menú"
//                     onClick={isOpen ? handledClose : handledOpen}
//                 />
//             </MyFlex>

//             <MyDrawer
//                 isOpen={isOpen}
//                 onOpenChange={handledClose}
//                 placement={'start'}
//                 header={'Menú'}
//                 footer={futterRender()}
//             >
//                 <MyFlex
//                     justifyContent={'center'}
//                     alignItems={'center'}
//                     mb={2}
//                     boxShadow={'md'}
//                 >
//                     <Logo size={'6rem'} />
//                 </MyFlex>

//                 <MyFlex direction={'column'} gap={3} width={'100%'} p={0} m={0}>
//                     <MyFlex
//                         display={
//                             itemsWithoutSubMenus.length > 0 ? 'flex' : 'none'
//                         }
//                         direction="column"
//                         bg={'rgba(0, 0, 0, 0.1)'}
//                         borderRadius={'md'}
//                         boxShadow={'md'}
//                         p={2}
//                     >
//                         <MyText
//                             fontSize="0.8rem"
//                             fontWeight={'semibold'}
//                             color={'gray'}
//                             mb={3}
//                         >
//                             Opciones
//                         </MyText>
//                         {/* <p>Menu: {itemsWithoutSubMenus.length}</p>
//                         {itemsWithoutSubMenus.map((item, index) => (
//                             <p key={'menuItem-noSubMenu-drawer-' + index}>
//                                 {item.label}
//                             </p>
//                         ))} */}
//                         <MyFlex
//                             direction={'row'}
//                             flexWrap={'wrap'}
//                             justifyContent={'space-evenly'}
//                             gap={3}
//                         >
//                             {itemsWithoutSubMenus.map((item) => (
//                                 <MyFlex
//                                     key={
//                                         'menuItem-noSubMenu-drawer-' +
//                                         item.label
//                                     }
//                                     direction={'column'}
//                                     gap={3}
//                                     alignItems={'center'}
//                                     width={'95px'}
//                                     _hover={{
//                                         bg: 'gray.300'
//                                     }}
//                                     cursor={'pointer'}
//                                     py={3}
//                                     px={2}
//                                     onClick={() => handledOnNavigate(item.url)}
//                                 >
//                                     {item.icon && (
//                                         <SelectedIcons iconName={item.icon} />
//                                     )}
//                                     {item.leftIcon && (
//                                         <SelectedIcons
//                                             iconName={item.leftIcon}
//                                             mr={2}
//                                         />
//                                     )}
//                                     {item.rightIcon && (
//                                         <SelectedIcons
//                                             iconName={item.rightIcon}
//                                             ml={2}
//                                         />
//                                     )}

//                                     <MyText
//                                         fontSize="0.8rem"
//                                         fontWeight={'semibold'}
//                                         color={'gray'}
//                                         textAlign={'center'}
//                                     >
//                                         {item.label}
//                                     </MyText>
//                                 </MyFlex>
//                             ))}
//                         </MyFlex>
//                     </MyFlex>

//                     {itemsWithSubMenus.map((item, index) => (
//                         <MyFlex
//                             key={'menuItem-withSubMenu-drawer-' + index}
//                             direction="column"
//                             bg={'rgba(0, 0, 0, 0.1)'}
//                             borderRadius={'md'}
//                             boxShadow={'md'}
//                             p={2}
//                         >
//                             <MyText
//                                 fontSize="0.8rem"
//                                 fontWeight={'semibold'}
//                                 color={'gray'}
//                                 mb={3}
//                             >
//                                 {item.label}
//                             </MyText>
//                             <MyFlex
//                                 direction={'row'}
//                                 flexWrap={'wrap'}
//                                 justifyContent={'space-evenly'}
//                                 gap={3}
//                                 p={0}
//                             >
//                                 {item.subMenus?.map((etem, endex) => {
//                                     if (
//                                         etem.subMenus &&
//                                         etem.subMenus.length > 0
//                                     ) {
//                                         return (
//                                             <MyFlex
//                                                 key={
//                                                     `menuItem-withSubMenu-${etem}-drawer-` +
//                                                     index
//                                                 }
//                                                 direction="column"
//                                                 borderRadius={'md'}
//                                                 border={'1px solid gray'}
//                                                 p={2}
//                                                 width={'100%'}
//                                             >
//                                                 <MyText
//                                                     fontSize="0.8rem"
//                                                     fontWeight={'semibold'}
//                                                     color={'gray'}
//                                                     mb={3}
//                                                 >
//                                                     {item.label}
//                                                 </MyText>
//                                                 <MyFlex
//                                                     key={
//                                                         `menuItem-withSubMenu-${endex}-drawer-` +
//                                                         etem
//                                                     }
//                                                     direction={'row'}
//                                                     flexWrap={'wrap'}
//                                                     justifyContent={
//                                                         'space-evenly'
//                                                     }
//                                                     gap={3}
//                                                 >
//                                                     {etem.subMenus.map(
//                                                         (utem, undex) => (
//                                                             <MyFlex
//                                                                 key={`menuItem-noSubMenu-${endex}--drawer-${undex}`}
//                                                                 direction={
//                                                                     'column'
//                                                                 }
//                                                                 gap={3}
//                                                                 alignItems={
//                                                                     'center'
//                                                                 }
//                                                                 width={'95px'}
//                                                                 _hover={{
//                                                                     bg: 'gray.300'
//                                                                 }}
//                                                                 cursor={
//                                                                     'pointer'
//                                                                 }
//                                                                 py={3}
//                                                                 px={2}
//                                                                 onClick={() =>
//                                                                     handledOnNavigate(
//                                                                         utem.url
//                                                                     )
//                                                                 }
//                                                             >
//                                                                 {utem.icon && (
//                                                                     <SelectedIcons
//                                                                         iconName={
//                                                                             utem.icon
//                                                                         }
//                                                                     />
//                                                                 )}
//                                                                 {utem.leftIcon && (
//                                                                     <SelectedIcons
//                                                                         iconName={
//                                                                             utem.leftIcon
//                                                                         }
//                                                                         mr={2}
//                                                                     />
//                                                                 )}
//                                                                 {utem.rightIcon && (
//                                                                     <SelectedIcons
//                                                                         iconName={
//                                                                             utem.rightIcon
//                                                                         }
//                                                                         ml={2}
//                                                                     />
//                                                                 )}

//                                                                 <MyText
//                                                                     fontSize="0.8rem"
//                                                                     fontWeight={
//                                                                         'semibold'
//                                                                     }
//                                                                     color={
//                                                                         'gray'
//                                                                     }
//                                                                     textAlign={
//                                                                         'center'
//                                                                     }
//                                                                 >
//                                                                     {utem.label}
//                                                                 </MyText>
//                                                             </MyFlex>
//                                                         )
//                                                     )}
//                                                 </MyFlex>
//                                             </MyFlex>
//                                         );
//                                     }

//                                     return (
//                                         <MyFlex
//                                             key={
//                                                 'menuItem-noSubMenu-drawer-' +
//                                                 item.label
//                                             }
//                                             direction={'column'}
//                                             gap={3}
//                                             alignItems={'center'}
//                                             width={'95px'}
//                                             _hover={{
//                                                 bg: 'gray.300'
//                                             }}
//                                             cursor={'pointer'}
//                                             py={3}
//                                             px={2}
//                                             onClick={() =>
//                                                 handledOnNavigate(item.url)
//                                             }
//                                         >
//                                             {item.icon && (
//                                                 <SelectedIcons
//                                                     iconName={item.icon}
//                                                 />
//                                             )}
//                                             {item.leftIcon && (
//                                                 <SelectedIcons
//                                                     iconName={item.leftIcon}
//                                                     mr={2}
//                                                 />
//                                             )}
//                                             {item.rightIcon && (
//                                                 <SelectedIcons
//                                                     iconName={item.rightIcon}
//                                                     ml={2}
//                                                 />
//                                             )}

//                                             <MyText
//                                                 fontSize="0.8rem"
//                                                 fontWeight={'semibold'}
//                                                 color={'gray'}
//                                                 textAlign={'center'}
//                                             >
//                                                 {item.label}
//                                             </MyText>
//                                         </MyFlex>
//                                     );
//                                 })}
//                             </MyFlex>
//                         </MyFlex>
//                     ))}
//                 </MyFlex>
//             </MyDrawer>
//         </>
//     );
// };

// export default AsideMenuDrawerView;
