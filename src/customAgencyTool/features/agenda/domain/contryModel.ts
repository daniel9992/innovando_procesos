import type { InterfaceItem } from '@src/customAgencyTool/components/ui/mySelect';
import {
    changeDataKey,
    type IChangeDataKey
} from '@src/customAgencyTool/utils/objects/changeDataKey';

export enum EnumContryISO3166Code {
    costaRica = 'CR',
    honduras = 'HN',
    guatemala = 'GT',
    nicaragua = 'NI',
    panama = 'PA',
    uruguay = 'UY',
    argentina = 'AR',
    colombia = 'CO'
}

export const showSelectedContryList: Array<InterfaceItem> = [
    {
        value: EnumContryISO3166Code.costaRica,
        label: 'Costa Rica'
    },
    {
        value: EnumContryISO3166Code.honduras,
        label: 'Honduras'
    },
    {
        value: EnumContryISO3166Code.guatemala,
        label: 'Guatemala'
    },
    {
        value: EnumContryISO3166Code.nicaragua,
        label: 'Nicaragua'
    },
    {
        value: EnumContryISO3166Code.panama,
        label: 'Panama'
    },
    {
        value: EnumContryISO3166Code.uruguay,
        label: 'Uruguay'
    },
    {
        value: EnumContryISO3166Code.argentina,
        label: 'Argentina'
    },
    {
        value: EnumContryISO3166Code.colombia,
        label: 'Colombia'
    }
];

export interface InterfacePoliticalDivisionFather {
    [key: string]: string;
    contry: EnumContryISO3166Code | string;
}

export const GetStringPoliticalDivision = (
    values: InterfacePoliticalDivisionFather,
    optional?: {
        withName?: boolean;
        separator?: string;
        withOutContry?: boolean;
    }
) => {
    const {
        withName = true,
        separator = ', ',
        withOutContry = false
    } = optional || {};

    const arrayDataKeyList: IChangeDataKey[] = [
        {
            dataKey: 'contry',
            newDataKey: 'País'
        },
        {
            dataKey: 'province',
            newDataKey: 'Provincia'
        },
        {
            dataKey: 'canton',
            newDataKey: 'Cantón'
        },
        {
            dataKey: 'district',
            newDataKey: 'Distrito'
        },
        {
            dataKey: 'neighborhood',
            newDataKey: 'Barrio'
        }
    ];

    const formattedValues = changeDataKey(values, arrayDataKeyList);

    const arrayString = Object.keys(formattedValues).map((key) => {
        if (withOutContry && key === 'País') {
            return '';
        }

        return `${withName ? `${key}: ` : ''}${formattedValues[key]}`;
    });

    return arrayString.filter((item) => item !== '').join(separator);
};

export interface InterfaceContryCR extends InterfacePoliticalDivisionFather {
    province: string; // Provincia
    canton: string; // Cantón
    district: string; // Distrito
    neighborhood: string; // Barrio
}
export const initialValuesContryCR: InterfaceContryCR = {
    contry: EnumContryISO3166Code.costaRica,
    province: '',
    canton: '',
    district: '',
    neighborhood: ''
};
export interface InterfaceContryHN extends InterfacePoliticalDivisionFather {
    departamento: string; // Departamento
    municipio: string; // Municipio
    aldeas: string; // Aldeas
    caserio: string; // Caserio
}
export const initialValuesContryHN: InterfaceContryHN = {
    contry: EnumContryISO3166Code.honduras,
    departamento: '',
    municipio: '',
    aldeas: '',
    caserio: ''
};
export interface InterfaceContryGT extends InterfacePoliticalDivisionFather {
    departamento: string; // Departamento
    municipio: string; // Municipio
}
export const initialValuesContryGT: InterfaceContryGT = {
    contry: EnumContryISO3166Code.guatemala,
    departamento: '',
    municipio: ''
};
export interface InterfaceContryNI extends InterfacePoliticalDivisionFather {
    departamento: string; // Departamento
    regionAutonoma: string; // Región Autónoma
    municipio: string; // Municipio
}
export const initialValuesContryNI: InterfaceContryNI = {
    contry: EnumContryISO3166Code.nicaragua,
    departamento: '',
    regionAutonoma: '',
    municipio: ''
};
export interface InterfaceContryPA extends InterfacePoliticalDivisionFather {
    provincia: string; // Provincia
    comarcaIndigena: string; // Comarca Indigena
    distrito: string; // Distrito
    corregimiento: string; // Corregimiento
}
export const initialValuesContryPA: InterfaceContryPA = {
    contry: EnumContryISO3166Code.panama,
    provincia: '',
    comarcaIndigena: '',
    distrito: '',
    corregimiento: ''
};
export interface InterfaceContryUY extends InterfacePoliticalDivisionFather {
    departamento: string; // Departamento
    municipio: string; // Municipio
}
export const initialValuesContryUY: InterfaceContryUY = {
    contry: EnumContryISO3166Code.uruguay,
    departamento: '',
    municipio: ''
};
export interface InterfaceContryAR extends InterfacePoliticalDivisionFather {
    provincia: string; // Provincia
    municipio: string; // Municipio
}
export const initialValuesContryAR: InterfaceContryAR = {
    contry: EnumContryISO3166Code.argentina,
    provincia: '',
    municipio: ''
};
export interface InterfaceContryCO extends InterfacePoliticalDivisionFather {
    departamento: string; // Departamento
    municipio: string; // Municipio
}
export const initialValuesContryCO: InterfaceContryCO = {
    contry: EnumContryISO3166Code.colombia,
    departamento: '',
    municipio: ''
};

export interface InterfaceInput {
    icon: string;
    label: string;
    name: string;
}

export interface InterfaceInputsContry {
    contry: EnumContryISO3166Code;
    arrayInputs: Array<InterfaceInput>;
}

export const GenerateInputsContry = (contry: EnumContryISO3166Code) => {
    const arrayInputs: Array<InterfaceInputsContry> = [
        {
            contry: EnumContryISO3166Code.costaRica,
            arrayInputs: [
                {
                    icon: 'POLIDIVISION',
                    label: 'Provincia',
                    name: 'province'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Cantón',
                    name: 'canton'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Distrito',
                    name: 'district'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Barrio',
                    name: 'neighborhood'
                }
            ]
        },
        {
            contry: EnumContryISO3166Code.honduras,
            arrayInputs: [
                {
                    icon: 'POLIDIVISION',
                    label: 'Departamento',
                    name: 'departamento'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Municipio',
                    name: 'municipio'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Aldeas',
                    name: 'aldeas'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Caserio',
                    name: 'caserio'
                }
            ]
        },
        {
            contry: EnumContryISO3166Code.guatemala,
            arrayInputs: [
                {
                    icon: 'POLIDIVISION',
                    label: 'Departamento',
                    name: 'departamento'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Municipio',
                    name: 'municipio'
                }
            ]
        },
        {
            contry: EnumContryISO3166Code.nicaragua,
            arrayInputs: [
                {
                    icon: 'POLIDIVISION',
                    label: 'Departamento',
                    name: 'departamento'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Región Autónoma',
                    name: 'regionAutonoma'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Municipio',
                    name: 'municipio'
                }
            ]
        },
        {
            contry: EnumContryISO3166Code.panama,
            arrayInputs: [
                {
                    icon: 'POLIDIVISION',
                    label: 'Provincia',
                    name: 'provincia'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Comarca Indigena',
                    name: 'comarcaIndigena'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Distrito',
                    name: 'distrito'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Corregimiento',
                    name: 'corregimiento'
                }
            ]
        },
        {
            contry: EnumContryISO3166Code.uruguay,
            arrayInputs: [
                {
                    icon: 'POLIDIVISION',
                    label: 'Departamento',
                    name: 'departamento'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Municipio',
                    name: 'municipio'
                }
            ]
        },
        {
            contry: EnumContryISO3166Code.argentina,
            arrayInputs: [
                {
                    icon: 'POLIDIVISION',
                    label: 'Provincia',
                    name: 'provincia'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Municipio',
                    name: 'municipio'
                }
            ]
        },
        {
            contry: EnumContryISO3166Code.colombia,
            arrayInputs: [
                {
                    icon: 'POLIDIVISION',
                    label: 'Departamento',
                    name: 'departamento'
                },
                {
                    icon: 'POLIDIVISION',
                    label: 'Municipio',
                    name: 'municipio'
                }
            ]
        }
    ];

    return arrayInputs.find((item) => item.contry === contry);
};

// no se usa
export const GetInterfaceContry = (
    values: InterfacePoliticalDivisionFather
) => {
    switch (values.contry) {
        case EnumContryISO3166Code.costaRica:
            return values as InterfaceContryCR;
        case EnumContryISO3166Code.honduras:
            return values as InterfaceContryHN;
        case EnumContryISO3166Code.guatemala:
            return values as InterfaceContryGT;
        case EnumContryISO3166Code.nicaragua:
            return values as InterfaceContryNI;
        case EnumContryISO3166Code.panama:
            return values as InterfaceContryPA;
        case EnumContryISO3166Code.uruguay:
            return values as InterfaceContryUY;
        case EnumContryISO3166Code.argentina:
            return values as InterfaceContryAR;
        case EnumContryISO3166Code.colombia:
            return values as InterfaceContryCO;
        default:
            return null;
    }
};

// no se usa
export const GetInitialValuesContry = (contry: EnumContryISO3166Code) => {
    switch (contry) {
        case EnumContryISO3166Code.costaRica:
            return initialValuesContryCR;
        case EnumContryISO3166Code.honduras:
            return initialValuesContryHN;
        case EnumContryISO3166Code.guatemala:
            return initialValuesContryGT;
        case EnumContryISO3166Code.nicaragua:
            return initialValuesContryNI;
        case EnumContryISO3166Code.panama:
            return initialValuesContryPA;
        case EnumContryISO3166Code.uruguay:
            return initialValuesContryUY;
        case EnumContryISO3166Code.argentina:
            return initialValuesContryAR;
        case EnumContryISO3166Code.colombia:
            return initialValuesContryCO;
        default:
            return initialValuesContryCR;
    }
};

// no se usa
export const GetContryFullName = (contry: EnumContryISO3166Code) => {
    switch (contry) {
        case EnumContryISO3166Code.costaRica:
            return 'Costa Rica';
        case EnumContryISO3166Code.honduras:
            return 'Honduras';
        case EnumContryISO3166Code.guatemala:
            return 'Guatemala';
        case EnumContryISO3166Code.nicaragua:
            return 'Nicaragua';
        case EnumContryISO3166Code.panama:
            return 'Panama';
        case EnumContryISO3166Code.uruguay:
            return 'Uruguay';
        case EnumContryISO3166Code.argentina:
            return 'Argentina';
        case EnumContryISO3166Code.colombia:
            return 'Colombia';
        default:
            return '';
    }
};

// no se usa
export const GetISO3166CodeFormFullName = (contry: string) => {
    switch (contry) {
        case 'COSTA RICA':
            return EnumContryISO3166Code.costaRica;
        case 'HONDURAS':
            return EnumContryISO3166Code.honduras;
        case 'GUATEMALA':
            return EnumContryISO3166Code.guatemala;
        case 'NICARAGUA':
            return EnumContryISO3166Code.nicaragua;
        case 'PANAMA':
            return EnumContryISO3166Code.panama;
        case 'URUGUAY':
            return EnumContryISO3166Code.uruguay;
        case 'ARGENTINA':
            return EnumContryISO3166Code.argentina;
        case 'COLOMBIA':
            return EnumContryISO3166Code.colombia;
        default:
            console.log('default');
            console.log(contry);
            return EnumContryISO3166Code.costaRica;
    }
};
