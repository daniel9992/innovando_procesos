import { initialValues, type InterfaceClient } from '../agendaModel';
import { AdapterCustomerContact } from './adapterCustomerContact';

export const adapterAgenda = (agenda: InterfaceClient) => {
    const copyAgenda = { ...agenda };
    const newAgenda = { ...initialValues };

    newAgenda.id = copyAgenda.id;
    newAgenda.createdAt = copyAgenda.createdAt;
    newAgenda.typeLegalIdentity = copyAgenda.typeLegalIdentity;
    newAgenda.legalIdentity = copyAgenda.legalIdentity;
    newAgenda.clientName = copyAgenda.clientName;

    if (copyAgenda.nickName === undefined) {
        newAgenda.nickName = '';
    } else {
        newAgenda.nickName = copyAgenda.nickName;
    }

    // if (copyAgenda.politicalDivision) {
    //     let contry = ''
    //     if ('country' in copyAgenda.politicalDivision) {
    //         const temp = copyAgenda.politicalDivision.country as string;
    //         const findIndex = SelectedContryList.findIndex(
    //             (item) => item.value.toLowerCase() === temp.toLowerCase()
    //         );
    //         if(findIndex !== -1){
    //             contry = SelectedContryList[findIndex].description;
    //         } else {
    //             contry = temp;
    //         }
    //     }
    // }

    newAgenda.clientDireccion = copyAgenda.clientDireccion;
    newAgenda.phone = copyAgenda.phone;
    newAgenda.emailForInvoicing = copyAgenda.emailForInvoicing;

    if (copyAgenda.customerContact === undefined) {
        newAgenda.customerContact = [];
    } else {
        newAgenda.customerContact = copyAgenda.customerContact.map(
            AdapterCustomerContact
        );
    }

    return newAgenda;
};
