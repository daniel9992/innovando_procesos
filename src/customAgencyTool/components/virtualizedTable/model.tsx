import { type CSSProperties, type Dispatch, type ReactNode } from 'react';

export interface ColumnDefinition<T> {
    key: keyof T | string;
    header: string;
    headerOnClick?: () => void;
    isSortable?: boolean;
    headerOnSort?: (header: string, sort: 'asc' | 'desc' | '') => void;
    headerStyle?: CSSProperties;

    width: string;
    renderCell: (item: T, isSelected: boolean) => ReactNode;
}

export interface BaseItem {
    id: string | number;
}

export interface VirtualizedTableProps<T extends BaseItem> {
    items: readonly T[];
    columns: readonly ColumnDefinition<T>[];
    hasNextPage: boolean;
    isNextPageLoading: boolean;
    loadNextPage?: () => Promise<void>;
    rowHeight?: number;
    callBackSelectedItems?: (items: ReadonlySet<T['id']>) => void;
    callBackClickOutside?: () => void;
    isEnabledSelection?: boolean;
    isEnabledClickOutside?: boolean;
    ceanOutside?: boolean;
    setCleanOutside?: Dispatch<React.SetStateAction<boolean>>;
    minWidth?: string;
    animateRows?: boolean;
    //
    onRowClick?: (item: T) => void;
    onRowDoubleClick?: (item: T) => void;
    onRowContextMenu?: (item: T) => void;
}

export interface RowItemData<T extends BaseItem> {
    readonly animateRows: boolean;
    readonly items: readonly T[];
    readonly columns: readonly ColumnDefinition<T>[];
    readonly selectedItems: ReadonlySet<T['id']>;
    readonly handleRowClick: (itemId: T['id']) => void;
    readonly handleRowDoubleClick: (itemId: T['id']) => void;
    readonly handleRowContextMenu: (itemId: T['id']) => void;
}

// Optimized row component
export interface TableRowProps<T extends BaseItem> {
    index: number;
    item: T;
    columns: readonly ColumnDefinition<T>[];
    style: CSSProperties;
    isSelected: boolean;
    animateRows: boolean;
    onRowClick: (item: T) => void;
    onRowDoubleClick: (item: T) => void;
    onRowContextMenu: (item: T, event: React.MouseEvent) => void;
}
