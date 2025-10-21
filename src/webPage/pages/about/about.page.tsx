import {
    Card,
    CardBody,
    Center,
    Flex,
    Grid,
    GridItem,
    Heading,
    Stack,
    Text,
    useBreakpointValue
} from '@chakra-ui/react';
import AboutImg from '@pageAsset/about/bg.jpg';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { useColorModeValue } from '@src/customAgencyTool/components/ui/color-mode';
import { bgGradientBlueRed } from '@src/webPage/constants/colors';
import type { InterfaceAboutTranslate } from './aboutTranslate';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const gridTemplatesColumns = useBreakpointValue({
        base: ` 
      "1fr" 
     `,
        md: ` 
      "1fr 1fr" 
       `,
        lg: ` 
      "1fr 1fr 1fr" 
       `
    });

    const gridTemplatesRows = useBreakpointValue({
        base: ` 
      "1fr"
      "1fr"
      "1fr"
      "1fr"
      "1fr"
      "1fr"
      "1fr"
      "1fr"
     `,
        md: ` 
      "1fr 1fr"
      "1fr 1fr"
      "1fr 1fr"
      "1fr 1fr"
      "1fr 1fr"
      "1fr 1fr"`,
        lg: ` 
        1fr 1fr 1fr 
         `
    });

    const gridTemplateAreas = useBreakpointValue({
        base: ` 
      "item1"
      "item2"
      "item3"
      "item4"
      "item5"
      "item6"
      "item7"`,
        md: ` 
      "item1 item2"
      "item1 item3"
      "item4 item4"
      "item5 item7"
      "item6 item7"
    `,
        lg: ` 
      "item1 item3 item6"
      "item1 item4 item7"
      "item2 item5 item7"
         `
    });

    const headerSyle = {
        bgGradient: bgGradientBlueRed,
        bgClip: 'text',
        className: 'textStroke',
        fontStyle: 'italic'
    };

    const propsStyle = {
        bg: useColorModeValue('whiteSmoke', 'gray.800'),
        borderRadius: 10,
        border: '3px solid #19364990',
        shadow: 'xl'
    };

    const textCardSyle = {
        fontSize: '19px',
        lineHeight: '2',
        fontWeight: 600
    };

    const { t } = useTranslation();

    const aboutTranslate = t('About', {
        returnObjects: true
    }) as InterfaceAboutTranslate;

    return (
        <div>
            <Helmet>
                <title>About</title>
            </Helmet>

            <Center
                minH={{ base: '80vh', md: '70vh' }}
                backgroundImage={`url(${AboutImg})`}
                backgroundSize={'cover'}
                backgroundPosition={'center center'}
                pb={5}
            >
                <Card.Root
                    w={'full'}
                    mx={{ base: '5', md: 'auto' }}
                    maxW={'3xl'}
                    textAlign={'center'}
                    shadow={'2xl'}
                    bg={useColorModeValue('gray.50', 'gray.800')}
                >
                    <CardBody>
                        <Stack gap="4">
                            <Heading
                                fontWeight={600}
                                fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                                mb={3}
                                lineHeight={'110%'}
                            >
                                {aboutTranslate.title} <br />
                                <Text as={'span'} {...headerSyle}>
                                    {aboutTranslate.subtitle}
                                </Text>
                            </Heading>

                            <Text color={'gray.500'} fontSize={'18px'}>
                                {aboutTranslate.text}
                            </Text>
                        </Stack>
                    </CardBody>
                </Card.Root>
            </Center>

            <Grid
                mt={-10}
                maxWidth={{ base: '100vw', md: '90vw', lg: '80vw' }}
                mx={{ base: '5', md: 'auto' }}
                gridTemplateColumns={gridTemplatesColumns}
                gridTemplateRows={gridTemplatesRows}
                gap={4}
                gridTemplateAreas={gridTemplateAreas}
            >
                {aboutTranslate.cardlist.map((card, index) => (
                    <GridItem
                        {...propsStyle}
                        gridArea={'item' + (index + 1)}
                        //1
                    >
                        <Flex
                            direction={'column'}
                            justifyContent={'center'}
                            h="100%"
                            p={3}
                            my={2}
                            borderRadius={'10px'}
                        >
                            <Heading
                                fontSize={{ base: '2xl', sm: '4xl', md: '6xl' }}
                                mb={3}
                                {...headerSyle}
                            >
                                {card.title}
                            </Heading>
                            <Text {...textCardSyle}>{card.text}</Text>
                        </Flex>
                    </GridItem>
                ))}
            </Grid>
        </div>
    );
};

export default About;
