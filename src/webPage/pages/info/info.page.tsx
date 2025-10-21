import {
    Box,
    Card,
    Center,
    chakra,
    Container,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';
import InfoImg from '@pageAsset/info/bg.jpg';
import { useColorModeValue } from '@src/customAgencyTool/components/ui/color-mode';
import { bgGradientBlueRed } from '@src/webPage/constants/colors';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import type { IntoTranslate } from './infoTranslate';

const InfoPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { t } = useTranslation();

    const infoTranslate = t('Info', {
        returnObjects: true
    }) as IntoTranslate;

    return (
        <Box>
            <Helmet>
                <title>Info</title>
            </Helmet>
            <Center
                minH={{ base: '80vh', md: '70vh' }}
                backgroundImage={`url(${InfoImg})`}
                backgroundSize={'cover'}
                backgroundPosition={'center center'}
                pb={5}
            >
                <Card.Root
                    w={'full'}
                    maxW={'3xl'}
                    textAlign={'center'}
                    shadow={'2xl'}
                    bg={useColorModeValue('gray.50', 'gray.800')}
                >
                    <Card.Body>
                        <Stack gap="4">
                            <Heading
                                fontWeight={600}
                                fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                                lineHeight={'110%'}
                            >
                                {infoTranslate.title} <br />
                                <Text
                                    as={'span'}
                                    //color={"green.400"}
                                    bgGradient={bgGradientBlueRed}
                                    bgClip="text"
                                    className="textStroke"
                                    fontStyle={'italic'}
                                >
                                    {infoTranslate.subtitle}
                                </Text>
                            </Heading>

                            <Text color={'gray.500'} fontSize={'18px'}>
                                {infoTranslate.text}
                            </Text>
                        </Stack>
                    </Card.Body>
                </Card.Root>
            </Center>

            {infoTranslate.sectionsList.map((section, index) => (
                <SectionWithCTA data={section} key={`section-${index}`} />
            ))}
        </Box>
    );
};

export default InfoPage;

interface Step {
    heading: string;
    text: string;
}
interface Section {
    id: string;
    img: string;
    title: string;
    description: string;
    steps: Array<Step>;
}

interface InterfaceGridListWithCTAProps {
    data: Section;
}

const SectionWithCTA = ({ data }: InterfaceGridListWithCTAProps) => {
    const { id, title, description, steps, img } = data;
    return (
        <Box
            as={Container}
            maxW="7xl"
            p={8}
            minH={'55vh'}
            // border={'1px solid red'}
            boxShadow={'md'}
            borderRadius={'10px'}
            my={5}
        >
            <Grid
                templateColumns={{
                    base: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(2, 1fr)'
                }}
                gap={5}
                my={8}
            >
                <GridItem colSpan={1}>
                    <VStack alignItems="flex-start" gap="20px">
                        <chakra.h2
                            fontSize="3xl"
                            fontWeight="700"
                            id={id}
                            letterSpacing={'wide'}
                        >
                            {title}
                        </chakra.h2>
                    </VStack>
                </GridItem>
                <GridItem>
                    <Flex>
                        <chakra.p
                            fontSize={'16px'}
                            letterSpacing={'wide'}
                            lineHeight={'1.8'}
                        >
                            {description}
                        </chakra.p>
                    </Flex>
                </GridItem>
            </Grid>
            {/* <Divider mt={12} mb={12} /> */}
            <Flex border={'1px solid #99999926'} mt={12} mb={12} />
            <Grid
                templateColumns={{
                    base: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)'
                }}
                gap={{ base: '8', sm: '12', md: '16' }}
            >
                {steps.map((step, index) => (
                    <GridItem key={`step-${index}`}>
                        <VStack alignItems="flex-start" gap="20px">
                            <chakra.h3
                                fontSize="xl"
                                fontWeight="700"
                                letterSpacing={'wide'}
                            >
                                {step.heading}
                            </chakra.h3>
                            <chakra.p
                                fontSize={'16px'}
                                letterSpacing={'wide'}
                                lineHeight={'1.8'}
                            >
                                {step.text}
                            </chakra.p>
                        </VStack>
                    </GridItem>
                ))}
                <GridItem>
                    <Image
                        src={img}
                        alt="Info Image"
                        width={'full'}
                        height={'full'}
                        objectFit={'cover'}
                        borderRadius={'10px'}
                    />
                </GridItem>
            </Grid>
        </Box>
    );
};
