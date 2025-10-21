import {
    Box,
    chakra,
    Container,
    Image,
    SimpleGrid,
    Stack,
    Text,
    VisuallyHidden
} from '@chakra-ui/react';
import LogoIMG from '@pageAsset/home/Logo1.png';
import { useColorModeValue } from '@src/customAgencyTool/components/ui/color-mode';
import { PageRoutes } from '@src/webPage/routes/routeManagementWebPage';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import type { IFooterTranslate } from './footerTranslate';

const Footer = () => {
    const navigate = useNavigate();

    const handledOnNavigate = (path: string) => {
        navigate(path);
    };

    const { t } = useTranslation();

    const footerTranslate = t('Footer', {
        returnObjects: true
    }) as IFooterTranslate;

    const showData = footerTranslate;

    // interface IFormValues {
    //     email: string;
    // }
    // const initialValue = {
    //     email: ''
    // };

    // const toast = useToast();

    // const handleSubmit = (
    //     values: IFormValues,
    //     actions: FormikHelpers<IFormValues>
    // ) => {
    //     console.log(values);
    //     actions.setSubmitting(false);

    //     // toast({
    //     //     title: showData.subscription.toastTitle,
    //     //     description: showData.subscription.toastDescription,
    //     //     status: 'success',
    //     //     duration: 9000,
    //     //     isClosable: true
    //     // });

    //     actions.resetForm();
    // };

    // const bgInput = useColorModeValue('blackAlpha.100', 'whiteAlpha.100');

    return (
        <Box
            mt={{ base: 10, xl: 20 }}
            bg={useColorModeValue('gray.50', 'gray.900')}
            color={useColorModeValue('gray.700', 'gray.200')}
        >
            <Container as={Stack} maxW={'6xl'} py={10}>
                <SimpleGrid
                    templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }}
                    gap={8}
                >
                    <Stack gap={6}>
                        <Box>
                            <Image
                                src={LogoIMG}
                                alt="Logo"
                                height={70}
                                mx={'auto'}
                                onClick={() =>
                                    handledOnNavigate(PageRoutes.home)
                                }
                                cursor={'pointer'}
                            />
                        </Box>
                        <Text fontSize={'sm'}>
                            © {new Date().getFullYear()} Innovando Procesos,
                            Creciendo Juntos.
                            <br />
                            {showData.rights}
                        </Text>
                        <Stack direction={'row'} gap={6}>
                            <SocialButton label={'Twitter'} href={'#'}>
                                <FaTwitter />
                            </SocialButton>
                            <SocialButton label={'YouTube'} href={'#'}>
                                <FaYoutube />
                            </SocialButton>
                            <SocialButton label={'Instagram'} href={'#'}>
                                <FaInstagram />
                            </SocialButton>
                        </Stack>
                    </Stack>

                    <Stack align={'flex-start'}>
                        <ListHeader>{showData.column1.title}</ListHeader>
                        {showData.column1.list.map((column, index) => (
                            <Box
                                as="a"
                                // href={column.href}
                                key={`column1-${index}`}
                                _hover={{
                                    textDecoration: 'none',
                                    color: 'blue.400'
                                }}
                            >
                                {column.label}
                            </Box>
                        ))}
                    </Stack>

                    <Stack align={'flex-start'}>
                        <ListHeader>{showData.column2.title}</ListHeader>
                        {showData.column2.list.map((column, index) => (
                            <Box
                                as="a"
                                // href={column.href}
                                key={`column2-${index}`}
                                _hover={{
                                    textDecoration: 'none',
                                    color: 'blue.400'
                                }}
                            >
                                {column.label}
                            </Box>
                        ))}
                    </Stack>

                    {/* <Stack align={'flex-start'}>
                        <ListHeader>{showData.subscription.title}</ListHeader>
                        <Formik
                            initialValues={initialValue}
                            onSubmit={handleSubmit}
                        >
                            {(formikProps: FormikProps<IFormValues>) => {
                                const {
                                    values,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit
                                } = formikProps;

                                return (
                                    <Form onSubmit={handleSubmit}>
                                        <Stack direction={'row'}>
                                            <Field name={'email'}>
                                                {({
                                                    field,
                                                    form
                                                }: FieldProps) => {
                                                    const isError =
                                                        form.touched[
                                                            field.name
                                                        ] &&
                                                        form.errors[field.name];

                                                    return (
                                                        <FormControl
                                                            isInvalid={
                                                                isError
                                                                    ? true
                                                                    : false
                                                            }
                                                        >
                                                            <Input
                                                                placeholder={
                                                                    showData
                                                                        .subscription
                                                                        .placeHolder
                                                                }
                                                                bg={bgInput}
                                                                border={0}
                                                                _focus={{
                                                                    bg: 'whiteAlpha.300'
                                                                }}
                                                                value={
                                                                    values.email
                                                                }
                                                                type={'email'}
                                                                name="email"
                                                                onChange={
                                                                    handleChange
                                                                }
                                                                onBlur={
                                                                    handleBlur
                                                                }
                                                            />
                                                        </FormControl>
                                                    );
                                                }}
                                            </Field>

                                            <Button
                                                type={'submit'}
                                                bg={'red.400'}
                                                color={'white'}
                                                _hover={{
                                                    bg: 'green.600'
                                                }}
                                                aria-label="Subscribe"
                                            >
                                                <SelectedIcons iconName="SEND" />
                                            </Button>
                                        </Stack>  
                                    </Form>
                                );
                            }}
                        </Formik>
                    </Stack> */}
                </SimpleGrid>
            </Container>
        </Box>
    );
};

export default Footer;

const SocialButton = ({
    children,
    label,
    href
}: {
    children: ReactNode;
    label: string;
    href: string;
}) => {
    const navigate = useNavigate();
    return (
        <chakra.button
            bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
            rounded={'full'}
            w={8}
            h={8}
            cursor={'pointer'}
            as={'a'}
            // href={href}
            display={'inline-flex'}
            alignItems={'center'}
            justifyContent={'center'}
            transition={'background 0.3s ease'}
            _hover={{
                bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200')
            }}
            onClick={() => {
                navigate(href);
            }}
        >
            <VisuallyHidden>{label}</VisuallyHidden>
            {children}
        </chakra.button>
    );
};

const ListHeader = ({ children }: { children: ReactNode }) => {
    return (
        <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
            {children}
        </Text>
    );
};
