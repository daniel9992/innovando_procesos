import * as Yup from 'yup';

/**
 *  ? ----------------------------------
 *  *  Register User
 *  ? ----------------------------------
 */
export const validationSchemaLoginUser = Yup.object().shape({
  email: Yup.string()
    .email('Se requiere un correo electrónico válido')
    .required('Se requiere un correo electrónico'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(/[0-9]/, 'Debe incluir al menos un número')
    .matches(/[A-Z]/, 'Debe incluir al menos una mayúscula')
    .matches(/[a-z]/, 'Debe incluir al menos una minúscula')
    .matches(/[@$!%*?&]/, 'Debe incluir al menos un carácter especial')
    .required('Se requiere una contraseña'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
    .required('Se requiere confirmación de la contraseña')
});

export interface PasswordRule {
  id: string;
  rule: RegExp;
  message: string;
  isValid: boolean;
}

export interface PasswordRules {
  minLength: boolean;
  hasNumber: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasSpecialChar: boolean;
}

export interface InterfaceEmailAndPass {
  email: string;
  password: string;
  confirmPassword: string;
}

export const initialRegisterUser: InterfaceEmailAndPass = {
  email: '',
  password: '',
  confirmPassword: ''
};

export interface InterfaceEmailAndPass {
  email: string;
  password: string;
  confirmPassword: string;
}

export const initialValues: InterfaceEmailAndPass = {
  email: '',
  password: '',
  confirmPassword: ''
};
