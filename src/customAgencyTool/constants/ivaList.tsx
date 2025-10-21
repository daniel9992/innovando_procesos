//InterfaceItem

import type { InterfaceItem } from '../components/ui/mySelect';

export const ListIVA: InterfaceItem[] = [
    {
        value: 0.01,
        label: '1%'
    },
    {
        value: 0.02,
        label: '2%'
    },
    {
        value: 0.04,
        label: '4%'
    },
    {
        value: 0.08,
        label: '8%'
    },
    {
        value: 0.13,
        label: '13%'
    },
    {
        value: 0,
        label: 'Exonerado'
    }
];

export const GetIVA = (
    value: number,
    withExonerated?: boolean
): string => {
    if (value === 0 && withExonerated) {
        return `${value}%`;
    }

    const match = ListIVA.find((item) => item.value === value);

    if (match) {
        return `${match.label}`;
    }

    return `${value}%`;
};
