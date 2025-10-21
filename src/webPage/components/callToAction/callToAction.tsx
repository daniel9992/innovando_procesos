// import {
//     Box,
//     Button,
//     Flex,
//     Heading,
//     IconButton,
//     Input,
//     InputGroup,
//     Stack,
//     Text,
//     Textarea,
//     Tooltip,
//     useClipboard,
//     VStack
// } from '@chakra-ui/react';
// import { BsGithub, BsLinkedin, BsPerson, BsTwitter } from 'react-icons/bs';
// import { MdEmail, MdOutlineEmail } from 'react-icons/md';

// import BgCallToAction from '@pageAsset/callToAction/callToAction.jpg';
// import { useColorModeValue } from '@src/customAgencyTool/components/ui/color-mode';
// import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
// import { bgGradientBlueRed } from '@src/webPage/constants/colors';
// import {
//     ErrorMessage,
//     Field,
//     Form,
//     Formik,
//     type FieldProps,
//     type FormikHelpers,
//     type FormikProps
// } from 'formik';
// import { useTranslation } from 'react-i18next';
// import { BiMailSend } from 'react-icons/bi';
// import * as Yup from 'yup';
// import type { ICallToActionTranslate } from './calltoActionTranslate';

// const CallToAction = () => {
//     const { hasCopied, onCopy } = useClipboard('example@example.com');

//     const { t } = useTranslation();

//     const callToActionTranslate = t('CallToAction', {
//         returnObjects: true
//     }) as ICallToActionTranslate;

//     interface IFormValues {
//         name: string;
//         email: string;
//         message: string;
//         isRead: boolean;
//         date: Date;
//     }

//     const initialValue = {
//         name: '',
//         email: '',
//         message: '',
//         isRead: false,
//         date: GetToday()
//     };

//     const validSchema = Yup.object().shape({
//         name: Yup.string()
//             .min(2, callToActionTranslate.isNameMinLength)
//             .max(50, callToActionTranslate.isNameMaxLength)
//             .required(callToActionTranslate.isRequiredName),
//         email: Yup.string().email(callToActionTranslate.isRequiredEmail),
//         message: Yup.string()
//             .min(10, callToActionTranslate.isMessageMinLength)
//             .max(1000, callToActionTranslate.isMessageMaxLength)
//             .required(callToActionTranslate.isRequiredMessage)
//     });

//     const toast = useToast();

//     const handleSubmit = (
//         values: IFormValues,
//         actions: FormikHelpers<IFormValues>
//     ) => {
//         console.log(values);
//         actions.setSubmitting(false);

//         toast({
//             title: callToActionTranslate.subscriptionToastTitle,
//             description: callToActionTranslate.subscriptionToastDescription,
//             status: 'success',
//             duration: 9000,
//             isClosable: true
//         });
//     };

//     return (
//         <Flex
//             id="callToAction"
//             bg={useColorModeValue('gray.100', 'gray.900')}
//             align="center"
//             justify="center"
//             bgSize="cover"
//             position="center"
//             css={{
//                 backgroundImage: `url(${BgCallToAction})`,
//                 minHeight: '80vh',

//                 backgroundAttachment: 'fixed',
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center'
//             }}
//         >
//             <Box
//                 borderRadius="lg"
//                 m={{ base: 5, md: 16, lg: 10 }}
//                 p={{ base: 5, lg: 16 }}
//             >
//                 <Box>
//                     <VStack
//                         gap={{ base: 4, md: 8, lg: 20 }}
//                         bg={useColorModeValue('white', 'gray.700')}
//                         p={{ base: 2, lg: 10 }}
//                         borderRadius={10}
//                         shadow="base"
//                     >
//                         <Box>
//                             <Heading
//                                 fontSize={{
//                                     base: '4xl',
//                                     md: '5xl'
//                                 }}
//                                 bgGradient={bgGradientBlueRed}
//                                 bgClip="text"
//                                 className="textStroke"
//                             >
//                                 {callToActionTranslate.title}
//                             </Heading>
//                             <Text
//                                 textAlign={'center'}
//                                 mt={{ base: 2, md: 4, lg: 6 }}
//                             >
//                                 {callToActionTranslate.subtitle}
//                             </Text>
//                         </Box>

//                         <Stack
//                             gap={{ base: 4, md: 8, lg: 20 }}
//                             direction={{ base: 'column', md: 'row' }}
//                         >
//                             <Stack
//                                 align="center"
//                                 justify="space-around"
//                                 direction={{ base: 'row', md: 'column' }}
//                             >
//                                 <Tooltip
//                                     label={
//                                         hasCopied
//                                             ? callToActionTranslate.copiedEmail
//                                             : callToActionTranslate.copyEmail
//                                     }
//                                     closeOnClick={false}
//                                     hasArrow
//                                 >
//                                     <IconButton
//                                         aria-label="email"
//                                         variant="ghost"
//                                         size="lg"
//                                         fontSize="3xl"
//                                         icon={<MdEmail />}
//                                         _hover={{
//                                             bg: 'red.400',
//                                             color: useColorModeValue(
//                                                 'white',
//                                                 'gray.700'
//                                             )
//                                         }}
//                                         onClick={onCopy}
//                                         isRound
//                                     />
//                                 </Tooltip>

//                                 <Box as="a" href="#">
//                                     <IconButton
//                                         aria-label="github"
//                                         variant="ghost"
//                                         size="lg"
//                                         fontSize="3xl"
//                                         icon={<BsGithub />}
//                                         _hover={{
//                                             bg: 'red.400',
//                                             color: useColorModeValue(
//                                                 'white',
//                                                 'gray.700'
//                                             )
//                                         }}
//                                         isRound
//                                     />
//                                 </Box>

//                                 <Box as="a" href="#">
//                                     <IconButton
//                                         aria-label="twitter"
//                                         variant="ghost"
//                                         size="lg"
//                                         icon={<BsTwitter size="28px" />}
//                                         _hover={{
//                                             bg: 'red.400',
//                                             color: useColorModeValue(
//                                                 'white',
//                                                 'gray.700'
//                                             )
//                                         }}
//                                         isRound
//                                     />
//                                 </Box>

//                                 <Box as="a" href="#">
//                                     <IconButton
//                                         aria-label="linkedin"
//                                         variant="ghost"
//                                         size="lg"
//                                         icon={<BsLinkedin size="28px" />}
//                                         _hover={{
//                                             bg: 'red.400',
//                                             color: useColorModeValue(
//                                                 'white',
//                                                 'gray.700'
//                                             )
//                                         }}
//                                         isRound
//                                     />
//                                 </Box>
//                             </Stack>

//                             <VStack
//                                 gap={5}
//                                 width={{
//                                     base: '320px',
//                                     md: '400px',
//                                     xl: '500px'
//                                 }}
//                                 mb={{ base: 2, md: 4, lg: 6 }}
//                             >
//                                 <Formik
//                                     initialValues={initialValue}
//                                     onSubmit={handleSubmit}
//                                     validationSchema={validSchema}
//                                 >
//                                     {(
//                                         formikProps: FormikProps<IFormValues>
//                                     ) => {
//                                         const { handleSubmit } = formikProps;
//                                         return (
//                                             <Form
//                                                 onSubmit={handleSubmit}
//                                                 style={{ width: '100%' }}
//                                             >
//                                                 <Field name={'name'}>
//                                                     {({
//                                                         field,
//                                                         form
//                                                     }: FieldProps) => {
//                                                         const isError =
//                                                             form.touched[
//                                                                 field.name
//                                                             ] &&
//                                                             form.errors[
//                                                                 field.name
//                                                             ];
//                                                         return (
//                                                             <FormControl
//                                                                 mb={5}
//                                                                 isInvalid={
//                                                                     isError
//                                                                         ? true
//                                                                         : false
//                                                                 }
//                                                                 isRequired
//                                                             >
//                                                                 <FormLabel>
//                                                                     {
//                                                                         callToActionTranslate.name
//                                                                     }
//                                                                 </FormLabel>

//                                                                 <InputGroup>
//                                                                     <InputLeftElement>
//                                                                         <BsPerson />
//                                                                     </InputLeftElement>
//                                                                     <Input
//                                                                         type="text"
//                                                                         {...field}
//                                                                         placeholder={
//                                                                             callToActionTranslate.placeHolderName
//                                                                         }
//                                                                     />
//                                                                 </InputGroup>

//                                                                 <ErrorMessage name="name">
//                                                                     {(msg) => (
//                                                                         <FormErrorMessage>
//                                                                             {
//                                                                                 msg
//                                                                             }
//                                                                         </FormErrorMessage>
//                                                                     )}
//                                                                 </ErrorMessage>
//                                                             </FormControl>
//                                                         );
//                                                     }}
//                                                 </Field>

//                                                 <Field name={'email'}>
//                                                     {({
//                                                         field,
//                                                         form
//                                                     }: FieldProps) => {
//                                                         const isError =
//                                                             form.touched[
//                                                                 field.name
//                                                             ] &&
//                                                             form.errors[
//                                                                 field.name
//                                                             ];
//                                                         return (
//                                                             <FormControl
//                                                                 mb={5}
//                                                                 isInvalid={
//                                                                     isError
//                                                                         ? true
//                                                                         : false
//                                                                 }
//                                                                 isRequired
//                                                             >
//                                                                 <FormLabel>
//                                                                     {
//                                                                         callToActionTranslate.email
//                                                                     }
//                                                                 </FormLabel>

//                                                                 <InputGroup>
//                                                                     <InputLeftElement>
//                                                                         <MdOutlineEmail />
//                                                                     </InputLeftElement>
//                                                                     <Input
//                                                                         type={
//                                                                             'email'
//                                                                         }
//                                                                         {...field}
//                                                                         placeholder={
//                                                                             callToActionTranslate.placeHolderEmail
//                                                                         }
//                                                                     />
//                                                                 </InputGroup>
//                                                                 <ErrorMessage name="email">
//                                                                     {(msg) => (
//                                                                         <FormErrorMessage>
//                                                                             {
//                                                                                 msg
//                                                                             }
//                                                                         </FormErrorMessage>
//                                                                     )}
//                                                                 </ErrorMessage>
//                                                             </FormControl>
//                                                         );
//                                                     }}
//                                                 </Field>

//                                                 <Field name={'message'}>
//                                                     {({
//                                                         field,
//                                                         form
//                                                     }: FieldProps) => {
//                                                         const isError =
//                                                             form.touched[
//                                                                 field.name
//                                                             ] &&
//                                                             form.errors[
//                                                                 field.name
//                                                             ];
//                                                         return (
//                                                             <FormControl
//                                                                 mb={5}
//                                                                 isInvalid={
//                                                                     isError
//                                                                         ? true
//                                                                         : false
//                                                                 }
//                                                                 isRequired
//                                                             >
//                                                                 <FormLabel>
//                                                                     {
//                                                                         callToActionTranslate.message
//                                                                     }
//                                                                 </FormLabel>

//                                                                 <Textarea
//                                                                     placeholder={
//                                                                         callToActionTranslate.placeHolderMessage
//                                                                     }
//                                                                     {...field}
//                                                                     rows={10}
//                                                                     resize="none"
//                                                                 />
//                                                                 <ErrorMessage name="message">
//                                                                     {(msg) => (
//                                                                         <FormErrorMessage>
//                                                                             {
//                                                                                 msg
//                                                                             }
//                                                                         </FormErrorMessage>
//                                                                     )}
//                                                                 </ErrorMessage>
//                                                             </FormControl>
//                                                         );
//                                                     }}
//                                                 </Field>

//                                                 <Button
//                                                     colorScheme="red"
//                                                     type="submit"
//                                                     _hover={{
//                                                         bg: 'red.400'
//                                                     }}
//                                                     width="full"
//                                                     leftIcon={<BiMailSend />}
//                                                 >
//                                                     {
//                                                         callToActionTranslate.submitButton
//                                                     }
//                                                 </Button>
//                                             </Form>
//                                         );
//                                     }}
//                                 </Formik>
//                             </VStack>
//                         </Stack>
//                     </VStack>
//                 </Box>
//             </Box>
//         </Flex>
//     );
// };

// export default CallToAction;
