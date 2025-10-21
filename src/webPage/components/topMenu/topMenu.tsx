import {
    Box,
    Button,
    Container,
    Flex,
    Image,
    Link,
    Stack,
    Text,
    useBreakpointValue
} from '@chakra-ui/react';
import Logo from '@pageAsset/home/Logo1.png';
import { MyDrawer } from '@src/customAgencyTool/components/ui';
import {
    ColorModeButton,
    useColorMode
} from '@src/customAgencyTool/components/ui/color-mode';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { PageRoutes } from '@src/webPage/routes/routeManagementWebPage';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLanguage } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { useNavigate } from 'react-router';
import ComboboxDynamic, {
    type IComboboxDynItem
} from '../comboboxDynamic/comboboxDynamic';
import type { InterfaceTopMenuTranslate } from './topMenuTranslate';

interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
}

const MotionBox = motion(Box);

const DesktopNavItem = ({ item }: { item: NavItem }) => {
    const navigate = useNavigate();

    const menuDinamic = useMemo(() => {
        const menuItems: IComboboxDynItem[] = [];

        item.children?.forEach((child) => {
            menuItems.push({
                label: child.label,
                subLabel: child.subLabel,
                onClick: () => {
                    if (child.href) {
                        navigate(child.href);
                    }
                }
            });
        });

        return menuItems;
    }, [item, navigate]);

    return (
        <>
            <ComboboxDynamic
                baseIcon="ChevronDown"
                baseLabel={item.label}
                baseOnClick={() => {
                    console.log(item.label);
                }}
                comboboxItems={menuDinamic}
                selectedItem={item}
            />
        </>
    );
};

const MobileNavItem1 = ({ item }: { item: NavItem }) => {
    const [isOpen, setIsOpen] = useState({
        isOpen: false,
        name: ''
    });

    const { colorMode } = useColorMode();

    return (
        <Stack gap={4}>
            <Button
                variant="ghost"
                justifyContent="space-between"
                onClick={() => {
                    if (isOpen.isOpen) {
                        setIsOpen({
                            isOpen: false,
                            name: ''
                        });
                    } else if (item.children) {
                        setIsOpen({
                            isOpen: true,
                            name: item.label
                        });
                    }
                }}
                size="sm"
            >
                {item.children ? <IoIosArrowDown /> : undefined}
                {item.label}
            </Button>

            <AnimatePresence>
                {isOpen.isOpen && item.children && (
                    <MotionBox
                        pl={4}
                        borderLeft="2px"
                        borderStyle="solid"
                        borderColor={
                            colorMode === 'light' ? 'gray.200' : 'gray.700'
                        }
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Stack mt={2} pl={4}>
                            {item.children.map((child) => (
                                <Link
                                    key={child.label}
                                    href={child.href}
                                    _hover={{ textDecoration: 'none' }}
                                >
                                    <Stack
                                        p={2}
                                        rounded="md"
                                        _hover={{
                                            bg:
                                                colorMode === 'light'
                                                    ? 'gray.50'
                                                    : 'gray.700'
                                        }}
                                    >
                                        <Text fontSize="sm">{child.label}</Text>
                                        {child.subLabel && (
                                            <Text
                                                fontSize="xs"
                                                color="gray.500"
                                            >
                                                {child.subLabel}
                                            </Text>
                                        )}
                                    </Stack>
                                </Link>
                            ))}
                        </Stack>
                    </MotionBox>
                )}
            </AnimatePresence>
        </Stack>
    );
};

interface MobileNavItemProps {
    currentLanguage: string;
    changeLanguageHandler: () => void;
    menuItems: NavItem[];
    loginBtn?: ILogin;
}
const MobileNavView: FC<MobileNavItemProps> = ({
    currentLanguage,
    changeLanguageHandler,
    menuItems,
    loginBtn
}) => {
    const navigate = useNavigate();
    const { colorMode } = useColorMode();

    return (
        <div>
            <MyDrawer
                trigger={
                    <Flex
                        position="fixed"
                        top={0}
                        left={0}
                        right={0}
                        zIndex={1000}
                        bg={colorMode === 'light' ? 'white' : 'gray.800'}
                        direction={'row'}
                        align={'center'}
                        gap={3}
                        px={4}
                        justify={'space-between'}
                        h={'3rem'}
                        boxShadow={'md'}
                    >
                        <Text fontWeight={'medium'}>Menu</Text>

                        <Button variant={'ghost'}>
                            <SelectedIcons iconName="MENU" />
                        </Button>
                    </Flex>
                }
                footer={
                    <Flex justify={'center'} align={'center'}>
                        <Text fontSize={'sm'}>
                            © {new Date().getFullYear()} Innovando Procesos,
                            Creciendo Juntos.
                        </Text>
                    </Flex>
                }
            >
                <br />
                <Flex
                    direction={'column'}
                    gap={5}
                    mt={5}
                    h={'90%'}
                    justifyContent={'space-between'}
                >
                    <Flex justify={'center'} align={'center'}>
                        <Image src={Logo} alt="Logo" height={70} />
                    </Flex>

                    <Flex direction={'column'} h={'100%'} overflow={'auto'}>
                        {menuItems.map((item, index) => (
                            <MobileNavItem1
                                key={`mobile-nav-item-${index}`}
                                item={item}
                            />
                        ))}
                    </Flex>

                    <Flex
                        direction={'row'}
                        gap={4}
                        justifyContent={'space-around'}
                    >
                        <ColorModeButton />

                        <Button
                            color={'white'}
                            bg={'red.400'}
                            _hover={{
                                bg: 'red.300'
                            }}
                            onClick={changeLanguageHandler}
                        >
                            <FaLanguage />
                            {currentLanguage}
                        </Button>

                        {loginBtn && (
                            <Button
                                variant={'plain'}
                                onClick={() => {
                                    navigate(loginBtn.href);
                                }}
                            >
                                <SelectedIcons iconName="SEND" />
                                {loginBtn.label}
                            </Button>
                        )}
                    </Flex>
                </Flex>
            </MyDrawer>
        </div>
    );
};

interface ILogin {
    label: string;
    href: string;
}
interface DeskTopViewProps {
    currentLanguage: string;
    changeLanguageHandler: () => void;
    menuItems: NavItem[];
    loginBtn?: ILogin;
}
const DeskTopView: FC<DeskTopViewProps> = ({
    currentLanguage,
    changeLanguageHandler,
    menuItems,
    loginBtn
}) => {
    const [scrolled, setScrolled] = useState(false);
    const { colorMode } = useColorMode();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <MotionBox
            position="fixed"
            top={0}
            left={0}
            right={0}
            zIndex={1000}
            bg={colorMode === 'light' ? 'white' : 'gray.800'}
            boxShadow={scrolled ? 'lg' : 'none'}
            borderRadius={'md'}
            mx={4}
            mt={2}
            opacity={scrolled ? '1' : '0.3'}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Container maxW="8xl">
                <Flex
                    minH="60px"
                    py={2}
                    px={4}
                    align="center"
                    justify="space-around"
                >
                    <Flex justify="start">
                        <Box
                            cursor={'pointer'}
                            onClick={() => navigate(PageRoutes.home)}
                        >
                            <Image src={Logo} alt="Logo" height={70} />
                        </Box>
                    </Flex>
                    <Flex
                        direction={'row'}
                        gap={4}
                        alignItems={'center'}
                        justifyContent={'space-between'}
                    >
                        <Flex gap={3}>
                            {menuItems.map((item, index) => (
                                <DesktopNavItem
                                    key={`desktop-nav-item-${index}`}
                                    item={item}
                                />
                            ))}

                            {loginBtn && (
                                <Button
                                    variant={'plain'}
                                    onClick={() => {
                                        navigate(loginBtn.href);
                                    }}
                                >
                                    <SelectedIcons iconName="SEND" />
                                    {loginBtn.label}
                                </Button>
                            )}
                        </Flex>
                        <Flex gap={4}>
                            <ColorModeButton />

                            <Button
                                width={'80px'}
                                display={{
                                    base: 'none',
                                    md: 'inline-flex'
                                }}
                                fontSize={{
                                    base: 'sm',
                                    md: 'md',
                                    xl: 'lg'
                                }}
                                fontWeight={{ base: 400, md: 500, xl: 600 }}
                                color={'white'}
                                bg={'red.400'}
                                _hover={{
                                    bg: 'red.300'
                                }}
                                onClick={changeLanguageHandler}
                            >
                                <FaLanguage />
                                {currentLanguage}
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Container>
        </MotionBox>
    );
};

const TopMenu = () => {
    const { t, i18n } = useTranslation();

    const topMenu = t('TopMenu', {
        returnObjects: true
    }) as InterfaceTopMenuTranslate;

    const [currentLanguage, setCurrentLanguage] = useState('en');

    const [flag, setFlag] = useState(false);

    const changeLanguageHandler = () => {
        i18n.changeLanguage(flag ? 'es' : 'en');
        setFlag(!flag);
    };

    useEffect(() => {
        const getLanguage = () => {
            return (
                i18n.language ||
                (typeof window !== 'undefined' &&
                    window.localStorage.i18nextLng) ||
                'en'
            );
        };
        const currentLanguage = getLanguage();

        setCurrentLanguage(currentLanguage.toUpperCase());
    }, [i18n.language, flag, topMenu]);

    const NAV_ITEMS: Array<NavItem> = [
        {
            ...topMenu.link1
        },
        {
            ...topMenu.link2
        },
        {
            ...topMenu.link3
        }
    ];

    const sreenBreakpoint = useBreakpointValue({
        base: 'xs',
        md: 'sm',
        lg: 'md',
        xl: 'lg'
    });

    if (sreenBreakpoint && ['xs', 'sm'].includes(sreenBreakpoint)) {
        return (
            <MobileNavView
                menuItems={NAV_ITEMS}
                currentLanguage={currentLanguage}
                changeLanguageHandler={changeLanguageHandler}
                loginBtn={{
                    label: topMenu.btLogin,
                    href: '/login'
                }}
            />
        );
    } else {
        return (
            <DeskTopView
                menuItems={NAV_ITEMS}
                currentLanguage={currentLanguage}
                changeLanguageHandler={changeLanguageHandler}
                loginBtn={{
                    label: topMenu.btLogin,
                    href: '/login'
                }}
            />
        );
    }
};

export default TopMenu;
