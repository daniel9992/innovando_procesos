import {
    Box,
    Flex,
    Image,
    Stack,
    Text,
    VStack,
    useBreakpointValue
} from '@chakra-ui/react';
import HeroImg from '@pageAsset/home/2310.jpg';
import LogoIMG from '@pageAsset/home/Logo1.png';
import BtnAction from '@src/webPage/components/button/btnAction';
import { PageRoutes } from '@src/webPage/routes/routeManagementWebPage';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { InterfaceHomeHeroTranslate } from './homeHeroTranslate';

const HomeHero = () => {
    const { t } = useTranslation();

    const homeHero = t('HomeHero', {
        returnObjects: true
    }) as InterfaceHomeHeroTranslate;

    const navigate = useNavigate();

    const handledOnNavigate = (path: string) => {
        navigate(path);
    };

    const scrollToID = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Flex
            w={'full'}
            h={'105vh'}
            backgroundImage={`url(${HeroImg})`}
            backgroundSize={'cover'}
            backgroundPosition={'center center'}
        >
            <VStack
                w={'full'}
                justify={'center'}
                px={useBreakpointValue({ base: 4, md: 8 })}
                bgGradient={'linear(to-r, blackAlpha.600, transparent)'}
            >
                <Stack maxW={'2xl'} align={'flex-start'} gap={6}>
                    <Box>
                        <Image
                            src={LogoIMG}
                            alt="Logo"
                            objectFit={'cover'}
                            mx={'auto'}
                            height={{ base: '150px', md: '180px', xl: '250px' }}
                            my={10}
                        />
                        <Text
                            color={'white'}
                            fontWeight={700}
                            lineHeight={1.2}
                            fontSize={useBreakpointValue({
                                base: '3xl',
                                md: '4xl'
                            })}
                            textAlign={'center'}
                        >
                            {homeHero.title}
                        </Text>
                    </Box>

                    <Stack
                        direction={'row'}
                        mx={'auto'}
                        mt={5}
                        gap={4}
                        wrap={'wrap'}
                    >
                        <BtnAction
                            text={homeHero.button3}
                            background="#e0a118"
                            onClick={() => handledOnNavigate(PageRoutes.sentio)}
                        />
                    </Stack>
                    <Stack
                        direction={'row'}
                        mx={'auto'}
                        mt={5}
                        gap={4}
                        wrap={'wrap'}
                        justify={'center'}
                    >
                        <BtnAction
                            text={homeHero.button2}
                            background="#0b08d4"
                            onClick={() => handledOnNavigate(PageRoutes.info)}
                        />
                        <BtnAction
                            text={homeHero.button1}
                            background="#b6280f"
                            onClick={() => scrollToID(`callToAction`)}
                        />
                    </Stack>
                </Stack>
            </VStack>
        </Flex>
    );
};

export default HomeHero;
