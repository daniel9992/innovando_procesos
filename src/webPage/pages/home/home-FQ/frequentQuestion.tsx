import {
    Box,
    Container,
    HStack,
    Heading,
    SimpleGrid,
    Stack,
    Text,
    VStack
} from '@chakra-ui/react';
import { useColorModeValue } from '@src/customAgencyTool/components/ui/color-mode';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { bgGradientBlueRed } from '@src/webPage/constants/colors';
import { useTranslation } from 'react-i18next';
import type { IFrequentQuestionTranslate } from './frequentQuestionTranslate';

const FrequentQuestion = () => {
    // Replace test data with your own

    const { t } = useTranslation();

    const frequentQuestion = t('FrequentQuestion', {
        returnObjects: true
    }) as IFrequentQuestionTranslate;

    interface IFrequentQuestion {
        id: number;
        title: string;
        text: string;
    }

    const arrayFeatures: Array<IFrequentQuestion> = frequentQuestion.questions;

    const color = useColorModeValue('gray.500', 'gray.200');

    return (
        <Box p={4}>
            <Stack gap={4} as={Container} maxW={'3xl'} textAlign={'center'}>
                <Heading
                    fontSize={'6xl'}
                    bgGradient={bgGradientBlueRed}
                    className="textStroke"
                    bgClip="text"
                    pb={5}
                >
                    {frequentQuestion.title}
                </Heading>
                <Text
                    color={useColorModeValue('gray.500', 'gray.200')}
                    fontSize={'xl'}
                >
                    {frequentQuestion.text}
                </Text>
            </Stack>

            <Container maxW={'6xl'} mt={10}>
                <SimpleGrid columns={{ base: 1, sm: 1, md: 2 }} gap={10}>
                    {arrayFeatures.map((feature) => (
                        <HStack key={feature.id} align={'top'}>
                            <Box color={'green.400'} px={2} pt={5}>
                                {/* <Icon as={CheckIcon} boxSize={{ base: "20px", md: "25px" }} /> */}
                                <SelectedIcons iconName="SELECTED" />
                            </Box>
                            <VStack align={'start'}>
                                <Text
                                    fontWeight={700}
                                    bgGradient={bgGradientBlueRed}
                                    bgClip="text"
                                    fontSize="3xl"
                                >
                                    {feature.title}
                                </Text>
                                <Text color={color} fontSize="xl">
                                    {feature.text}
                                </Text>
                            </VStack>
                        </HStack>
                    ))}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default FrequentQuestion;
