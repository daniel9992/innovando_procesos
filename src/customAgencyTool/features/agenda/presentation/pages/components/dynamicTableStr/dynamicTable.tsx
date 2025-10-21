import { VirtualizedTable } from '@src/customAgencyTool/components/virtualizedTable/virtualizedTable';
import type { InterfaceClient } from '@src/customAgencyTool/features/agenda/domain/agendaModel';
import { type FC } from 'react';
// import { TableColumnsAgenda } from './tableColumns';
import { MyButton, MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import type { ColumnDefinition } from '@src/customAgencyTool/components/virtualizedTable/model';

interface Props {
    clients: InterfaceClient[];
    isLoading?: boolean;
    hasMore?: boolean;
    loadMoreItems?: () => Promise<void>;
    onSelectedClient?: (client: InterfaceClient) => void;
    onEditClient?: (client: InterfaceClient) => void;
}

const DynamicTableStr: FC<Props> = ({
    clients,
    isLoading = false,
    hasMore = false,
    loadMoreItems,
    onSelectedClient = () => {},
    onEditClient = () => {}
}) => {
    /**
     *  ? -----------------------------
     *  * On Click
     *  ? -----------------------------
     */
    const handledOnClick = (item: InterfaceClient) => {
        onSelectedClient(item);
    };

    /**
     *  ? -----------------------------
     *  * On Edit
     *  ? -----------------------------
     */
    const handledOnEdit = (item: InterfaceClient) => {
        onEditClient(item);
    };

    /**
     *  ? -----------------------------
     *  * Render
     *  ? -----------------------------
     */
    const TableColumnsAgenda: ColumnDefinition<InterfaceClient>[] = [
        {
            key: 'clientName',
            header: 'Cliente',
            width: '100%',
            renderCell: (item) => (
                <MyFlex
                    direction={'row'}
                    width={'100%'}
                    gap={0}
                    p={0}
                    justifyContent={'space-between'}
                    align={'center'}
                >
                    <MyFlex
                        flex={1}
                        gap={0}
                        height={'100%'}
                        borderRadius={'none'}
                        onClick={() => {
                            handledOnClick(item);
                        }}
                    >
                        <MyText
                            //
                            fontSize={'0.8rem'}
                            truncate
                            lineClamp={2}
                        >
                            {item.clientName}
                        </MyText>
                    </MyFlex>
                    <MyButton
                        variant={'plain'}
                        size={'xs'}
                        icon={'EDIT'}
                        aria-label={'Editar'}
                        zIndex={10}
                        onClick={() => {
                            handledOnEdit(item);
                        }}
                    />
                </MyFlex>
            )
        }
    ];

    return (
        <div>
            <MyFlex
                direction={'column'}
                height="70vh" //76
                width={'100%'}
                pb={5}
                overflow={'auto'}
            >
                <VirtualizedTable
                    minWidth={'200px'}
                    items={clients}
                    columns={TableColumnsAgenda}
                    hasNextPage={hasMore}
                    isNextPageLoading={isLoading}
                    loadNextPage={loadMoreItems}
                    //onRowClick={handledOnClick}
                    animateRows={false}
                />
            </MyFlex>
        </div>
    );
};

export default DynamicTableStr;
