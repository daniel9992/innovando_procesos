import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import type { InterfaceCustomerContact } from '../agendaModel';

export const AdapterCustomerContact = (
    item: InterfaceCustomerContact | string
): InterfaceCustomerContact => {
    const newId = 'new-' + Math.random().toString(36).substring(2, 15);
    if (typeof item === 'string') {
        return {
            id: newId,
            createdAt: GetToday(),
            name: item,
            email: [''],
            phone: [''],
            department: '',
            idBelongsToClient: ''
        };
    } else {
        return {
            ...item,
            id: item.id === '' ? newId : item.id
        };
    }
};
