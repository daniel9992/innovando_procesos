import type { InterfaceAppSetting } from '@src/customAgencyTool/features/settings/domain/modelFather';
import * as yup from 'yup';

export const idRateSave = 'data-id-configListOfRates';

export interface InterfaceRate {
    id: string;
    rateType: string;
    code: string;
    cabys: string;
    rateName: string;
    iva: number;
    measuremnetUnit: string;
    declaraitionCode: string;
}

export const initialValue: InterfaceRate = {
    id: '',
    rateType: '',
    code: '',
    cabys: '',
    rateName: '',
    iva: 0.13,
    measuremnetUnit: '',
    declaraitionCode: ''
};

export interface InterfaceSelectedRateOnSave extends InterfaceAppSetting {
    type: 'CONFIG_LIST_OF_RATES';
    listOfRates: Array<InterfaceRate>;
}

export const initialValueOnSave: InterfaceSelectedRateOnSave = {
    id: '',
    type: 'CONFIG_LIST_OF_RATES',
    listOfRates: []
};

export interface InterfaceSelectedRate {
    showDialog: boolean;
    index: number;
    rate: InterfaceRate;
}

export const schemaInterfaceRate = yup.object().shape({
    id: yup.string().required('Requerido'),
    rateType: yup.string().required('Requerido'),
    code: yup.string().required('Requerido'),
    cabys: yup.string().required('Requerido'),
    rateName: yup.string().required('Requerido'),
    iva: yup.number().required('Requerido'),
    measuremnetUnit: yup.string().required('Requerido'),
    declaraitionCode: yup.string().required('Requerido')
});
