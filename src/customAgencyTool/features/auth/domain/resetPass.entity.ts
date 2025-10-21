import * as Yup from 'yup';

export interface IResetPasswordCredentials {
  email: string;
}

export const initialResetPasswordCredentials: IResetPasswordCredentials = {
  email: ''
};

export const validationSchemaResetPasswordCredentials = Yup.object().shape(
  {
    email: Yup.string()
      .email('El correo electrónico no es válido')
      .required('Se requiere un correo electrónico')
  }
);
