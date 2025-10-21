import type { InterfaceCountry } from '@src/customAgencyTool/components/formik/05formikInputComplex/formikInputSelectedCountry';
import type { InterfaceAppSetting } from '@src/customAgencyTool/features/settings/domain/modelFather';
import * as Yup from 'yup';

// Interfaz proporcionada por el usuario
export interface InterfaceConfigGeneral {
    slogan: string;
    companyName: string;
    companyLogo1: string; // Se asume URL de imagen
    companyLogo2: string; // Se asume URL de imagen
    companyUrl: string;
    companyEmail: string;
    companyPhone: string;
    companyCountry: InterfaceCountry | string;
    companyLocation: string;
    companyPoBox: string;
    companyWebsite: string;
    companyID: string; // RUC, CUIT, NIF, etc.
    companySocialMedia: string[];
}

export interface InterfaceConfigGeneralOnSave
    extends InterfaceConfigGeneral,
        InterfaceAppSetting {
    type: 'CONFIG_GENERAL';
}

export const initialValuesOnSave: InterfaceConfigGeneralOnSave = {
    id: '',
    type: 'CONFIG_GENERAL',
    slogan: '',
    companyName: '',
    companyLogo1: '',
    companyLogo2: '',
    companyUrl: '',
    companyEmail: '',
    companyPhone: '',
    companyCountry: '',
    companyLocation: '',
    companyPoBox: '',
    companyWebsite: '',
    companyID: '',
    companySocialMedia: []
};

// Valores iniciales para el formulario
export const initialValues: InterfaceConfigGeneral = {
    slogan: '',
    companyName: '',
    companyLogo1: '',
    companyLogo2: '',
    companyUrl: '',
    companyEmail: '',
    companyPhone: '',
    companyCountry: '',
    companyLocation: '',
    companyPoBox: '',
    companyWebsite: '',
    companyID: '',
    companySocialMedia: []
};

// Esquema de validación con Yup
export const validationSchema = Yup.object().shape({
    slogan: Yup.string(), //.required('El eslogan es requerido'),
    companyName: Yup.string().required('El nombre de la empresa es requerido'),
    companyLogo1: Yup.string(), //.url('Debe ser una URL válida para el logo 1'),
    companyLogo2: Yup.string(), //.url('Debe ser una URL válida para el logo 2'),
    // companyUrl: Yup.string()
    // 	.url('Debe ser una URL válida')
    // 	.required('La URL de la empresa es requerida'),
    companyEmail: Yup.string().email('Email inválido'), //.required('El email de la empresa es requerido'),
    companyPhone: Yup.string(), //.required('El teléfono de la empresa es requerido' ),
    companyCountry: Yup.object().shape({
        name: Yup.string(),
        iso3166Code: Yup.string()
    }),
    companyLocation: Yup.string().required(
        'La dirección/ubicación es requerida'
    ),
    companyPoBox: Yup.string(),
    companyWebsite: Yup.string().url('Debe ser una URL válida'), //.required('El sitio web de la empresa es requerido'),

    companyID: Yup.string().required(
        'El ID fiscal/legal de la empresa es requerido'
    )
});
