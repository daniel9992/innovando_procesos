import { MyFlex, MyHeading, MyText } from '@src/customAgencyTool/components/ui';
import { adapterDate } from '@src/customAgencyTool/utils/adapter';
import { ShowDate } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import { useEffect, type Dispatch, type FC, type SetStateAction } from 'react';
import type { ExchangeRateResponse } from '../currencyRate';
import { useExchangeRate } from '../useCurrencyRate';

interface ShowCurrencyRateProps {
    setCurrencyRate?: Dispatch<
        SetStateAction<ExchangeRateResponse | undefined>
    >;
}

const ShowCurrencyRate: FC<ShowCurrencyRateProps> = ({
    setCurrencyRate = () => {}
}) => {
    const { data, status, error, refresh } = useExchangeRate({
        cacheDuration: 1000 * 60 * 60, // 60 minutos
        refreshInterval: 1000 * 60 * 5 // 5 minutos
    });

    useEffect(() => {
        if (data) {
            const copyData = JSON.parse(JSON.stringify(data));

            setCurrencyRate(adapterDate(copyData) as ExchangeRateResponse);
        }
    }, [data, setCurrencyRate]);

    if (status === 'loading' && !data) {
        return <div>Cargando...</div>;
    }

    if (status === 'error') {
        return (
            <div>
                Error: {error?.message}
                <button onClick={refresh}>Reintentar</button>
            </div>
        );
    }

    if (!data) return null;

    return (
        <MyFlex direction={'column'}>
            <MyHeading fontSize={'0.8rem'}>
                Tipo de cambio del: Ministerio de Hacienda
            </MyHeading>
            <MyText color={'gray'} fontSize={'0.8rem'}>
                Del día: {ShowDate(new Date(), 'D [de] MMMM [del] YYYY')}
            </MyText>
            <MyText fontSize={'0.8rem'}>
                $ Dólar: Compra ₡{data.dolar.compra.valor} / Venta ₡
                {data.dolar.venta.valor}
            </MyText>
            <MyText fontSize={'0.8rem'}>
                € Euro: Compra ₡{data.euro.compra.valor} / Venta ₡
                {data.euro.venta.valor}
            </MyText>
        </MyFlex>
    );
};

export default ShowCurrencyRate;
