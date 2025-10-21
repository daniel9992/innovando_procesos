import { DayToDayFormat } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import { toFixedNumber } from '@src/customAgencyTool/utils/numberOperator/toFixNumber';
import axios, { type AxiosResponse } from 'axios';

// Types
export interface ExchangeRate {
    fecha: Date;
    valor: number;
}

export interface CurrencyExchange {
    compra: ExchangeRate;
    venta: ExchangeRate;
}

export interface ExchangeRateResponse {
    dolar: CurrencyExchange;
    euro: CurrencyExchange;
}

export interface HaciendaEuroRate {
    fecha: string;
    dolares: number;
    colones: number;
}

export interface HaciendaResponse {
    dolar: {
        venta: {
            fecha: string;
            valor: number;
        };
        compra: {
            fecha: string;
            valor: number;
        };
    };
    euro: HaciendaEuroRate;
}

// Constants
const API_CONFIG = {
    BASE_URL: 'https://api.hacienda.go.cr/indicadores/tc',
    PRECISION: {
        EURO_VENTA: 3,
        EURO_COMPRA: 4
    }
} as const;

// Error handling
class ExchangeRateError extends Error {
    constructor(message: string, public originalError?: Error) {
        super(message);
        this.name = 'ExchangeRateError';
    }
}

// Helper functions
const calculateEuroRates = (
    euroDollarRate: number,
    dollarRates: CurrencyExchange
): CurrencyExchange => {
    return {
        venta: {
            fecha: dollarRates.venta.fecha,
            valor: toFixedNumber(
                euroDollarRate * dollarRates.venta.valor,
                API_CONFIG.PRECISION.EURO_VENTA
            )
        },
        compra: {
            fecha: dollarRates.compra.fecha,
            valor: toFixedNumber(
                euroDollarRate * dollarRates.compra.valor,
                API_CONFIG.PRECISION.EURO_COMPRA
            )
        }
    };
};

const formatExchangeRate = (data: HaciendaResponse): ExchangeRateResponse => {
    const queryDay = DayToDayFormat(new Date(data.dolar.venta.fecha));

    const dollarRates: CurrencyExchange = {
        venta: {
            fecha: queryDay,
            valor: data.dolar.venta.valor
        },
        compra: {
            fecha: queryDay,
            valor: data.dolar.compra.valor
        }
    };

    return {
        dolar: dollarRates,
        euro: calculateEuroRates(data.euro.dolares, dollarRates)
    };
};

// API call function
const fetchExchangeRates = async (): Promise<
    AxiosResponse<HaciendaResponse>
> => {
    try {
        console.log('fetchExchangeRates');

        return await axios.get<HaciendaResponse>(API_CONFIG.BASE_URL);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new ExchangeRateError(
                `Error en la solicitud: ${error.message}`,
                error
            );
        }
        throw new ExchangeRateError(
            'Error inesperado al obtener el tipo de cambio',
            error as Error
        );
    }
};

// Main function
export const getCurrencyRate = async (): Promise<ExchangeRateResponse> => {
    try {
        const response = await fetchExchangeRates();

        if (!response || response.status !== 200) {
            throw new ExchangeRateError('Respuesta inválida del servidor');
        }

        return formatExchangeRate(response.data);
    } catch (error) {
        if (error instanceof ExchangeRateError) {
            throw error;
        }
        throw new ExchangeRateError(
            'Error al obtener el tipo de cambio',
            error as Error
        );
    }
};

// Optional: Add retry mechanism
export const getCurrencyRateWithRetry = async (
    retries = 3,
    delay = 1000
): Promise<ExchangeRateResponse> => {
    for (let i = 0; i < retries; i++) {
        try {
            return await getCurrencyRate();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw new ExchangeRateError('Máximo número de intentos alcanzado');
};

// Service layer
export class ExchangeRateService {
    private static instance: ExchangeRateService;
    private cache: {
        data?: ExchangeRateResponse;
        timestamp?: number;
    } = {};

    private constructor() {}

    static getInstance(): ExchangeRateService {
        if (!ExchangeRateService.instance) {
            ExchangeRateService.instance = new ExchangeRateService();
        }
        return ExchangeRateService.instance;
    }

    async getExchangeRates(
        forceRefresh = false
    ): Promise<ExchangeRateResponse> {
        const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
        const now = Date.now();

        if (
            !forceRefresh &&
            this.cache.data &&
            this.cache.timestamp &&
            now - this.cache.timestamp < CACHE_DURATION
        ) {
            return this.cache.data;
        }

        const data = await getCurrencyRateWithRetry();
        this.cache = {
            data,
            timestamp: now
        };
        return data;
    }
}

export const exchangeRateService = ExchangeRateService.getInstance();

// // Testing
// describe('ExchangeRateService', () => {
//     let service: ExchangeRateService;

//     beforeEach(() => {
//         service = ExchangeRateService.getInstance();
//     });

//     it('should fetch exchange rates', async () => {
//         const rates = await service.getExchangeRates();
//         expect(rates).toBeDefined();
//         expect(rates.dolar).toBeDefined();
//         expect(rates.euro).toBeDefined();
//     });
// });
