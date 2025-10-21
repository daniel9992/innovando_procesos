import {
    SegmentGroup,
    useBreakpointValue,
    type SegmentGroupRootProps
} from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';
import { MyFlex } from './myFlex';

export interface InterfaceSegmentItems {
    id: string;
    value: string;
    label: ReactNode;
    disabled?: boolean;
    onClick?: () => void;
}

interface MySegmentProps extends SegmentGroupRootProps {
    isDisabled?: boolean;
    items: InterfaceSegmentItems[];
    selectedValue?: string;
}

export const MySegment: FC<MySegmentProps> = ({
    isDisabled = false,
    items = [],
    selectedValue,
    ...props
}) => {
    const breakPoint = useBreakpointValue({
        base: false,
        md: true
    });

    if (breakPoint === false) {
        return (
            <MyFlex
                //
                direction={'row'}
                flexWrap={'wrap'}
                p={0}
                // bg={'bg.muted'}
                borderRadius={'md'}
            >
                {items.map((item, index) => (
                    <MyFlex
                        key={`segment-item-${index}`}
                        direction={'row'}
                        justifyContent={'space-between'}
                        align={'center'}
                        gap={2}
                        bg={
                            selectedValue === item.value
                                ? 'bg.subtle'
                                : 'bg.muted'
                        }
                        border={
                            selectedValue === item.value
                                ? '1px solid gray'
                                : '1px solid transparent'
                        }
                        borderRadius={'md'}
                        cursor={'pointer'}
                        _hover={{
                            boxShadow: 'sm'
                        }}
                        onClick={() => {
                            item.onClick?.();
                        }}
                    >
                        {item.label}
                    </MyFlex>
                ))}
            </MyFlex>
        );
    }

    return (
        <SegmentGroup.Root
            defaultValue={selectedValue || items[0].value}
            onValueChange={(e) => {
                const findItem = items.find((item) => item.value === e.value);
                if (findItem) {
                    findItem.onClick?.();
                }
            }}
            disabled={isDisabled}
            {...props}
        >
            <SegmentGroup.Indicator />
            <SegmentGroup.Items items={items} />
        </SegmentGroup.Root>
    );
};
