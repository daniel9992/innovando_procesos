import { Flex } from '@chakra-ui/react';
import { AppConfig } from '@src/customAgencyTool/_appConfig/appConfig';
import { MyButton, MyText } from '@src/customAgencyTool/components/ui';
import { useColorModeValue } from '@src/customAgencyTool/components/ui/color-mode';
import { memo, useMemo, useState, type ReactNode } from 'react';
import type { BaseItem, ColumnDefinition } from './model';

export const TableHeader = memo(
    <T extends BaseItem>({
        columns
    }: {
        columns: readonly ColumnDefinition<T>[];
    }) => {
        const headerBg = useColorModeValue(
            AppConfig.SecondaryColor,
            AppConfig.SecondaryColorDark
        );

        const headerColor = useColorModeValue('white', 'white');
        const borderColor = useColorModeValue('gray.200', 'gray.600');

        const handleClick = (
            item: ColumnDefinition<T>,
            event: React.MouseEvent<HTMLDivElement>
        ) => {
            event.preventDefault();

            item.headerOnClick?.();
        };

        const initialSortColumn = useMemo(() => {
            const find = columns.find((item) => item.isSortable);
            if (find) {
                return {
                    header: find.header,
                    sort: 'asc'
                };
            }
            return {
                header: '',
                sort: 'asc'
            };
        }, [columns]);

        const [sortColumn, setSortColumn] = useState(initialSortColumn);

        return (
            <Flex
                bg={headerBg}
                borderBottom="1px"
                borderColor={borderColor}
                color={headerColor}
                borderRadius={`5px 5px 0 0`}
            >
                {columns.map((col) => (
                    <Flex
                        key={String(col.key)}
                        width={col.width}
                        p={3}
                        alignItems="center"
                        cursor="pointer"
                        borderEnd={'1px solid #ffffff'}
                    >
                        <MyText
                            fontWeight="bold"
                            fontSize="sm"
                            width={'100%'}
                            style={col.headerStyle}
                            onClick={(event) => {
                                handleClick(col, event);
                            }}
                        >
                            {col.header}
                        </MyText>
                        <Flex
                            direction={'column'}
                            display={col.isSortable ? 'flex' : 'none'}
                            alignItems={'center'}
                        >
                            <MyButton
                                aria-label="Sort Ascending"
                                size={'xs'}
                                icon={
                                    sortColumn.header === col.header &&
                                    sortColumn.sort === 'asc'
                                        ? 'SortAmountUp'
                                        : 'SortAmountDown'
                                }
                                variant={'ghost'}
                                colorPalette={'blue'}
                                onClick={() => {
                                    if (sortColumn.sort === 'asc') {
                                        const newSort = {
                                            header: col.header,
                                            sort: 'desc'
                                        };
                                        setSortColumn(newSort);
                                        col.headerOnSort?.(col.header, 'desc');
                                    } else {
                                        const newSort = {
                                            header: col.header,
                                            sort: 'asc'
                                        };
                                        setSortColumn(newSort);
                                        col.headerOnSort?.(col.header, 'asc');
                                    }
                                }}
                            />
                        </Flex>
                    </Flex>
                ))}
            </Flex>
        );
    }
) as <T extends BaseItem>(props: {
    columns: readonly ColumnDefinition<T>[];
}) => ReactNode;
