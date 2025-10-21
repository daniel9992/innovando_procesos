import { MyFlex } from '@src/customAgencyTool/components/ui';
import { VirtualizedTable } from '@src/customAgencyTool/components/virtualizedTable/virtualizedTable';
import type { InterfaceCurrentUser } from '@src/customAgencyTool/features/auth/domain/user.entity';
import { useState, type FC } from 'react';
import { TableColumnsCurrentUser } from './tableColumnsProformaInvoice';

interface Props {
    users: InterfaceCurrentUser[];
    isLoading?: boolean;
    hasMore?: boolean;
    loadMoreItems?: () => Promise<void>;
}

const DynamicTable: FC<Props> = ({
    users,
    isLoading = false,
    hasMore = false,
    loadMoreItems
}) => {
    const [isEnabledClickOutside, setIsEnabledClickOutside] = useState(false);

    /**
     *  ? -----------------------------
     *  * Doble Click
     *  ? -----------------------------
     */
    const handledOnDobleClick = (item: InterfaceCurrentUser) => {
        console.log('handledOnDobleClick', item);

        //     persistLocalStorage(
        //         SESSION_STORAGE_PROFORMAINVOICE,
        //         JSON.stringify(item)
        //     );

        //     const path = GeneratePath(item);

        //     navigate(path);
    };

    /**
     *  ? -----------------------------
     *  * Render
     *  ? -----------------------------
     */
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
                    minWidth={'900px'}
                    items={users}
                    columns={TableColumnsCurrentUser}
                    hasNextPage={hasMore}
                    isNextPageLoading={isLoading}
                    loadNextPage={loadMoreItems}
                    ceanOutside={isEnabledClickOutside}
                    setCleanOutside={setIsEnabledClickOutside}
                    onRowDoubleClick={handledOnDobleClick}
                />
            </MyFlex>
        </div>
    );
};

export default DynamicTable;
