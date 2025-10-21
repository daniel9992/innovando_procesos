import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import type { ColumnDefinition } from '@src/customAgencyTool/components/virtualizedTable/model';
import { VirtualizedTable } from '@src/customAgencyTool/components/virtualizedTable/virtualizedTable';
import { GetIVA } from '@src/customAgencyTool/constants/ivaList';
import { type FC } from 'react';
import type { InterfaceRate } from '../../../../../domain/modelListOfRates';

interface Props {
    listOfRates: InterfaceRate[];
    isLoading?: boolean;
    hasMore?: boolean;
    loadMoreItems?: () => Promise<void>;
    onClick?: (item: InterfaceRate, index: number) => void;
}

const DynamicTableListOfRates: FC<Props> = ({
    listOfRates,
    isLoading = false,
    hasMore = false,
    loadMoreItems,
    onClick = () => {}
}) => {
    /**
     *  ? -----------------------------
     *  * On Click
     *  ? -----------------------------
     */
    const handledOnClick = (item: InterfaceRate) => {
        const index = listOfRates.findIndex((etem) => etem.id === item.id);

        onClick(item, index);
    };

    /**
     *  ? -----------------------------
     *  * Columns
     *  ? -----------------------------
     */
    const TableColumnsListOfRates: ColumnDefinition<InterfaceRate>[] = [
        {
            header: 'Código',
            headerStyle: {
                textAlign: 'center'
            },
            key: 'code',
            width: '15%',
            renderCell: (item) => (
                <MyFlex
                    direction={'column'}
                    width={'100%'}
                    gap={0}
                    p={0}
                    justifyContent={'center'}
                >
                    <MyText textAlign={'center'}>{item.code}</MyText>
                </MyFlex>
            )
        },
        {
            header: 'Nombre de Tarifa',
            key: 'rateName',
            width: '70%',
            renderCell: (item) => (
                <MyFlex
                    direction={'column'}
                    width={'100%'}
                    gap={0}
                    p={0}
                    justifyContent={'center'}
                >
                    <MyText>{item.rateName}</MyText>
                </MyFlex>
            )
        },
        {
            header: 'IVA',
            headerStyle: {
                textAlign: 'center'
            },
            key: 'iva',
            width: '15%',
            renderCell: (item) => (
                <MyFlex
                    direction={'column'}
                    width={'100%'}
                    gap={0}
                    p={0}
                    justifyContent={'center'}
                >
                    <MyText textAlign={'center'}>{GetIVA(item.iva)}</MyText>
                </MyFlex>
            )
        }
    ];
    /**
     *  ? -----------------------------
     *  * Render
     *  ? -----------------------------
     */
    return (
        <MyFlex
            direction={'column'}
            height="70vh" //76
            width={'100%'}
            pb={5}
            overflow={'auto'}
        >
            <VirtualizedTable
                animateRows={false}
                minWidth={'800px'}
                items={listOfRates}
                columns={TableColumnsListOfRates}
                hasNextPage={hasMore}
                isNextPageLoading={isLoading}
                loadNextPage={loadMoreItems}
                onRowClick={handledOnClick}
            />
        </MyFlex>
    );
};

export default DynamicTableListOfRates;
