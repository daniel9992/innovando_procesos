import { VirtualizedTable } from '@src/customAgencyTool/components/virtualizedTable/virtualizedTable';

import { type FC } from 'react';
import type { InterfaceDoc } from '../../../../../domain/modelConfigDocList';

import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import type { ColumnDefinition } from '@src/customAgencyTool/components/virtualizedTable/model';

interface Props {
    listDocs: InterfaceDoc[];
    isLoading?: boolean;
    hasMore?: boolean;
    loadMoreItems?: () => Promise<void>;
    onClick?: (item: InterfaceDoc, index: number) => void;
}

const DynamicTableDocList: FC<Props> = ({
    listDocs,
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
    const handledOnClick = (item: InterfaceDoc) => {
        const index = listDocs.findIndex((etem) => etem.id === item.id);

        onClick(item, index);
    };

    /**
     *  ? -----------------------------
     *  * Columns
     *  ? -----------------------------
     */
    const TableColumnsDocList: ColumnDefinition<InterfaceDoc>[] = [
        {
            key: 'docCode',
            header: 'Código',
            headerStyle: {
                textAlign: 'center'
            },

            headerOnClick: () => {
                console.log('Header on click');
            },
            width: '15%',
            renderCell: (item) => (
                <MyFlex
                    direction={'column'}
                    width={'100%'}
                    gap={0}
                    p={0}
                    justifyContent={'center'}
                >
                    <MyText textAlign={'center'}>{item.docCode}</MyText>
                </MyFlex>
            )
        },
        {
            key: 'docName',
            header: 'Nombre del Documento',
            headerOnClick: () => {
                console.log('Header on click');
            },
            width: '85%',
            renderCell: (item) => (
                <MyFlex direction={'column'} width={'100%'} gap={0} p={0}>
                    <MyText
                    //fontSize={'0.9rem'}
                    >
                        {item.docName}
                    </MyText>
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
                items={listDocs}
                columns={TableColumnsDocList}
                hasNextPage={hasMore}
                isNextPageLoading={isLoading}
                loadNextPage={loadMoreItems}
                onRowClick={handledOnClick}
            />
        </MyFlex>
    );
};

export default DynamicTableDocList;
