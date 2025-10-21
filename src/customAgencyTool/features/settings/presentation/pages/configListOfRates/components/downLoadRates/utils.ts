import type { IGenericData } from '@src/customAgencyTool/components/xlsx/read/readXlsx';
import {
    type IChangeDataKey,
    changeDataKey
} from '@src/customAgencyTool/utils/objects/changeDataKey';
import {
    type InterfaceRate,
    initialValue
} from '../../../../../domain/modelListOfRates';

export interface IAllowColumns {
    label: string;
    key:
        | 'id'
        | 'rateType'
        | 'code'
        | 'cabys'
        | 'rateName'
        | 'iva'
        | 'measuremnetUnit'
        | 'declaraitionCode';
}

export const allowColumns: IAllowColumns[] = [
    {
        label: 'ID',
        key: 'id'
    },
    {
        label: 'Tipo de tarifa',
        key: 'rateType'
    },
    {
        label: 'Código',
        key: 'code'
    },
    {
        label: 'Cabys',
        key: 'cabys'
    },
    {
        label: 'Nombre de Tarifa',
        key: 'rateName'
    },
    {
        label: 'IVA',
        key: 'iva'
    },
    {
        label: 'Unidad de medida',
        key: 'measuremnetUnit'
    },
    {
        label: 'Código declaración',
        key: 'declaraitionCode'
    }
];

export const validateColumns = (doc: IGenericData) => {
    const dataKeys = Object.keys(doc);

    const labels = allowColumns.map((item) => item.label);

    const result = dataKeys.every((item) => labels.includes(item));

    return result;
};

export const adapterXLSXToRates = (doc: IGenericData): InterfaceRate => {
    let copyRate: InterfaceRate = initialValue;

    const objMapList: IChangeDataKey[] = [
        {
            dataKey: 'ID',
            newDataKey: 'id'
        },
        {
            dataKey: 'Tipo de tarifa',
            newDataKey: 'rateType'
        },
        {
            dataKey: 'Código',
            newDataKey: 'code'
        },
        {
            dataKey: 'Cabys',
            newDataKey: 'cabys'
        },
        {
            dataKey: 'Nombre de Tarifa',
            newDataKey: 'rateName'
        },
        {
            dataKey: 'IVA',
            newDataKey: 'iva'
        },
        {
            dataKey: 'Unidad de medida',
            newDataKey: 'measuremnetUnit'
        },
        {
            dataKey: 'Código declaración',
            newDataKey: 'declaraitionCode'
        }
    ];

    copyRate = changeDataKey(doc, objMapList) as InterfaceRate;

    if (copyRate.iva) {
        copyRate.iva = copyRate.iva as number;
    }

    return copyRate as InterfaceRate;
};
