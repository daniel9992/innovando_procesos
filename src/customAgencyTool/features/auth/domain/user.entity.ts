import firebase from 'firebase/compat/app';

export enum RoleUser {
    ADMIN = 'ADMIN',
    USER_AUTH = 'USER_AUTH',
    USER_ACCOUNTING = 'USER_ACCOUNTING',
    USER = 'USER'
}

export const RoleUserList = [
    {
        value: RoleUser.ADMIN,
        description: 'Administrador'
    },
    {
        value: RoleUser.USER_AUTH,
        description: 'Usuario Autorizado'
    },
    {
        value: RoleUser.USER_ACCOUNTING,
        description: 'Contador'
    },
    {
        value: RoleUser.USER,
        description: 'Usuario'
    }
];

export const GetRoleName = (role: string): string => {
    const find = RoleUserList.find((x) => x.value === role);
    if (find) {
        return find.description;
    }
    return role;
};

export interface InterfaceBaseUserCredential {
    id: string;
    uid: string;
    providerId: string; // firebase - gmail - etc
    email: string;
}

export interface InterfaceHistorySlot {
    startDate: Date;
    endDate: Date;
    countDayOff: number;
    type: string;
    description: string;
    dayUsed: boolean;

    collaboratorId: string;
}
export interface InterfaceCurrentUser extends InterfaceBaseUserCredential {
    name: string;
    phone: string;
    role: RoleUser; // va a pasar al claim
    img: string;
    birthday: Date;

    countDayOff: number;
    dateOfEntry: Date;
    daysToBeValidated: Array<InterfaceHistorySlot>;

    [key: string]: firebase.firestore.FieldValue | Partial<unknown> | undefined;
}

export const initialUser: InterfaceCurrentUser = {
    id: '',
    uid: '',
    providerId: '',
    email: '',
    name: '',
    phone: '',
    role: RoleUser.USER,
    img: '',
    birthday: new Date(),

    countDayOff: 0,
    dateOfEntry: new Date(),
    daysToBeValidated: []
};
