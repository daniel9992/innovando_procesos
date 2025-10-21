import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import Logo from '@src/customAgencyTool/assets/_logo/logo';
import { FormikInputText } from '@src/customAgencyTool/components/formik';
import {
    MyButton,
    MyFlex,
    MyHeading,
    MyText
} from '@src/customAgencyTool/components/ui';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import { useNotificationAdapter } from '@src/customAgencyTool/context/toastAppNotification/useNotificationAdapter';
import { PublicRoutePath } from '@src/customAgencyTool/pages/public/publicRoutes';
import {
    Field,
    Form,
    Formik,
    type FormikHelpers,
    type FormikProps
} from 'formik';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router';
import {
    initialResetPasswordCredentials,
    validationSchemaResetPasswordCredentials,
    type IResetPasswordCredentials
} from '../../../domain/resetPass.entity';
import {
    ResetPassword,
    selectStatus
} from '../../../infrastructure/authSlice';
import WireFrameWrap from '../../components/wireFrameWrap';

const SendPassResetByEmail = () => {
    const dispatch = useAppDispatch();

    const selectedUserState = useAppSelector(selectStatus);

    const { sendNotification } = useNotificationAdapter();

    const navigation = useNavigate();

    const handleClick = () => {
        // go to home page
        navigation('/');
    };

    const hamdleOnSubmit = (
        values: IResetPasswordCredentials,
        { setSubmitting }: FormikHelpers<IResetPasswordCredentials>
    ) => {
        dispatch(ResetPassword(values)).then(() => {
            sendNotification({
                title: '¡Restablecimiento de contraseña exitoso!',
                message:
                    'Por favor, comprueba tu correo electrónico, para activar tu cuenta.',
                status: 'success'
            });

            setSubmitting(false);
            navigation(PublicRoutePath.LOGIN);
        });
    };

    return (
        <WireFrameWrap>
            <Helmet>
                <title>Enviar restablecimiento de contraseña</title>
            </Helmet>

            <MyFlex
                maxHeight={'300px'}
                maxWidth={'300px'}
                justifyContent={'center'}
                cursor={'pointer'}
                onClick={handleClick}
                mx={'auto'}
            >
                <Logo />
            </MyFlex>

            <MyFlex direction={'column'} gap={2}>
                <MyHeading>Restablecimiento de contraseña</MyHeading>
                <MyText>
                    Para restablecer la contraseña, ingrese su correo
                    electrónico.
                </MyText>
                <Link
                    to={`${PublicRoutePath.LOGIN}`}
                    style={{
                        fontSize: '0.8rem'
                    }}
                >
                    Volver a{' '}
                    <strong
                        style={{
                            fontSize: '0.8rem',
                            color: '#007AFF',
                            fontWeight: 'semibold',
                            textDecoration: 'underline'
                        }}
                    >
                        iniciar sesión
                    </strong>
                </Link>

                <Formik
                    initialValues={initialResetPasswordCredentials}
                    validationSchema={
                        validationSchemaResetPasswordCredentials
                    }
                    onSubmit={hamdleOnSubmit}
                >
                    {(props: FormikProps<IResetPasswordCredentials>) => (
                        <Form>
                            <MyFlex direction={'column'} gap={5} mt={3}>
                                <Field
                                    name="email"
                                    label="Correo electrónico"
                                    icon={'EMAIL'}
                                    typeError={'bottom'}
                                    component={FormikInputText}
                                />
                                <MyButton
                                    colorPalette="submit"
                                    leftIcon={'SEND'}
                                    type="submit"
                                    width={'150px'}
                                    mx={'auto'}
                                    loading={
                                        props.isSubmitting ||
                                        selectedUserState ===
                                            ReduxStatus.LOADING
                                    }
                                >
                                    Enviar
                                </MyButton>
                            </MyFlex>
                        </Form>
                    )}
                </Formik>
            </MyFlex>
        </WireFrameWrap>
    );
};

export default SendPassResetByEmail;
