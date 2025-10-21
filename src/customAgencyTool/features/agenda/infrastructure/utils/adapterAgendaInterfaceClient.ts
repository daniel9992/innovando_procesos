import { initialValues, type InterfaceClient } from '../../domain/agendaModel';
import { AdapterCustomerContact } from '../../domain/utils/adapterCustomerContact';

export const adapterAgendaInterfaceClient = (
    client: InterfaceClient
): InterfaceClient => {
    const copyClient = {
        ...initialValues,
        ...client
    };

    if ('customerContact' in client) {
        copyClient.customerContact = client.customerContact.map((item) => {
            const newContact = AdapterCustomerContact(item);
            newContact.idBelongsToClient = client.id;
            return newContact;
        });
    } else {
        copyClient.customerContact = [];
    }

    if ('politicalDivision' in client) {
        // const tempClientDireccion = ''
        // copyClient.clientDireccion = tempClientDireccion;
    }

    return copyClient as InterfaceClient;
};
