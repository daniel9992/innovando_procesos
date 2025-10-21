import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import firebase from 'firebase/compat/app';
import * as Yup from 'yup';
import type { InterfaceAppSetting } from '../../settings/domain/modelFather';

export interface InterfaceCategory {
    id: string;
    label: string;
    color: string;
}

export interface InterfaceCategoryOnSave extends InterfaceAppSetting {
    id: string;
    type: 'CONFIG_CALENDAR_CATEGORY';
    categories: InterfaceCategory[];

    [key: string]: firebase.firestore.FieldValue | Partial<unknown> | undefined;
}

export interface InterfaceReceive {
    uid: string;
    name: string;
    email: string;
}

export interface InterfaceCalendarEvent {
    id: string;
    category: InterfaceCategory[];
    title: string;
    description: string;

    startDate: Date;
    endDate: Date;
    path: string;
    isAllDay: boolean;

    // Filter
    sender: InterfaceReceive;
    receiver: InterfaceReceive[];
    searchTerms: string[];

    // FullCalendar Event
    url?: string;
    classNames?: string[];
    editable?: boolean;
    display?:
        | 'auto'
        | 'block'
        | 'list-item'
        | 'background'
        | 'inverse-background'
        | 'none';
    constraint?: string[]; // Limits event dragging and resizing to certain windows of time.
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    extendedProps?: object;
    source?: object;
    resourceEditable?: boolean;

    [key: string]: firebase.firestore.FieldValue | Partial<unknown> | undefined;
}

export const initialCalendarEvent: InterfaceCalendarEvent = {
    id: '',
    category: [
        {
            id: 'recordatorio-id',
            label: 'Recordatorio',
            color: '#4299E1'
        }
    ],
    title: '',
    description: '',
    status: '',
    startDate: GetToday(),
    endDate: GetToday(),
    path: '',
    isAllDay: true,
    eventCanBeReadByEveryone: true,
    sender: {
        uid: '',
        name: '',
        email: ''
    },
    receiver: [
        {
            uid: 'todo',
            name: 'Todos',
            email: 'todo@todo.com'
        }
    ],
    searchTerms: []
};

export const receiverSchema = Yup.object().shape({
    uid: Yup.string().required('El campo "Sender" es obligatorio'),
    name: Yup.string().required('El campo "Sender" es obligatorio')
});

export const calendarEventSchema = Yup.object().shape({
    id: Yup.string(),
    category: Yup.array().of(
        Yup.object().shape({
            id: Yup.string(),
            label: Yup.string(),
            color: Yup.string()
        })
    ),
    title: Yup.string().required('El campo "Título" es obligatorio'),
    description: Yup.string().required('El campo "Descripción" es obligatorio'),
    status: Yup.string(),
    startDate: Yup.date().required('El campo "Fecha de inicio" es obligatorio'),
    endDate: Yup.date().required('El campo "Fecha de fin" es obligatorio'),
    path: Yup.string(),
    isAllDay: Yup.boolean(),
    eventCanBeReadByEveryone: Yup.boolean(),
    // sender: receiverSchema,
    receiver: Yup.array().of(receiverSchema)
});

export interface InterfaceFullcalendarEvent {
    id: string;
    groupId?: string;
    allDay?: boolean;
    start: Date | string;
    end: Date | string;
    startStr?: string;
    endStr?: string;
    title: string;
    url?: string;
    classNames?: string[];
    editable?: boolean;
    display?:
        | 'auto'
        | 'block'
        | 'list-item'
        | 'background'
        | 'inverse-background'
        | 'none';
    constraint?: string[]; // Limits event dragging and resizing to certain windows of time.
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    extendedProps?: object;
    source?: object;
    resourceEditable?: boolean;
}
