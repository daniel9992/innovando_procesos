import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import firebase from 'firebase/compat/app';
import * as Yup from 'yup';
import {
    initialValuesContryCR,
    type InterfacePoliticalDivisionFather
} from './contryModel';

export interface InterfaceCustomerContact {
    id: string;
    idBelongsToClient: string;
    createdAt: Date;
    name: string;
    email: string[];
    phone: string[];
    department: string;

    [key: string]: firebase.firestore.FieldValue | Partial<unknown> | undefined;
}

export const emptyInterfaceCustomerContact: InterfaceCustomerContact = {
    id: '',
    createdAt: GetToday(),

    name: '',
    email: [''],
    phone: [''],
    department: '',
    idBelongsToClient: ''
};

export interface InterfaceEconomicActivity {
    activityName: string;
    activityNumber: string;
}

export interface InterfaceClient {
    id: string;
    createdAt: Date;

    typeLegalIdentity: string;
    legalIdentity: string;
    clientName: string;
    economicActivityNumber: string; //InterfaceEconomicActivity[];

    politicalDivision: InterfacePoliticalDivisionFather;

    clientDireccion: string;
    phone: string;
    emailForInvoicing: string;

    customerContact: Array<InterfaceCustomerContact>;

    [key: string]: firebase.firestore.FieldValue | Partial<unknown> | undefined;
}

export const initialValues: InterfaceClient = {
    id: '',
    createdAt: GetToday(),

    typeLegalIdentity: 'Cédula jurídica',
    legalIdentity: '',
    clientName: '',
    economicActivityNumber: '',

    politicalDivision: initialValuesContryCR,
    clientDireccion: '',
    phone: '',
    emailForInvoicing: '',

    customerContact: []
};

export const InterfaceCustomerContactSchema = Yup.object().shape({
    id: Yup.string(),
    idBelongsToClient: Yup.string(), //.required('Debe el id del cliente'),
    name: Yup.string().required('Debe ingresar el nombre'),
    email: Yup.array().of(
        Yup.string().email('Debe ser un correo electrónico válido')
    ),
    phone: Yup.array().of(Yup.string()),
    department: Yup.string()
});

export const InterfaceClienteSchema = Yup.object().shape({
    id: Yup.string(),
    createdAt: Yup.date(),
    typeLegalIdentity: Yup.string().required(
        'Debe ingresar el Tipo de identidad'
    ),
    legalIdentity: Yup.string().required(
        'Debe ingresar un número de identidad'
    ),
    clientName: Yup.string().required('Debe ingresar el Nombre'),
    economicActivityNumber: Yup.string(),
    // economicActivityNumber: Yup.array().of(
    //     Yup.object().shape({
    //         activityName: Yup.string(), //.required( 'Debe ingresar el nombre de la actividad'  ),
    //         activityNumber: Yup.string().required(
    //             'Debe ingresar el número de la actividad'
    //         )
    //     })
    // ),
    clientDireccion: Yup.string(),
    phone: Yup.string(),
    emailForInvoicing: Yup.string().email(
        'Debe ser un correo electrónico válido'
    ),
    customerContact: Yup.array().of(InterfaceCustomerContactSchema)
});
