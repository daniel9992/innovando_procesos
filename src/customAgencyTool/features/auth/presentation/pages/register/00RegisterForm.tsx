import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import {
    MyButton,
    MyFlex,
    MyProgress
} from '@src/customAgencyTool/components/ui';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import { useNotificationAdapter } from '@src/customAgencyTool/context/toastAppNotification/useNotificationAdapter';
import { PublicRoutePath } from '@src/customAgencyTool/pages/public/publicRoutes';
import type { FormikHelpers, FormikProps } from 'formik';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type RefObject
} from 'react';
import { useNavigate } from 'react-router';
import type { IRegisterUserData } from '../../../application/register.useCase';
import {
    RegisterNewUser,
    selectStatus
} from '../../../infrastructure/authSlice';
import FormEmailAndPassword from './01FormEmailAndPassword';
import FormUserInfo, { type InterfaceUserData } from './02FormUserInfo';
import type { InterfaceEmailAndPass } from './register.entity';

const RegisterForm = () => {
    const [step, setStep] = useState(1);

    const dispatch = useAppDispatch();

    const { sendNotification } = useNotificationAdapter();

    const registerState = useAppSelector(selectStatus);

    const [isSudmit, setIsSudmit] = useState(false);

    const navigation = useNavigate();
    /**
     *  ? -----------------------------
     *  * Handle on Submit Email And Pass
     *  ? -----------------------------
     */
    const formikEmailPass = useRef<FormikProps<InterfaceEmailAndPass>>(null);

    const [emailPass, setEmailPass] = useState<
        InterfaceEmailAndPass | undefined
    >();

    const handleOnSubmitEmailAndPass = (
        values: InterfaceEmailAndPass,
        { setSubmitting }: FormikHelpers<InterfaceEmailAndPass>
    ) => {
        setEmailPass(values);
        setSubmitting(false);
    };

    /**
     *  ? -----------------------------
     *  * Handle on Submit User Info
     *  ? -----------------------------
     */
    const formikUserInfo = useRef<FormikProps<InterfaceUserData>>(null);

    const [userInfo, setUserInfo] = useState<InterfaceUserData | undefined>();

    const handleOnSubmitUserInfo = (
        values: InterfaceUserData,
        { setSubmitting }: FormikHelpers<InterfaceUserData>
    ) => {
        setUserInfo(values);
        setSubmitting(false);
    };

    /**
     *  ? -----------------------------
     *  * Handle on Create User
     *  ? -----------------------------
     */
    const CreateUserWithEmail = useCallback(
        (emailPass: InterfaceEmailAndPass, userInfo: InterfaceUserData) => {
            const args: IRegisterUserData = {
                email: emailPass.email,
                password: emailPass.password,
                name: userInfo.name,
                phone: userInfo.phone,
                img: userInfo.img,
                birthday: userInfo.birthday
            };

            dispatch(RegisterNewUser(args)).then(() => {
                sendNotification({
                    title: '¡Registro exitoso!',
                    message:
                        'Por favor, comprueba tu correo electrónico, para activar tu cuenta.',
                    status: 'success'
                });
                navigation(PublicRoutePath.LOGIN);
            });
        },
        [dispatch, sendNotification, navigation]
    );

    useEffect(() => {
        //emailPass && formikUserInfo &&
        if (isSudmit && emailPass && userInfo) {
            setIsSudmit(false);
            // console.log(emailPass);
            // console.log(userInfo);

            CreateUserWithEmail(emailPass, userInfo);
        }
    }, [isSudmit, emailPass, userInfo, CreateUserWithEmail]);

    /**
     *  ? -----------------------------
     *  * Handle back and next step
     *  ? -----------------------------
     */
    const handleBackStep = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    };

    const handleNextStep = () => {
        const formikRef = step === 1 ? formikEmailPass : formikUserInfo;

        formikRef.current?.handleSubmit();

        const hasErrors =
            Object.keys(formikRef.current?.errors || {}).length > 0;
        if (hasErrors) return;

        if (step < 2) {
            setStep((prev) => prev + 1);
        }
    };

    /**
     *  ? -----------------------------
     *  * Handle on Aceptar
     *  ? -----------------------------
     */
    const handledOnAceptar = () => {
        const formikRef = step === 1 ? formikEmailPass : formikUserInfo;

        formikRef.current?.handleSubmit();

        const hasErrors =
            Object.keys(formikRef.current?.errors || {}).length > 0;
        if (hasErrors) return;

        setIsSudmit(true);
    };

    /**
     *  ? -----------------------------
     *  * Render
     *  ? -----------------------------
     */
    return (
        <MyFlex direction={'column'} gap={3} py={'1rem'}>
            <MyProgress
                //label="Registrando"
                value={step}
                max={2}
                colorPalette="blue"
            />
            <br />
            {step === 1 && (
                <FormEmailAndPassword
                    formRef={
                        formikEmailPass as RefObject<
                            FormikProps<InterfaceEmailAndPass>
                        >
                    }
                    values={emailPass}
                    handledOnSubmit={handleOnSubmitEmailAndPass}
                />
            )}
            {step === 2 && (
                <FormUserInfo
                    formRef={
                        formikUserInfo as RefObject<
                            FormikProps<InterfaceUserData>
                        >
                    }
                    values={userInfo}
                    handledOnSubmit={handleOnSubmitUserInfo}
                />
            )}
            <MyFlex
                direction={'row'}
                justifyContent={'space-between'}
                gap={1}
                w={'full'}
                p={0}
                m={0}
            >
                <MyFlex
                    direction={'row'}
                    justifyContent={'space-between'}
                    gap={1}
                >
                    <MyButton
                        onClick={handleBackStep}
                        isDisabled={step === 1}
                        // colorPalette="teal"
                        w="7rem"
                        size={'sm'}
                        leftIcon={'ArrowLeft'}
                    >
                        Atras
                    </MyButton>
                    <MyButton
                        w="7rem"
                        isDisabled={step === 2}
                        onClick={handleNextStep}
                        // colorPalette="teal"
                        size={'sm'}
                        rightIcon={'ArrowRight'}
                    >
                        Siguiente
                    </MyButton>
                </MyFlex>
                <MyFlex direction={'row'}>
                    {step === 2 && (
                        <MyButton
                            w="7rem"
                            colorPalette="submit"
                            onClick={handledOnAceptar}
                            loading={registerState === ReduxStatus.LOADING}
                            leftIcon={'SUBMIT'}
                        >
                            Aceptar
                        </MyButton>
                    )}
                </MyFlex>
            </MyFlex>
        </MyFlex>
    );
};

export default RegisterForm;
