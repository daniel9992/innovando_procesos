import type { InterfaceAppSetting } from '@src/customAgencyTool/features/settings/domain/modelFather';
import * as yup from 'yup';

export const idDocSave = 'data-id-configListOfDocs';

export interface InterfaceConfigListOfDocsSave extends InterfaceAppSetting {
    type: 'CONFIG_LIST_OF_DOCS';
    listDocs: Array<InterfaceDoc>;
}

export const initialValueOnSave: InterfaceConfigListOfDocsSave = {
    id: '',
    type: 'CONFIG_LIST_OF_DOCS',
    listDocs: []
};

export interface InterfaceDoc {
    id: string;
    docCode: string;
    docName: string;
}

export const initialValue: InterfaceDoc = {
    id: '',
    docCode: '',
    docName: ''
};

export const adapterDoc = (doc: InterfaceDoc): InterfaceDoc => {
    const copyDoc = { ...doc };
    if (!copyDoc.id || copyDoc.id === '') {
        copyDoc.id = Math.random().toString(36).substring(2, 15);
    }
    return copyDoc;
};

export interface InterfaceSelectedDoc {
    index: number;
    doc: InterfaceDoc;
    showDialog: boolean;
}

export const schemaInterfaceDoc = yup.object().shape({
    id: yup.string(),
    docCode: yup.string().required('Se requiere el código del documento'),
    docName: yup.string().required('Se requiere el nombre del documento')
});
