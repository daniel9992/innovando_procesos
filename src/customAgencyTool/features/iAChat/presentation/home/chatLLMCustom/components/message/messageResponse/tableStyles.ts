// components/message/MessageResponse/tableStyles.ts

export interface TableStyleConfig {
    container: string;
    table: string;
    thead: string;
    tbody: string;
    th: string;
    td: string;
    tr: string;
    caption?: string;
}

export const tableStyles: Record<
    'default' | 'striped' | 'bordered' | 'compact',
    TableStyleConfig
> = {
    default: {
        container: 'overflow-x-auto my-4 rounded-lg shadow',
        table: 'min-w-full divide-y divide-gray-200 rounded-lg shadow',
        thead: 'bg-purple-50',
        tbody: 'bg-white divide-y divide-gray-200',
        tr: 'hover:bg-gray-50 transition-colors duration-200',
        th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
        caption:
            'px-6 py-2 text-sm text-gray-600 bg-gray-50 border-t border-gray-200'
    },
    striped: {
        container: 'overflow-x-auto my-4 rounded-lg shadow',
        table: 'min-w-full  rounded-lg shadow',
        thead: 'bg-blue-50',
        tbody: 'bg-white',
        tr: 'even:bg-gray-50',
        th: 'px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider border-b-2 border-blue-200',
        td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-b border-gray-200',
        caption:
            'px-6 py-2 text-sm text-blue-600 bg-blue-50 border-t border-blue-200'
    },
    bordered: {
        container: 'overflow-x-auto my-4 rounded-lg shadow',
        table: 'min-w-full border border-gray-200  rounded-lg shadow',
        thead: 'bg-gray-100',
        tbody: 'bg-white',
        tr: 'hover:bg-gray-50 transition-colors duration-200',
        th: 'px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border border-gray-200',
        td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-700 border border-gray-200',
        caption:
            'px-6 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-200'
    },
    compact: {
        container: 'overflow-x-auto my-4 rounded shadow-sm',
        table: 'min-w-full text-xs  rounded-lg shadow',
        thead: 'bg-gray-100',
        tbody: 'bg-white',
        tr: 'hover:bg-gray-50',
        th: 'px-4 py-2 text-left font-medium text-gray-600 uppercase tracking-wider',
        td: 'px-4 py-2 whitespace-nowrap text-gray-600',
        caption: 'px-4 py-1 text-xs text-gray-600 bg-gray-50'
    }
};
