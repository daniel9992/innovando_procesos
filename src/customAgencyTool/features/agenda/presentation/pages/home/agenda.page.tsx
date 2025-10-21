import SearchFormik from '@src/customAgencyTool/components/searchFormik/searchFormik';
import { MyFlex, MyHeading } from '@src/customAgencyTool/components/ui';
import { SEARCH_WORD } from '@src/customAgencyTool/constants/words';
import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import type { InterfaceClient } from '../../../domain/agendaModel';
import { agendaObservableRepository } from '../../../infrastructure/compositionRoot';
import BtnCreateAgenda from '../../components/btnCreateAgenda/btnCreateAgenda';
import { AgendaRoutPath } from '../../routeAgenda';
import DynamicTable from '../components/dynamicTable/dynamicTable';

const AgendaPage = () => {
    const navigate = useNavigate();

    const agendaRepo = agendaObservableRepository;
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [clients, setClients] = useState<InterfaceClient[]>([]);

    const handledOnSearch = (value: string) => {
        const query = value.trim();

        const path = AgendaRoutPath.AGENDA_SEARCH.replace(SEARCH_WORD, query);

        navigate(path);
    };

    const loadMoreItems = useCallback(async () => {
        agendaRepo.loadMore();
    }, [agendaRepo]);

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

    return (
        <div>
            <Helmet>
                <title>Agenda</title>
            </Helmet>

            <MyFlex
                direction={'row'}
                justifyContent={'space-between'}
                align={'center'}
            >
                <MyHeading fontWeight={'semibold'} color={'gray'}>
                    Agenda
                </MyHeading>

                <SearchFormik onChange={handledOnSearch} />

                <MyFlex
                    direction={'row'}
                    justifyContent={'space-between'}
                    align={'center'}
                >
                    <BtnCreateAgenda
                        showModal={showModal}
                        onClose={() => setShowModal(false)}
                        // onChangeClient={(values) => {
                        //     console.log(values);
                        // }}
                    />

                    {/* <BtnSelectedAgenda
                        onChangeClient={(client) => {
                            console.log(client);
                        }}
                        onClear={() => {
                            console.log('onClear');
                        }}
                    /> */}
                </MyFlex>
            </MyFlex>

            <DynamicTable
                clients={clients}
                isLoading={isLoading}
                hasMore={hasMore}
                loadMoreItems={loadMoreItems}
            />
        </div>
    );
};

export default AgendaPage;
