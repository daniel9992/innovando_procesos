import type { IGenericData } from '@src/customAgencyTool/components/xlsx/read/readXlsx';
import type { InterfaceDoc } from '../../../../../domain/modelConfigDocList';

export interface IAllowColumns {
    label: string;
    key: 'id' | 'docCode' | 'docName';
}

export const allowColumns: IAllowColumns[] = [
    // {
    //     label: 'Id',
    //     key: 'id'
    // },
    {
        label: 'Código',
        key: 'docCode'
    },
    {
        label: 'Nombre del Documento',
        key: 'docName'
    }
];

export const validateColumns = (doc: IGenericData) => {
    const dataKeys = Object.keys(doc);

    const labels = allowColumns.map((item) => item.label);

    const result = dataKeys.every((item) => labels.includes(item));

    return result;
};

export const adapterXLSXToDoc = (doc: IGenericData): InterfaceDoc => {
    const copyServiceProvider: InterfaceDoc = {
        id: '',
        docCode: '',
        docName: ''
    };

    allowColumns.map((item) => {
        if (item.label in doc) {
            copyServiceProvider.id = Math.random()
                .toString(36)
                .substring(2, 15);
            copyServiceProvider[item.key] = doc[item.label] as string;
        }
    });

    return copyServiceProvider as InterfaceDoc;
};

export const adapterDoctToReadyToUse = (doc: InterfaceDoc): InterfaceDoc => {
    const copyDoc = { ...doc };

    if (!copyDoc.id) {
        copyDoc.id = Math.random().toString(36).substring(2, 15);
    }

    if (copyDoc.id === '') {
        copyDoc.id = Math.random().toString(36).substring(2, 15);
    }

    return copyDoc;
};
