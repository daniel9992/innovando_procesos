import { auth } from '@src/customAgencyTool/core';
import { adapterDate } from '@src/customAgencyTool/utils/adapter';
import axios, { AxiosError } from 'axios';
import { getFunctionsBaseUrl } from './getFunctionBaseURL';

export interface IGenerateData {
    [key: string]: string | number | boolean | unknown;
}

export interface SearchApiResponse {
    data: IGenerateData[];
    nextPageCursor?: string;
}

interface InterfaceSearchFuntion {
    collectionName: string;
    searchTerms: string;
    itemsPerPage?: number;
    useSoundex?: boolean;
    lastVisibleDocId?: string;
}

export const searchFuntionCollection = async ({
    collectionName,
    searchTerms,
    useSoundex,
    itemsPerPage = 10,
    lastVisibleDocId
}: InterfaceSearchFuntion) => {
    // console.log('collectionName', collectionName);
    // console.log('searchTerms', searchTerms);

    if (!collectionName || !searchTerms) {
        throw new Error('Falta información');
    }

    const functionName = 'handledSearch';
    const functionUrl = `${getFunctionsBaseUrl()}/${functionName}`;

    const idToken = await auth.currentUser?.getIdToken();

    // console.log('currentUser', auth.currentUser);

    // console.log('idToken', idToken);

    if (!idToken) {
        throw new Error('No se ha autenticado el usuario.');
    }

    try {
        const cancelToken = axios.CancelToken.source();
        // Para cancelar la petición usar:
        // cancelToken.cancel();

        const payload: InterfaceSearchFuntion = {
            collectionName,
            searchTerms,
            itemsPerPage,
            useSoundex: useSoundex ?? false,
            lastVisibleDocId
        };

        // console.log('Llamando a la función de búsqueda con payload:', payload);

        const response = await axios.post<SearchApiResponse>(
            functionUrl,
            payload,
            {
                cancelToken: cancelToken.token,
                headers: {
                    //'X-Firebase-AppCheck': 'allow',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`
                }
            }
        );

        const copyData = { ...response.data };
        const responseData = adapterDate(copyData);

        // console.log('Resultados de búsqueda recibidos:', responseData);

        return responseData;
    } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error(
                'Error en la respuesta de la función:',
                axiosError.response?.status,
                axiosError.response?.data
            );
            throw new Error(
                `Error del servidor ${axiosError.response?.status}: ${
                    typeof axiosError.response?.data === 'object' &&
                    axiosError.response?.data &&
                    'message' in axiosError.response.data
                        ? (axiosError.response.data as { message: string })
                              .message
                        : axiosError.message
                }`
            );
        }
        console.error(error);
        throw new Error('Error al buscar');
    }
};
