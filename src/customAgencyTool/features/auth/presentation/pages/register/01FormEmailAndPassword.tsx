import {
    FormikInputPassword,
    FormikInputText
} from '@src/customAgencyTool/components/formik';
import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import {
    MyFlex,
    MyHeading,
    MyText
} from '@src/customAgencyTool/components/ui';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import DOMPurify from 'dompurify';
import {
    Field,
    Form,
    Formik,
    type FormikHelpers,
    type FormikProps
} from 'formik';
import {
    useEffect,
    useState,
    type ChangeEvent,
    type FC,
    type Ref
} from 'react';
import * as Yup from 'yup';
import {
    initialValues,
    type InterfaceEmailAndPass,
    type PasswordRule,
    type PasswordRules
} from './register.entity';

// Componente para mostrar reglas de contraseña
const PasswordRuleIndicator: FC<{
    isValid: boolean;
    message: string;
}> = ({ isValid, message }) => (
    <MyFlex align="center" gap={2} p={0} m={0}>
        <SelectedIcons
            iconName={isValid ? 'CHECK' : 'CLOSE'}
            color={isValid ? 'green' : 'gray'}
        />

        <MyText fontSize="sm" color={isValid ? 'green.500' : 'gray.500'}>
            {message}
        </MyText>
    </MyFlex>
);

interface IFormEmailAndPassword {
    formRef?: Ref<FormikProps<InterfaceEmailAndPass>>;
    values?: InterfaceEmailAndPass;
    handledOnSubmit?: (
        values: InterfaceEmailAndPass,
        acctions: FormikHelpers<InterfaceEmailAndPass>
    ) => void;
}

const FormEmailAndPassword: FC<IFormEmailAndPassword> = ({
    formRef,
    values,
    handledOnSubmit = () => {}
}) => {
    const [isRefresh, setIsRefresh] = useState(false);
    const [passwordRules, setPasswordRules] = useState<PasswordRules>({
        minLength: false,
        hasNumber: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasSpecialChar: false
    });

    const [startInitValues, setStartInitValues] =
        useState<InterfaceEmailAndPass>(initialValues);

    useEffect(() => {
        if (values) {
            setIsRefresh(true);

            setStartInitValues(values);

            // Validar contraseña al cargar los valores
            validatePassword(values.password);

            setTimeout(() => {
                setIsRefresh(false);
            }, 100);
        }
    }, [values]);

    // Reglas de validación de contraseña
    const PASSWORD_RULES: PasswordRule[] = [
        {
            id: 'minLength',
            rule: /^.{6,}$/,
            message: 'Mínimo 6 caracteres',
            isValid: passwordRules.minLength
        },
        {
            id: 'hasNumber',
            rule: /\d/,
            message: 'Al menos un número',
            isValid: passwordRules.hasNumber
        },
        {
            id: 'hasUpperCase',
            rule: /[A-Z]/,
            message: 'Al menos una mayúscula',
            isValid: passwordRules.hasUpperCase
        },
        {
            id: 'hasLowerCase',
            rule: /[a-z]/,
            message: 'Al menos una minúscula',
            isValid: passwordRules.hasLowerCase
        },
        {
            id: 'hasSpecialChar',
            rule: /[@$!%*?&]/,
            message: 'Al menos un carácter especial (@$!%*?&)',
            isValid: passwordRules.hasSpecialChar
        }
    ];

    // Validar contraseña en tiempo real
    const validatePassword = (password: string) => {
        setPasswordRules({
            minLength: password.length >= 6,
            hasNumber: /\d/.test(password),
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasSpecialChar: /[@$!%*?&]/.test(password)
        });
    };

    // Schema de validación
    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Se requiere un correo electrónico válido')
            .required('Se requiere un correo electrónico'),
        password: Yup.string()
            .min(6, 'La contraseña debe tener al menos 6 caracteres')
            .matches(/[0-9]/, 'Debe incluir al menos un número')
            .matches(/[A-Z]/, 'Debe incluir al menos una mayúscula')
            .matches(/[a-z]/, 'Debe incluir al menos una minúscula')
            .matches(
                /[@$!%*?&]/,
                'Debe incluir al menos un carácter especial'
            )
            .required('Se requiere una contraseña'),
        confirmPassword: Yup.string()
            .oneOf(
                [Yup.ref('password')],
                'Las contraseñas deben coincidir'
            )
            .required('Se requiere confirmación de la contraseña')
    });

    const handleSubmit = (
        values: InterfaceEmailAndPass,
        acctions: FormikHelpers<InterfaceEmailAndPass>
    ) => {
        const copyData: InterfaceEmailAndPass = {
            email: DOMPurify.sanitize(values.email),
            password: DOMPurify.sanitize(values.password),
            confirmPassword: DOMPurify.sanitize(values.confirmPassword)
        };
        handledOnSubmit(copyData, acctions);
    };

    if (isRefresh) {
        return (
            <MyFlex
                display={isRefresh ? 'none' : 'flex'}
                direction={'column'}
                gap={3}
                height={'250px'}
                justifyContent={'center'}
                mx={'auto'}
            >
                <LoadingWithText text={'Cargando...'} />
            </MyFlex>
        );
    }

    return (
        <div>
            <MyHeading
                w="100%"
                textAlign={'center'}
                fontSize="2rem"
                fontWeight="normal"
                mb="2rem"
            >
                Registro de Usuario
            </MyHeading>

            <Formik
                innerRef={formRef}
                initialValues={startInitValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {(props: FormikProps<InterfaceEmailAndPass>) => (
                    <Form>
                        <MyFlex direction="column" gap={3}>
                            <Field
                                name="email"
                                label="Email del usuario"
                                icon="EMAIL"
                                component={FormikInputText}
                            />

                            {/* Indicadores de reglas de contraseña */}
                            <MyFlex
                                direction="column"
                                // gap={1}
                                px={4}
                                bg="gray.50"
                                _dark={{
                                    bg: 'gray.800'
                                }}
                                borderRadius="md"
                            >
                                <MyText fontSize="sm" fontWeight="medium">
                                    Requisitos de contraseña:
                                </MyText>
                                {PASSWORD_RULES.map((rule) => (
                                    <PasswordRuleIndicator
                                        key={rule.id}
                                        isValid={
                                            passwordRules[
                                                rule.id as keyof PasswordRules
                                            ]
                                        }
                                        message={rule.message}
                                    />
                                ))}
                            </MyFlex>

                            <Field
                                name="password"
                                label="Contraseña"
                                icon={'LOCK'}
                                typeError={'none'}
                                component={FormikInputPassword}
                                onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                ) => {
                                    props.handleChange(e);
                                    validatePassword(e.target.value);
                                }}
                            />

                            <Field
                                name="confirmPassword"
                                label="Confirme la contraseña"
                                icon={'LOCK'}
                                typeError={'none'}
                                component={FormikInputPassword}
                            />
                        </MyFlex>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FormEmailAndPassword;
