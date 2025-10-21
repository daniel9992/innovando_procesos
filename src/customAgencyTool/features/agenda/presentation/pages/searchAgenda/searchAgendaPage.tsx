import ReturnBtn from '@src/customAgencyTool/components/customButtons/returnBtn';
import ErrorMessage from '@src/customAgencyTool/components/errorMessage/errorMessage';
import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import SearchFormik from '@src/customAgencyTool/components/searchFormik/searchFormik';
import { MyFlex, MyHeading } from '@src/customAgencyTool/components/ui';
import { SEARCH_WORD } from '@src/customAgencyTool/constants/words';
import { PrivateRoutePath } from '@src/customAgencyTool/pages/private/privateRoutes';
import { searchFuntionCollection } from '@src/customAgencyTool/services/searchFuntion/searchFuntionCollection';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { InterfaceClient } from '../../../domain/agendaModel';
import { AgendaRoutPath } from '../../routeAgenda';
import DynamicTable from '../components/dynamicTable/dynamicTable';
export interface IGenerateData {
    [key: string]: string | number | boolean | unknown;
}

const SearchAgendaPrivate = () => {
    const panel =
        PrivateRoutePath.DASHBOARD_PAGE + '/' + AgendaRoutPath.AGENDA_PAGE;

    const navigate = useNavigate();

    const { searchValue } = useParams();

    const [clients, setClients] = useState<InterfaceClient[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [error, setError] = useState<string | null>(null);

    const [lastVisibleDocId, setLastVisibleDocId] = useState<
        string | undefined
    >();

    const loadResults = useCallback(
        async (isNewSearch: boolean = false) => {
            if (!searchValue) return;

            setIsLoading(true);
            setError(null);

            try {
                const response = await searchFuntionCollection({
                    collectionName: 'clientCollection',
                    searchTerms: searchValue,
                    itemsPerPage: 35,
                    useSoundex: true,
                    lastVisibleDocId: isNewSearch ? undefined : lastVisibleDocId
                });

                if (isNewSearch) {
                    setClients(response.data as InterfaceClient[]);
                } else {
                    setClients((prev) => [
                        ...prev,
                        ...(response.data as InterfaceClient[])
                    ]);
                }

                // Guarda el último ID para la siguiente página
                if (response.data.length > 0) {
                    setLastVisibleDocId(response.nextPageCursor);
                }
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Error en la búsqueda'
                );
            } finally {
                setIsLoading(false);
            }
        },
        [searchValue, lastVisibleDocId]
    );

    useEffect(() => {
        if (!searchValue) return;

        loadResults(true);
    }, [searchValue, loadResults]);

    const handledOnSearch = async (value: string) => {
        const query = value.trim();

        const path =
            panel +
            '/' +
            AgendaRoutPath.AGENDA_SEARCH.replace(SEARCH_WORD, query);

        navigate(path);
    };

    if (error) {
        return (
            <ErrorMessage
                title="Error Busqueda de Conocimiento de Embarque"
                error={error || 'Error en la búsqueda'}
            />
        );
    }

    if (isLoading) {
        return (
            <MyFlex
                direction={'column'}
                align={'center'}
                justifyContent={'center'}
                height={'90vh'}
            >
                <LoadingWithText text="Buscando..." />
            </MyFlex>
        );
    }

    return (
        <div>
            <MyFlex position={'relative'} p={0}>
                <ReturnBtn
                    position="absolute"
                    top="0px"
                    right="0px"
                    path={panel}
                />
            </MyFlex>

            <MyHeading fontWeight={'semibold'} color={'gray'}>
                Buscar en la Agenda - {searchValue}
            </MyHeading>

            <MyFlex justifyContent={'center'} align={'center'} my={3}>
                <SearchFormik onChange={handledOnSearch} />
            </MyFlex>

            <DynamicTable clients={clients} isLoading={isLoading} />
        </div>
    );
};

export default SearchAgendaPrivate;
