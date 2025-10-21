import firebase from 'firebase/compat/app';

export interface InterfaceAppSetting {
    id: string;
    type: string;

    [key: string]: firebase.firestore.FieldValue | Partial<unknown> | undefined;
}

export const initialValues: InterfaceAppSetting = {
    id: '',
    type: ''
};
