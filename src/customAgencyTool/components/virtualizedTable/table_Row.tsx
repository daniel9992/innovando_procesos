import { Flex, Spinner } from '@chakra-ui/react';
import { AppConfig } from '@src/customAgencyTool/_appConfig/appConfig';
import { useColorModeValue } from '@src/customAgencyTool/components/ui/color-mode';
import { memo, useCallback, useEffect, useRef, type ReactNode } from 'react';
import { type ListChildComponentProps } from 'react-window';
import { MyBleed } from '../ui';
import type { BaseItem, RowItemData, TableRowProps } from './model';

// Memoized header component
const CLICK_DELAY = 250;

// Separate styles to improve readability and reusability

const TableRow = memo(
    <T extends BaseItem>({
        index,
        item,
        columns,
        style,
        isSelected,
        animateRows,
        onRowClick,
        onRowDoubleClick,
        onRowContextMenu
    }: TableRowProps<T>) => {
        const clickTimeoutRef = useRef<NodeJS.Timeout>(null);

        // Memoized color values
        const alternateRowBgColor = useColorModeValue('gray.100', 'gray.700');
        const selectedBg = useColorModeValue(
            AppConfig.SecondaryColor,
            AppConfig.SecondaryColorDark
            //'teal.400', 'teal.800'
        );
        const isAlternate = index % 2 === 0;

        // Handlers with proper event management and cleanup
        const handleClick = useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();

                if (clickTimeoutRef.current) {
                    clearTimeout(clickTimeoutRef.current);
                    clickTimeoutRef.current = null;
                    return;
                }

                clickTimeoutRef.current = setTimeout(() => {
                    onRowClick(item);
                    clickTimeoutRef.current = null;
                }, CLICK_DELAY);
            },
            [item, onRowClick]
        );

        const handleDoubleClick = useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();

                if (clickTimeoutRef.current) {
                    clearTimeout(clickTimeoutRef.current);
                    clickTimeoutRef.current = null;
                }

                onRowDoubleClick(item);
            },
            [item, onRowDoubleClick]
        );

        const handleContextMenu = useCallback(
            (event: React.MouseEvent) => {
                event.preventDefault();
                onRowContextMenu(item, event);
            },
            [item, onRowContextMenu]
        );

        // Cleanup timeout on unmount
        useEffect(() => {
            return () => {
                if (clickTimeoutRef.current) {
                    clearTimeout(clickTimeoutRef.current);
                }
            };
        }, []);

        return (
            <Flex style={style} alignItems="stretch">
                <Flex
                    as="div"
                    direction="row"
                    alignItems="center"
                    width="100%"
                    height="100%"
                    cursor="pointer"
                    position="relative"
                    overflow="hidden"
                    userSelect="none"
                    backgroundColor={isAlternate ? alternateRowBgColor : ''}
                    border={isSelected ? '1px solid #e7eaf675' : ''}
                    css={
                        animateRows && {
                            // Estilos para el pseudo-elemento que creará el efecto de barrido
                            '&::before': {
                                content: '""', // Requerido para que el pseudo-elemento se muestre
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: isSelected ? '100%' : '0%', // Ancho condicional basado en el estado
                                height: '100%',
                                backgroundColor: selectedBg, // El color que aparecerá
                                transition: 'width 0.2s ease-in-out', // La animación del barrido
                                zIndex: 0 // Se asegura que esté detrás del texto
                            },
                            // Estilos para el contenido de texto para que esté sobre el barrido
                            '& > *': {
                                position: 'relative',
                                zIndex: 1
                            }
                        }
                    }
                    _hover={{
                        bg: 'rgba(0, 0, 0, 0.1)',
                        transition: 'background-color 0.2s'
                    }}
                    onClick={handleClick}
                    onDoubleClick={handleDoubleClick}
                    onContextMenu={handleContextMenu}
                >
                    {columns.map((col) => (
                        <Flex
                            key={`${String(col.key)}-${item.id}`}
                            width={col.width}
                            height="100%"
                            p={3}
                            alignItems="center"
                        >
                            {col.renderCell(item, isSelected)}
                        </Flex>
                    ))}
                </Flex>
            </Flex>
        );
    }
) as <T extends BaseItem>(props: TableRowProps<T>) => ReactNode;

// Row renderer component
export const RowRenderer = <T extends BaseItem>({
    index,
    style,
    data
}: ListChildComponentProps<RowItemData<T>>) => {
    if (!data.items[index]) {
        return (
            <Flex style={style} align="center" justify="center">
                <MyBleed inline="10">
                    <Spinner />
                </MyBleed>
            </Flex>
        );
    }

    const item = data.items[index];
    const isSelected = data.selectedItems.has(item.id);

    return (
        <TableRow<T>
            index={index}
            item={item}
            columns={data.columns}
            style={style}
            isSelected={isSelected}
            animateRows={data.animateRows}
            onRowClick={() => data.handleRowClick(item.id)}
            onRowDoubleClick={() => data.handleRowDoubleClick(item.id)}
            onRowContextMenu={() => data.handleRowContextMenu(item.id)}
        />
    );
};
