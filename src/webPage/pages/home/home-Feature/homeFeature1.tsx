import { Flex, Heading, Image, Stack, Text } from '@chakra-ui/react';
import Feture1IMG from '@pageAsset/home/job-5382501_1280.jpg';
import Feture2IMG from '@pageAsset/home/taking-notes-3475991_1280.jpg';
import Feture3IMG from '@pageAsset/home/whiteboard-849812_1280.jpg';

import { useTranslation } from 'react-i18next';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { useColorModeValue } from '@src/customAgencyTool/components/ui/color-mode';

import BtnColor from '@src/webPage/components/button/btnColor';
import { bgGradientBlueRed } from '@src/webPage/constants/colors';
import { PageRoutes } from '@src/webPage/routes/routeManagementWebPage';
import type { IHomeFeatureTranslate } from './homeFeatureTranslate';

export const HomeFeature = () => {
    const navigate = useNavigate();

    const handledOnNavigate = (path: string) => {
        navigate(path);
    };

    return (
        <div>
            <HomeFeature1 handledOnNavigate={handledOnNavigate} />
            <HomeFeature2 handledOnNavigate={handledOnNavigate} />
            <HomeFeature3 handledOnNavigate={handledOnNavigate} />
        </div>
    );
};

interface IHomeFeatureProps {
    handledOnNavigate?: (path: string) => void;
}

export const HomeFeature1: React.FC<IHomeFeatureProps> = ({
    handledOnNavigate = () => {}
}) => {
    const { t } = useTranslation();

    const homeFeture1 = t('HomeFeature1', {
        returnObjects: true
    }) as IHomeFeatureTranslate;

    return (
        <Stack minH={'50vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex>
                <Image
                    alt={'Login Image'}
                    objectFit={'cover'}
                    width={{ base: '100vw', md: '50vw' }}
                    src={Feture1IMG}
                />
            </Flex>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack gap={6} w={'full'} maxW={'lg'}>
                    <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                        <Text
                            as={'span'}
                            position={'relative'}
                            bgGradient={bgGradientBlueRed}
                            bgClip="text"
                            className="textStroke"
                        >
                            {homeFeture1.title}
                        </Text>
                        <br />{' '}
                        <Text
                            bgGradient={bgGradientBlueRed}
                            bgClip="text"
                            as={'span'}
                            className="textStroke"
                        >
                            {homeFeture1.title1}
                        </Text>{' '}
                    </Heading>
                    <Text
                        fontSize={{ base: 'md', lg: 'lg' }}
                        color={useColorModeValue('gray.500', 'gray.200')}
                    >
                        {homeFeture1.description}
                    </Text>
                    <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                        <BtnColor
                            Icon={MdKeyboardDoubleArrowRight}
                            text={homeFeture1.link}
                            onClick={() =>
                                handledOnNavigate(`${PageRoutes.info}#adn`)
                            }
                        />
                    </Stack>
                </Stack>
            </Flex>
        </Stack>
    );
};

export const HomeFeature2: React.FC<IHomeFeatureProps> = ({
    handledOnNavigate = () => {}
}) => {
    const { t } = useTranslation();

    const homeFeture2 = t('HomeFeature2', {
        returnObjects: true
    }) as IHomeFeatureTranslate;

    return (
        <Stack
            minH={'50vh'}
            direction={{
                base: 'column-reverse',
                //sm: "column-reverse",
                md: 'row'
            }}
        >
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack gap={6} w={'full'} maxW={'lg'}>
                    <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                        <Text
                            as={'span'}
                            position={'relative'}
                            bgGradient={bgGradientBlueRed}
                            className="textStroke"
                            bgClip="text"
                        >
                            {homeFeture2.title}
                        </Text>
                        <br />{' '}
                        <Text
                            bgGradient={bgGradientBlueRed}
                            bgClip="text"
                            as={'span'}
                            className="textStroke"
                        >
                            {homeFeture2.title1}
                        </Text>{' '}
                    </Heading>
                    <Text
                        fontSize={{ base: 'md', lg: 'lg' }}
                        color={useColorModeValue('gray.500', 'gray.200')}
                    >
                        {homeFeture2.description}
                    </Text>
                    <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                        <BtnColor
                            Icon={MdKeyboardDoubleArrowRight}
                            text={homeFeture2.link}
                            onClick={() =>
                                handledOnNavigate(
                                    `${PageRoutes.info}#profesional-advice`
                                )
                            }
                        />
                    </Stack>
                </Stack>
            </Flex>

            <Flex>
                <Image
                    alt={'Login Image'}
                    objectFit={'cover'}
                    width={{ base: '100vw', md: '50vw' }}
                    src={Feture2IMG}
                />
            </Flex>
        </Stack>
    );
};

export const HomeFeature3: React.FC<IHomeFeatureProps> = ({
    handledOnNavigate = () => {}
}) => {
    const { t } = useTranslation();

    const homeFeture3 = t('HomeFeature3', {
        returnObjects: true
    }) as IHomeFeatureTranslate;

    return (
        <Stack minH={'50vh'} direction={{ base: 'column', md: 'row' }}>
            <Flex>
                <Image
                    alt={'Login Image'}
                    objectFit={'cover'}
                    width={{ base: '100vw', md: '50vw' }}
                    src={Feture3IMG}
                />
            </Flex>
            <Flex p={8} flex={1} align={'center'} justify={'center'}>
                <Stack gap={6} w={'full'} maxW={'lg'}>
                    <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
                        <Text
                            as={'span'}
                            position={'relative'}
                            bgGradient={bgGradientBlueRed}
                            className="textStroke"
                            bgClip="text"
                        >
                            {homeFeture3.title}
                        </Text>
                        <br />{' '}
                        <Text
                            bgGradient={bgGradientBlueRed}
                            bgClip="text"
                            as={'span'}
                            className="textStroke"
                        >
                            {homeFeture3.title1}
                        </Text>{' '}
                    </Heading>
                    <Text
                        fontSize={{ base: 'md', lg: 'lg' }}
                        color={useColorModeValue('gray.500', 'gray.200')}
                    >
                        {homeFeture3.description}
                    </Text>
                    <Stack direction={{ base: 'column', md: 'row' }} gap={4}>
                        <BtnColor
                            Icon={MdKeyboardDoubleArrowRight}
                            text={homeFeture3.link}
                            onClick={() =>
                                handledOnNavigate(
                                    `${PageRoutes.info}#process-refinement`
                                )
                            }
                        />
                    </Stack>
                </Stack>
            </Flex>
        </Stack>
    );
};
