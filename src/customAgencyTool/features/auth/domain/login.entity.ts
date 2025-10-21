import * as Yup from 'yup';

/**
 *  ? ----------------------------------
 *  *  Login User
 *  ? ----------------------------------
 */
export interface LoginUser {
  email: string;
  password: string;
}

export const initialLoginUser: LoginUser = {
  email: '',
  password: ''
};

export const validationSchemaLoginUser = Yup.object().shape({
  email: Yup.string()
    .required('Se requiere ingresar su correo electrónico')
    .email('El correo electrónico ingresado no es válido'),
  password: Yup.string().required('Se requiere ingresar su contraseña.')
});
