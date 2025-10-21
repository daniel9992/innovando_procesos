import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';

import { ListVolumeTypes } from '@src/customAgencyTool/constants/listVolumenTypes';
import { type FieldProps } from 'formik';
import { useMemo, useRef, useState, type ChangeEvent, type FC } from 'react';
import { MyBox, MyButton, MyFlex, MyInputText, MyMenu } from '../../ui';
import type { MenuItemButon } from '../../ui/myMenu';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

export interface InterfaceSelectedVolumen {
    value: number;
    measurees: string;
    description: string;
}

const adapterVolumen = (
    value: InterfaceSelectedVolumen | number | string
): InterfaceSelectedVolumen => {
    if (typeof value === 'number') {
        return {
            value: value,
            measurees: 'm3',
            description: 'Milimetros (m3)'
        };
    }

    if (typeof value === 'string') {
        return {
            value: parseFloat(value),
            measurees: 'm3',
            description: 'Milimetros (m3)'
        };
    }

    return value;
};

const DEFAULT_WEIGHT: InterfaceSelectedVolumen = {
    value: 0,
    measurees: 'm3',
    description: 'Milimetros (m3)'
};

export const getVolumeStr = (
    value: InterfaceSelectedVolumen | number | string
) => {
    if (typeof value === 'number') {
        return value.toString();
    }
    if (typeof value === 'string') {
        return value;
    }
    return value.value.toString();
};

interface CustomInputProps {
    label?: string;
    icon?: string;
    typeError?: 'top' | 'bottom';
}

export const FormikInputVolumen: FC<CustomInputProps & FieldProps> = ({
    label = '',
    icon,
    typeError = 'top',
    field,
    form,
    ...props
}) => {
    const isError = form.touched[field.name] && form.errors[field.name];
    const inputNumberRef = useRef<HTMLInputElement>(null);
    const [selectedWeight, setSelectedVolumen] =
        useState<InterfaceSelectedVolumen>(DEFAULT_WEIGHT);

    const startInputValue = useMemo(() => {
        if (!field.value) {
            return '0';
        }

        const adapter = adapterVolumen(field.value);

        return adapter.value.toString();
    }, [field.value]);

    const [inputValue, setInputValue] = useState<string>(startInputValue);

    const menuItemButtons = ListVolumeTypes.map(
        (item) =>
            ({
                id: `${item.value}`,
                label: `(${item.value}) ${item.label}`,
                type: 'RadioItem',
                isActive: true,
                allowRoles: ['todos'],
                onClick: () => {
                    // inputNumberRef.current?.focus();
                    // field.onChange(item.value);
                    const measurees = item.value ? item.value : '';
                    const description = item.label ? item.label : '';

                    setSelectedVolumen((prev) => ({
                        ...prev,
                        measurees: measurees as string,
                        description: description
                    }));

                    //
                    form.setFieldValue(field.name + '.measurees', measurees);

                    form.setFieldValue(
                        field.name + '.description',
                        description
                    );
                }
            } as MenuItemButon)
    );

    const handledOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(',', '.'); // Normalize comma to dot for consistency

        // Regex to validate a decimal number  or integer
        const decimalNumberRegex = /^-?\d*\.?\d*$/;

        if (decimalNumberRegex.test(value)) {
            setInputValue(value);

            const newValue =
                value === '' || value === '-' || value === '.'
                    ? ''
                    : parseFloat(value);

            if (!isNaN(newValue as number)) {
                const tempValue = {
                    ...selectedWeight,
                    value: newValue
                };

                form.setFieldValue(field.name, tempValue);
            } else {
                const tempValue = {
                    ...selectedWeight,
                    value: ''
                };
                form.setFieldValue(field.name, tempValue);
            }
        }
    };

    const renderLabel = () => (
        <ChakraField.Label css={floatingStyles} truncate>
            {icon && <SelectedIcons iconName={icon} />}
            {label}
        </ChakraField.Label>
    );

    if (typeError === 'top') {
        return (
            <ChakraField.Root gap={1} {...props}>
                <MyFlex
                    pos="relative"
                    w="full"
                    direction={'row'}
                    gap={0}
                    p={0}
                    alignContent={'center'}
                    alignItems={'center'}
                    bg={'bg.muted'}
                >
                    <MyInputText
                        id={field.name}
                        ref={inputNumberRef}
                        data-testid={field.name}
                        key={'key-input-' + field.name}
                        className="peer"
                        placeholder=""
                        border={isError ? '1px solid #921313' : ''}
                        value={inputValue}
                        onChange={(value) => {
                            handledOnChange(value);
                        }}
                    />
                    <MyMenu
                        placement={'right-start'}
                        withOutPortal={true}
                        triggerAsChild={
                            <MyButton
                                aria-label="ArrowDown to selected Weight"
                                rightIcon={'ArrowDown'}
                                size={'xs'}
                                variant={'ghost'}
                            >
                                {selectedWeight.measurees}
                            </MyButton>
                        }
                        setInitialValueRadio={`(${selectedWeight.measurees}) ${selectedWeight.description}`}
                        verticalMenuItems={[
                            {
                                id: '1',
                                label: 'Medidas de Peso',
                                icon: 'SortAlphaDown',
                                type: 'RadioItem',
                                isActive: true,
                                allowRoles: ['todos'],
                                subMenus: [...menuItemButtons]
                            }
                        ]}
                    />
                    {renderLabel()}
                </MyFlex>
                <RenderErrorMessage
                    name={field.name}
                    position={'top'}
                    isError={isError ? true : false}
                    errorMessage={form.errors[field.name] as string}
                />
            </ChakraField.Root>
        );
    }

    return (
        <ChakraField.Root gap={1} {...props}>
            <MyBox
                pos="relative"
                w="full"
                direction={'row'}
                gap={0}
                p={0}
                alignContent={'center'}
                alignItems={'center'}
                bg={'bg.muted'}
            >
                <MyInputText
                    id={field.name}
                    data-testid={field.name}
                    key={'key-input-' + field.name}
                    className="peer"
                    placeholder=""
                    border={isError ? '1px solid #921313' : ''}
                    value={inputValue}
                    onChange={(value) => {
                        handledOnChange(value);
                    }}
                />
                <MyMenu
                    placement={'right-start'}
                    withOutPortal={true}
                    triggerAsChild={
                        <MyButton
                            aria-label="ArrowDown to selected Weight"
                            rightIcon={'ArrowDown'}
                            size={'xs'}
                            variant={'ghost'}
                        >
                            {selectedWeight.measurees}
                        </MyButton>
                    }
                    setInitialValueRadio={`(${selectedWeight.measurees}) ${selectedWeight.description}`}
                    verticalMenuItems={[
                        {
                            id: '1',
                            label: 'Medidas de Peso',
                            icon: 'SortAlphaDown',
                            type: 'RadioItem',
                            isActive: true,
                            allowRoles: ['todos'],
                            subMenus: [...menuItemButtons]
                        }
                    ]}
                />

                {renderLabel()}
            </MyBox>
            <RenderErrorMessage
                name={field.name}
                position={'bottom'}
                isError={isError ? true : false}
                errorMessage={form.errors[field.name] as string}
            />
        </ChakraField.Root>
    );
};

const floatingStyles = defineStyle({
    pos: 'absolute',
    // bg: 'bg',
    bg: 'bg.muted',
    px: '0.5rem',
    borderRadius: '5px',
    top: '-3',
    insetStart: '2',
    fontWeight: 'normal',
    pointerEvents: 'none',
    transition: 'position',
    _peerPlaceholderShown: {
        color: 'fg.muted',
        top: '2.5',
        insetStart: '3'
    },
    _peerFocusVisible: {
        color: 'fg',
        top: '-3',
        insetStart: '2'
    }
});
