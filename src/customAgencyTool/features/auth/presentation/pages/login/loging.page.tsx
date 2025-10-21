import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import Logo from '@src/customAgencyTool/assets/_logo/logo';
import { FormikInputPassword } from '@src/customAgencyTool/components/formik';
import { FormikInputText } from '@src/customAgencyTool/components/formik/01formikInput/formikInputText';
import { MyButton, MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import { useNotificationAdapter } from '@src/customAgencyTool/context/toastAppNotification/useNotificationAdapter';
import { PrivateRoutePath } from '@src/customAgencyTool/pages/private/privateRoutes';

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
    initialLoginUser,
    validationSchemaLoginUser,
    type LoginUser
} from '../../../domain/login.entity';
import type { InterfaceCurrentUser } from '../../../domain/user.entity';
import { Login, selectStatus } from '../../../infrastructure/authSlice';
import WireFrameWrap from '../../components/wireFrameWrap';
import { AuthRoutePath } from '../../routeAuth';

const Loging = () => {
    const dispatch = useAppDispatch();

    const navigation = useNavigate();

    const currentUserStatus = useAppSelector(selectStatus);

    const { sendNotification } = useNotificationAdapter();

    const hamdleOnSubmit = (
        values: LoginUser,
        { setSubmitting }: FormikHelpers<LoginUser>
    ) => {
        const arg = {
            email: values.email,
            password: values.password
        };

        dispatch(Login(arg))
            .then((result) => {
                const payload = result.payload as InterfaceCurrentUser;

                if (!payload) {
                    sendNotification({
                        title: '¡Error!',
                        message: 'No se pudo iniciar sesión.',
                        status: 'error'
                    });
                    return;
                }

                sendNotification({
                    title: '¡Sesión iniciada!',
                    message: 'Bienvenido de nuevo.',
                    status: 'success'
                });

                navigation(PrivateRoutePath.DASHBOARD_PAGE);
            })
            .catch((error) => {
                sendNotification({
                    title: '¡Error!',
                    message:
                        'No se pudo iniciar sesión. Error: ' +
                        JSON.stringify(error),
                    status: 'error'
                });
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleClick = () => {
        // go to home page
        navigation('/');
    };

    return (
        <WireFrameWrap>
            <Helmet>
                <title>Login</title>
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
            <MyFlex direction={'column'} width={'100%'}>
                <MyText>
                    Para iniciar sesión, por favor ingrese su correo electrónico
                    y contraseña.
                </MyText>
                <Link
                    to={`${AuthRoutePath.RESET_PASS_BY_EMAIL}`}
                    style={{
                        fontSize: '0.7rem'
                    }}
                >
                    Has olvidado la contraseña?{' '}
                    <strong
                        style={{
                            fontSize: '0.7rem',
                            color: '#007AFF',
                            fontWeight: 'semibold',
                            textDecoration: 'underline'
                        }}
                    >
                        Recupera correo.
                    </strong>
                </Link>
            </MyFlex>

            {/* <Link
                to={`${AuthRoutePath.REGISTER}`}
                style={{
                    fontSize: '0.7rem'
                }}
            >
                register
            </Link> */}

            <Formik
                initialValues={initialLoginUser}
                validationSchema={validationSchemaLoginUser}
                onSubmit={hamdleOnSubmit}
            >
                {(props: FormikProps<LoginUser>) => (
                    <Form>
                        <MyFlex direction={'column'} gap={5} mt={3}>
                            <Field
                                name="email"
                                label="Correo electrónico"
                                icon={'EMAIL'}
                                typeError={'bottom'}
                                component={FormikInputText}
                            />

                            <Field
                                name="password"
                                label="Contraseña"
                                icon={'LOCK'}
                                typeError={'bottom'}
                                component={FormikInputPassword}
                            />

                            <MyButton
                                colorPalette="submit"
                                leftIcon={'SEND'}
                                type="submit"
                                width={'100%'}
                                loading={
                                    props.isSubmitting ||
                                    currentUserStatus === ReduxStatus.LOADING
                                }
                            >
                                Aceptar
                            </MyButton>
                        </MyFlex>
                    </Form>
                )}
            </Formik>
        </WireFrameWrap>
    );
};

export default Loging;
