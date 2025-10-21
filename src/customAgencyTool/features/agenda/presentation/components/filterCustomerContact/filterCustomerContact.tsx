import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import { MyDrawer, MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import type { InterfaceCustomerContact } from '@src/customAgencyTool/features/agenda/domain/agendaModel';
import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import { useEffect, useMemo, type FC } from 'react';
import {
    readAgenda,
    selectPI,
    selectStatus
} from '../../../infrastructure/agendaSlice';

interface Props {
    clientId: string | undefined;
    isOpen: boolean;
    onClose: () => void;
    customerContacts: Array<InterfaceCustomerContact>;
    onClick: (customerContact: InterfaceCustomerContact) => void;
}

const FilterCustomerContact: FC<Props> = ({
    clientId,
    isOpen,
    onClose,
    customerContacts,
    onClick
}) => {
    const dispatch = useAppDispatch();

    const selectedAgenda = useAppSelector(selectPI);

    const selectedStatus = useAppSelector(selectStatus);

    const customerContactsLocal = useMemo(() => {
        if (customerContacts.length > 0) {
            return customerContacts;
        }

        if (!selectedAgenda) {
            return [];
        }

        const temp: InterfaceCustomerContact = {
            id: 'info',
            createdAt: GetToday(),
            idBelongsToClient: selectedAgenda.id,
            name: selectedAgenda.clientName,
            email: [selectedAgenda.emailForInvoicing],
            phone: [selectedAgenda.phone],
            department: ''
        };

        return [temp, ...selectedAgenda.customerContact];
    }, [selectedAgenda, customerContacts]);

    useEffect(() => {
        if (isOpen && clientId && customerContacts.length === 0) {
            dispatch(readAgenda({ docId: clientId }));
        }
    }, [isOpen, dispatch, clientId, customerContacts]);

    useEffect(() => {
        console.log('selectedAgenda', selectedAgenda);
    }, [selectedAgenda]);

    return (
        <MyDrawer
            placement={'end'}
            header={'Seleccionar Contacto'}
            isOpen={isOpen}
            onOpenChange={() => {
                onClose();
            }}
        >
            {selectedStatus === ReduxStatus.LOADING && (
                <MyFlex>
                    <MyText fontSize={'0.8rem'} color={'gray.500'}>
                        Cargando...
                    </MyText>
                </MyFlex>
            )}
            {selectedStatus === ReduxStatus.FAILED && (
                <MyFlex>
                    <MyText fontSize={'0.8rem'} color={'red.500'}>
                        Error al cargar contactos
                    </MyText>
                </MyFlex>
            )}
            {customerContactsLocal.length === 0 && (
                <MyFlex>
                    <MyText fontSize={'0.8rem'} color={'red.500'}>
                        No se encontraron contactos
                    </MyText>
                </MyFlex>
            )}
            {customerContactsLocal.map((item, index) => (
                <MyFlex
                    key={index}
                    direction={'column'}
                    gap={2}
                    borderRadius={'md'}
                    cursor={'pointer'}
                    className="noSelect"
                    p={3}
                    _hover={{
                        backgroundColor: 'bg.muted'
                    }}
                    onClick={() => {
                        onClick(item);
                    }}
                >
                    <MyText
                        display={item.id === 'info' ? 'block' : 'none'}
                        fontWeight={'semibold'}
                    >
                        Información General:
                    </MyText>
                    <MyText>{item.name}</MyText>
                    <MyText fontSize={'0.8rem'} color={'gray.500'}>
                        {`Email: ${item.email[0]}`}
                    </MyText>
                    <MyText fontSize={'0.8rem'} color={'gray.500'}>
                        {`Teléfono: ${item.phone[0]}`}
                    </MyText>
                </MyFlex>
            ))}
        </MyDrawer>
    );
};

export default FilterCustomerContact;
