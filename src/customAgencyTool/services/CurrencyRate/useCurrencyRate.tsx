import {
    getFromLocalStorage,
    persistLocalStorage
} from '@src/customAgencyTool/utils/manageStorage/manageStorage';
import { useCallback, useEffect, useState } from 'react';
import { getCurrencyRate, type ExchangeRateResponse } from './currencyRate';

interface ExchangeRateState {
    data: ExchangeRateResponse | null;
    status: 'idle' | 'loading' | 'success' | 'error';
    error: Error | null;
    lastUpdated: number | null;
}

interface UseExchangeRateOptions {
    cacheDuration?: number; // duración del cache en millisegundos
    refreshInterval?: number; // intervalo de actualización en millisegundos
    localStorageKey?: string;
}

const DEFAULT_OPTIONS = {
    cacheDuration: 1000 * 60 * 60, // 1 hora
    refreshInterval: 1000 * 60 * 5, // 5 minutos
    localStorageKey: 'exchangeRateData'
};

export const useExchangeRate = (options: UseExchangeRateOptions = {}) => {
    const { cacheDuration, refreshInterval, localStorageKey } = {
        ...DEFAULT_OPTIONS,
        ...options
    };

    const [state, setState] = useState<ExchangeRateState>({
        data: null,
        status: 'idle',
        error: null,
        lastUpdated: null
    });

    // Obtener datos del localStorage
    const getStoredData = useCallback(() => {
        try {
            // const storedData = localStorage.getItem(localStorageKey);
            const storedData = getFromLocalStorage(localStorageKey);
            if (!storedData) return null;

            const { data, lastUpdated } = storedData;
            const now = Date.now();

            // Verificar si los datos están vigentes
            if (lastUpdated && now - lastUpdated < cacheDuration) {
                return data;
            }
            return null;
        } catch (error) {
            console.error('Error al leer del localStorage:', error);
            return null;
        }
    }, [localStorageKey, cacheDuration]);

    // Guardar datos en localStorage
    const storeData = useCallback(
        (data: ExchangeRateResponse) => {
            try {
                const storageData = {
                    data,
                    lastUpdated: Date.now()
                };
                // localStorage.setItem(
                //     localStorageKey,
                //     JSON.stringify(storageData)
                // );
                persistLocalStorage(localStorageKey, storageData);
            } catch (error) {
                console.error('Error al guardar en localStorage:', error);
            }
        },
        [localStorageKey]
    );

    // Función para obtener los tipos de cambio
    const fetchExchangeRates = useCallback(
        async (force: boolean = false) => {
            // Si no es forzado, intentar usar datos del cache
            if (!force) {
                const cachedData = getStoredData();
                if (cachedData) {
                    setState((prev) => ({
                        ...prev,
                        data: cachedData,
                        status: 'success'
                    }));
                    return;
                }
            }

            setState((prev) => ({ ...prev, status: 'loading' }));

            try {
                const newRates = await getCurrencyRate();
                storeData(newRates);
                setState({
                    data: newRates,
                    status: 'success',
                    error: null,
                    lastUpdated: Date.now()
                });
            } catch (error) {
                setState((prev) => ({
                    ...prev,
                    status: 'error',
                    error: error as Error
                }));
            }
        },
        [getStoredData, storeData]
    );

    // Función para forzar una actualización
    const refresh = useCallback(() => {
        return fetchExchangeRates(true);
    }, [fetchExchangeRates]);

    // Efecto inicial y polling
    useEffect(() => {
        fetchExchangeRates();

        const interval = setInterval(() => {
            fetchExchangeRates();
        }, refreshInterval);

        return () => clearInterval(interval);
    }, [fetchExchangeRates, refreshInterval]);

    // Calcular tiempo hasta la próxima actualización
    const timeUntilNextUpdate = useCallback(() => {
        if (!state.lastUpdated) return 0;
        const timeSinceLastUpdate = Date.now() - state.lastUpdated;
        return Math.max(0, refreshInterval - timeSinceLastUpdate);
    }, [state.lastUpdated, refreshInterval]);

    return {
        ...state,
        refresh,
        timeUntilNextUpdate: timeUntilNextUpdate(),
        isStale: state.lastUpdated
            ? Date.now() - state.lastUpdated > cacheDuration
            : true
    };
};
