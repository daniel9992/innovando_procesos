import {
    ColorSwatch,
    HStack,
    Select,
    Span,
    Stack,
    createListCollection
} from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { memo, useCallback, useMemo, useState } from 'react';
import { MyFlex } from './myFlex';

export interface InterfaceItem {
    value: string | number;
    label?: string;
    color?: string;
    icon?: string;
    description?: string;
}

export type TypeItem = 'value' | 'label' | 'color' | 'icon' | 'description';

interface SelectProps {
    htmlFor?: string;
    showItem?: TypeItem[];
    items?: InterfaceItem[];
    defaultValue?: string[];

    onChange?: (value: string[]) => void;
    placeholder?: string;
    disabled?: boolean;
    isClearTrigger?: boolean;
    width?: string;
    isMultiple?: boolean;
    isInvalid?: boolean;
    placement?: 'top' | 'bottom';
}

const SelectItem = memo(
    ({
        framework,
        showItem
    }: {
        framework: InterfaceItem;
        showItem: TypeItem[];
    }) => (
        <Select.Item item={framework}>
            <HStack gap={2}>
                {showItem.includes('icon') && framework.icon && (
                    <SelectedIcons iconName={framework.icon} size="18px" />
                )}
                {showItem.includes('color') && framework.color && (
                    <ColorSwatch size="sm" value={framework.color} />
                )}
                <Stack gap="0">
                    <Select.ItemText>
                        {showItem.includes('value') && (
                            <span
                                style={{
                                    fontWeight: 'semibold'
                                }}
                            >{` ${framework.value} `}</span>
                        )}
                        {showItem.includes('label') && framework.label}
                    </Select.ItemText>
                    {showItem.includes('description') &&
                        framework.description && (
                            <Span color="fg.muted" textStyle="xs">
                                {framework.description}
                            </Span>
                        )}
                </Stack>
            </HStack>
            <Select.ItemIndicator />
        </Select.Item>
    )
);

SelectItem.displayName = 'SelectItem';

const DEFAULT_ITEMS: InterfaceItem[] = [];

export const MySelect = memo(
    ({
        htmlFor,
        showItem = ['value', 'label', 'color', 'icon', 'description'],
        items = DEFAULT_ITEMS,
        defaultValue = [],
        onChange,
        placeholder,
        disabled = false,
        isClearTrigger = false,
        width = '100%',
        isMultiple = false,
        isInvalid = false,
        placement = 'bottom'
    }: SelectProps) => {
        const [value, setValue] = useState<string[]>(defaultValue);
        const [selectedItem, setSelectedItem] = useState<
            InterfaceItem | undefined
        >(
            items.find(
                (item) =>
                    `${item.value}`.toLowerCase() ===
                    `${value[0]}`.toLowerCase()
            )
        );

        const listCollection = useMemo(
            () =>
                createListCollection({
                    items: items
                }),
            [items]
        );

        const handleValueChange = useCallback(
            (newValue: { value: string[] }) => {
                setValue(newValue.value);
                setSelectedItem(
                    listCollection.items.find(
                        (item) =>
                            `${item.value}`.toLowerCase() ===
                            `${newValue.value[0]}`.toLowerCase()
                    )
                );
                onChange?.(newValue.value);
            },
            [onChange, listCollection]
        );

        return (
            <HStack gap={1} width={'100%'}>
                <Select.Root
                    collection={listCollection}
                    value={value}
                    onValueChange={handleValueChange}
                    disabled={disabled}
                    invalid={isInvalid}
                    variant="subtle"
                    width={width}
                    multiple={isMultiple}
                    size={'sm'}
                    // textAlign={textAlign}

                    positioning={{ sameWidth: true, placement: placement }}
                >
                    <Select.HiddenSelect />

                    <Select.Control>
                        <Select.Trigger
                            // htmlFor={htmlFor}
                            aria-labelledby={htmlFor}
                        >
                            <Select.ValueText placeholder={placeholder} />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            {isClearTrigger && <Select.ClearTrigger />}

                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>

                    <Select.Positioner>
                        <Select.Content>
                            {items.map((framework) => (
                                <SelectItem
                                    key={framework.value}
                                    framework={framework}
                                    showItem={showItem}
                                />
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Select.Root>
                {selectedItem?.color && (
                    <MyFlex
                        height="36px"
                        width="20px"
                        bg={selectedItem.color}
                        borderRadius={'5px'}
                    ></MyFlex>
                )}
            </HStack>
        );
    }
);

MySelect.displayName = 'MySelect';
