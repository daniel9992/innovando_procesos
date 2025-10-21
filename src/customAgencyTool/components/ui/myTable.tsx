import { Table } from '@chakra-ui/react';
import type { ReactNode } from 'react';

export interface MyTableHeader<T> {
    // La hacemos genérica
    id: string;
    key: string;
    header: string;
    width?: string;
    textAlign?: 'left' | 'center' | 'right';
    // Esta función renderizará la celda si está definida
    renderCell?: (item: T) => ReactNode;
}

interface MyTableProps<T> {
    headers: MyTableHeader<T>[];
    items: T[];
    variant?: 'line' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isStriped?: boolean;
    onRowClick?: (item: T) => void;
    bgHeader?: string;
    bgHeaderColor?: string;
}

export function MyTable<T extends { id: string | number }>({
    headers,
    items,
    variant = 'outline',
    size = 'md',
    isStriped = false,
    bgHeader,
    bgHeaderColor,
    onRowClick
}: MyTableProps<T>) {
    return (
        <Table.Root
            variant={variant}
            size={size}
            borderRadius={'10px'}
            striped={isStriped}
        >
            <Table.ColumnGroup>
                {headers.map((header, index) => (
                    <Table.Column
                        key={`columnGroup-${header.id}-${index}`}
                        htmlWidth={header.width}
                    />
                ))}
            </Table.ColumnGroup>
            <Table.Header bg={bgHeader}>
                <Table.Row>
                    {headers.map((header) => (
                        <Table.ColumnHeader
                            key={header.id}
                            // width={header.width}
                            textAlign={header.textAlign || 'left'}
                            color={bgHeaderColor}
                            fontWeight={'bold'}
                        >
                            {header.header}
                        </Table.ColumnHeader>
                    ))}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {items.map((item) => (
                    <Table.Row
                        key={item.id}
                        onClick={() => onRowClick?.(item)}
                        // cursor={onRowClick ? 'pointer' : 'default'}
                    >
                        {headers.map((header) => (
                            <Table.Cell
                                key={`${item.id}-${header.id}`}
                                textAlign={header.textAlign || 'left'}
                            >
                                {
                                    // ✨ Lógica principal ✨
                                    // Si existe renderCell, úsalo. Si no, muestra el texto.
                                    header.renderCell
                                        ? header.renderCell(item)
                                        : (item[
                                              header.key as keyof T
                                          ] as ReactNode)
                                }
                            </Table.Cell>
                        ))}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}
