import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';

import { ListWeightTypes } from '@src/customAgencyTool/constants/listWeightTypes';
import { isNumber } from '@src/customAgencyTool/utils/numberOperator/numberTool';
import { type FieldProps } from 'formik';
import { useMemo, useRef, useState, type ChangeEvent, type FC } from 'react';
import { MyBox, MyButton, MyFlex, MyInputText, MyMenu } from '../../ui';
import type { MenuItemButon } from '../../ui/myMenu';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

export interface InterfaceSelectedWeight {
    value: number;
    measurees: string;
    description: string;
}

const adapterWeight = (
    value: InterfaceSelectedWeight | number | string
): InterfaceSelectedWeight => {
    if (typeof value === 'number') {
        return {
            value: value,
            measurees: 'KG',
            description: 'Kilograms'
        };
    }

    if (typeof value === 'string') {
        return {
            value: parseFloat(value),
            measurees: 'KG',
            description: 'Kilograms'
        };
    }

    return value;
};

const DEFAULT_WEIGHT: InterfaceSelectedWeight = {
    value: 0,
    measurees: 'KG',
    description: 'Kilograms'
};

export const getWeightStr = (
    value: InterfaceSelectedWeight | number | string
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

export const FormikInputGrossWeight: FC<CustomInputProps & FieldProps> = ({
    label = '',
    icon,
    typeError = 'top',
    field,
    form,
    ...props
}) => {
    const isError = form.touched[field.name] && form.errors[field.name];
    const inputNumberRef = useRef<HTMLInputElement>(null);
    const [selectedWeight, setSelectedWeight] =
        useState<InterfaceSelectedWeight>(DEFAULT_WEIGHT);

    const startInputValue = useMemo(() => {
        if (!field.value) {
            return '0';
        }

        const adapter = adapterWeight(field.value);

        return adapter.value.toString();
    }, [field.value]);

    const [inputValue, setInputValue] = useState<string>(startInputValue);

    const menuItemButtons = ListWeightTypes.map(
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

                    setSelectedWeight((prev) => ({
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
        const valueSTR = event.target.value.trim();
        const valueNormalized = valueSTR.replace(',', '.');

        const value = parseFloat(valueNormalized);

        setInputValue(valueSTR);

        if (isNumber(value)) {
            const tempValue = {
                ...selectedWeight,
                value: value
            };

            form.setFieldValue(field.name, tempValue);
        } else {
            console.log('valueSTR', valueSTR);
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
