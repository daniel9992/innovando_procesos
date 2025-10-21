// Instala primero: npm install react-virtualized-auto-sizer
import { Box, Spinner } from '@chakra-ui/react';
import { useColorModeValue } from '@src/customAgencyTool/components/ui/color-mode';
import { useOutsideClick } from '@src/customAgencyTool/hook/useOutsideClick';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import type { BaseItem, RowItemData, VirtualizedTableProps } from './model';
import { TableHeader } from './table_Header';
import { RowRenderer } from './table_Row';

// Main component
export const VirtualizedTable = <T extends BaseItem>({
    items,
    columns,
    hasNextPage,
    isNextPageLoading,
    loadNextPage = () => Promise.resolve(),
    rowHeight = 55,
    callBackSelectedItems = () => {},
    callBackClickOutside = () => {},
    isEnabledSelection = true,
    isEnabledClickOutside = true,
    ceanOutside = false,
    setCleanOutside = () => {},
    minWidth = '800px',
    animateRows = true,

    onRowClick = () => {},
    onRowDoubleClick = () => {},
    onRowContextMenu = () => {}
}: VirtualizedTableProps<T>) => {
    const tableRef = useRef<HTMLDivElement>(null);
    const [selectedItems, setSelectedItems] = useState<ReadonlySet<T['id']>>(
        new Set()
    );

    useEffect(() => {
        // console.log('selectedItems', selectedItems);
        // const arrayList = Array.from(selectedItems);
        // console.log('arrayList', arrayList);
        callBackSelectedItems(selectedItems);
    }, [selectedItems, callBackSelectedItems]);

    const handleRowClick = useCallback(
        (itemId: T['id']) => {
            onRowClick(items.find((item) => item.id === itemId) as T);

            if (isEnabledSelection) {
                setSelectedItems((prev) => {
                    const newSelection = new Set(prev);
                    if (newSelection.has(itemId)) {
                        newSelection.delete(itemId);
                    } else {
                        newSelection.add(itemId);
                    }
                    return newSelection;
                });
            }
        },
        [isEnabledSelection, onRowClick, items]
    );

    const handleRowDoubleClick = useCallback(
        (itemId: T['id']) => {
            // console.log('Double Click Row ', itemId);
            onRowDoubleClick(items.find((item) => item.id === itemId) as T);
        },
        [onRowDoubleClick, items]
    );

    const handleRowContextMenu = useCallback(
        (itemId: T['id']) => {
            // console.log('ContextMenu Click Row ', itemId);
            onRowContextMenu(items.find((item) => item.id === itemId) as T);
        },
        [onRowContextMenu, items]
    );

    const handleCleanOutside = useCallback(() => {
        // console.log('Clean Outside');
        setTimeout(() => {
            setSelectedItems(new Set());
        }, 300);
        // setSelectedItems(new Set());
    }, []);

    useEffect(() => {
        if (ceanOutside) {
            handleCleanOutside();
            setCleanOutside(false);
        }
    }, [ceanOutside, setCleanOutside, handleCleanOutside]);

    useOutsideClick({
        ref: tableRef,
        handler: () => {
            if (isEnabledClickOutside) {
                handleCleanOutside();
            }
            callBackClickOutside();
        }
    });

    const itemCount = hasNextPage ? items.length + 35 : items.length;

    const isItemLoaded = useCallback(
        (index: number) => !hasNextPage || index < items.length,
        [hasNextPage, items.length]
    );

    const itemData = useMemo<RowItemData<T>>(
        () => ({
            items,
            columns,
            animateRows,
            selectedItems,
            handleRowClick,
            handleRowDoubleClick,
            handleRowContextMenu
        }),
        [
            items,
            columns,
            animateRows,
            selectedItems,
            handleRowClick,
            handleRowDoubleClick,
            handleRowContextMenu
        ]
    );

    const borderColor = useColorModeValue('gray.200', 'gray.600');

    return (
        <Box
            border="1px"
            borderColor={borderColor}
            borderRadius="md"
            minWidth={minWidth}
            overflow={'auto'}
            height="100%"
            width="100%"
            boxShadow="md"
        >
            {isNextPageLoading && <Spinner />}

            <TableHeader columns={columns} />

            <Box ref={tableRef} height="calc(100% - 50px)">
                <AutoSizer>
                    {({ height, width }) => (
                        <InfiniteLoader
                            isItemLoaded={isItemLoaded}
                            itemCount={itemCount}
                            loadMoreItems={loadNextPage}
                        >
                            {({ onItemsRendered, ref }) => (
                                <FixedSizeList
                                    ref={ref}
                                    onItemsRendered={onItemsRendered}
                                    height={height}
                                    width={width}
                                    itemCount={itemCount}
                                    itemSize={rowHeight}
                                    itemData={
                                        itemData as unknown as RowItemData<BaseItem>
                                    }
                                >
                                    {RowRenderer}
                                </FixedSizeList>
                            )}
                        </InfiniteLoader>
                    )}
                </AutoSizer>
            </Box>
        </Box>
    );
};
