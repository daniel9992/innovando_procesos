import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import LoadingSpinnerWithText from '@src/customAgencyTool/components/loading/loadingSpinnerWithText';
import SearchFormik from '@src/customAgencyTool/components/searchFormik/searchFormik';
import {
    MyButton,
    MyDrawer,
    MyFlex
} from '@src/customAgencyTool/components/ui';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import { useNotificationAdapter } from '@src/customAgencyTool/context/toastAppNotification/useNotificationAdapter';
import { searchFuntionCollection } from '@src/customAgencyTool/services/searchFuntion/searchFuntionCollection';
import { useCallback, useEffect, useState, type FC } from 'react';
import type {
    InterfaceClient,
    InterfaceCustomerContact
} from '../../../domain/agendaModel';
import {
    readCustomerContacts,
    selectStatus
} from '../../../infrastructure/agendaSlice';
import { agendaObservableRepository } from '../../../infrastructure/compositionRoot';
import DynamicTableStr from '../../pages/components/dynamicTableStr/dynamicTable';
import BtnCreateAgenda from '../btnCreateAgenda/btnCreateAgenda';

interface ManageSelected {
    showModal: boolean;
    selectedClient?: InterfaceClient;
}
const initialManageSelected: ManageSelected = {
    showModal: false,
    selectedClient: undefined
};

interface Props {
    showModal?: boolean;
    onClose?: () => void;
    showBtn?: 'iconButton' | 'button' | 'none';
    onChangeClient?: (client: InterfaceClient) => void;
    onClear?: () => void;
}

const BtnSelectedAgenda: FC<Props> = ({
    showModal = false,
    onClose = () => {},
    showBtn = 'button',
    onChangeClient = () => {},
    onClear = () => {}
}) => {
    const dispatch = useAppDispatch();

    const { sendNotification } = useNotificationAdapter();

    const selectStatusRedux = useAppSelector(selectStatus);

    const [showModalLocal, setShowModalLocal] = useState(false);

    const agendaRepo = agendaObservableRepository;
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [clients, setClients] = useState<InterfaceClient[]>([]);
    const [clientsForSearch, setClientsForSearch] = useState<InterfaceClient[]>(
        []
    );

    const [manageSelected, setManageSelected] = useState<ManageSelected>(
        initialManageSelected
    );

    const loadMoreItems = useCallback(async () => {
        if (clientsForSearch.length > 0) return;
        agendaRepo.loadMore();
    }, [agendaRepo, clientsForSearch]);

    useEffect(() => {
        const dataSub = agendaRepo.data$.subscribe(setClients);
        const loadingSub = agendaRepo.loading$.subscribe(setIsLoading);
        const hasMoreSub = agendaRepo.hasMore$.subscribe(setHasMore);

        return () => {
            dataSub.unsubscribe();
            loadingSub.unsubscribe();
            hasMoreSub.unsubscribe();
        };
    }, [agendaRepo]);

    useEffect(() => {
        agendaRepo.get([]);
    }, [agendaRepo]);

    useEffect(() => {
        setShowModalLocal(showModal);
    }, [showModal]);

    const handleOnClose = useCallback(() => {
        onClose();

        setShowModalLocal(false);

        setIsLoading(false);

        setClients([]);

        // clear search client
        setClientsForSearch([]);
    }, [onClose]);

    const handleOnOpen = useCallback(() => {
        setShowModalLocal(true);
    }, []);

    const handledOnSelectedClient = async (client: InterfaceClient) => {
        await dispatch(
            readCustomerContacts({
                idBelongsToClient: client.id
            })
        ).then((response) => {
            const payload = response.payload;

            if (!payload) return;

            const customerContacts = payload as InterfaceCustomerContact[];

            const copyClient = { ...client };
            copyClient.customerContact = customerContacts;

            onChangeClient(copyClient);
            handleOnClose();
        });
    };

    const handledOnSearch = async (value: string) => {
        const query = value.trim();

        setIsLoading(true);
        try {
            const response = await searchFuntionCollection({
                collectionName: 'clientCollection',
                searchTerms: query,
                itemsPerPage: 20
            });

            setClientsForSearch(response.data as InterfaceClient[]);

            setIsLoading(false);
            setHasMore(false);
        } catch (err) {
            sendNotification({
                title: 'Error',
                message: 'Error en la búsqueda: ' + err,
                status: 'error',
                duration: 5000
            });
            setIsLoading(false);
        }
    };

    const handledOnEditClient = (client: InterfaceClient) => {
        // close drawe
        setShowModalLocal(false);

        // open drawer
        setManageSelected({
            showModal: true,
            selectedClient: client
        });
    };

    const handledOnClear = () => {
        // close drawe
        setShowModalLocal(false);

        // send clear event
        onClear();

        // set initial state
        setManageSelected(initialManageSelected);

        // clear search client
        setClientsForSearch([]);
    };

    const handledOnCreateClient = () => {
        // close drawe
        setShowModalLocal(false);

        // open drawer
        setManageSelected({
            showModal: true,
            selectedClient: undefined
        });
    };

    return (
        <div>
            {showBtn === 'iconButton' && (
                <MyButton
                    aria-label="Seleccionar Agenda"
                    onClick={handleOnOpen}
                    icon={'AGENDA'}
                    colorPalette={'agenda'}
                />
            )}
            {showBtn === 'button' && (
                <MyButton
                    onClick={handleOnOpen}
                    leftIcon={'AGENDA'}
                    colorPalette={'agenda'}
                >
                    Seleccionar Agenda
                </MyButton>
            )}

            <MyDrawer
                isOpen={showModalLocal}
                onOpenChange={handleOnClose}
                header={'Seleccionar Agenda'}
                placement="end"
                size={'sm'}
            >
                {selectStatusRedux === ReduxStatus.LOADING && (
                    <MyFlex
                        justify={'center'}
                        align={'center'}
                        direction={'column'}
                        minHeight={'70vh'}
                    >
                        <LoadingSpinnerWithText
                            text={'Cargando contactos...'}
                        />
                    </MyFlex>
                )}
                <MyFlex
                    display={
                        selectStatusRedux === ReduxStatus.LOADING
                            ? 'none'
                            : 'flex'
                    }
                    direction={'column'}
                    gap={3}
                    p={0}
                    pt={2}
                >
                    <SearchFormik
                        onChange={handledOnSearch}
                        onClear={() => {
                            setClientsForSearch([]);
                        }}
                    />

                    <DynamicTableStr
                        clients={
                            clientsForSearch.length > 0
                                ? clientsForSearch
                                : clients
                        }
                        isLoading={isLoading}
                        hasMore={hasMore}
                        loadMoreItems={loadMoreItems}
                        onSelectedClient={handledOnSelectedClient}
                        onEditClient={handledOnEditClient}
                    />
                </MyFlex>
                <MyFlex direction={'row'} justifyContent={'space-around'} p={0}>
                    <MyButton
                        size={'sm'}
                        variant={'outline'}
                        leftIcon={'PLUS'}
                        onClick={handledOnCreateClient}
                    >
                        Agregar cliente
                    </MyButton>
                    <MyButton
                        size={'sm'}
                        variant={'outline'}
                        leftIcon={'TRASH'}
                        onClick={handledOnClear}
                    >
                        Borrar Seleccionado
                    </MyButton>
                </MyFlex>
            </MyDrawer>
            <BtnCreateAgenda
                showModal={manageSelected.showModal}
                selectedClient={manageSelected.selectedClient}
                onClose={() => {
                    setManageSelected(initialManageSelected);
                }}
                showBtn={false}
                onChangeClient={onChangeClient}
            />
        </div>
    );
};

export default BtnSelectedAgenda;
