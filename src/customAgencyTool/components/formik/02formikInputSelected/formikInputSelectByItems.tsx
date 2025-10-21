import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { FieldProps } from 'formik';
import type { FC } from 'react';
import { MyBox } from '../../ui';
import { MySelect, type InterfaceItem, type TypeItem } from '../../ui/mySelect';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

interface FormikInputSelectByItemsProps {
    label?: string;
    icon?: string;
    placeholder?: string;
    items: InterfaceItem[];
    isClearTrigger?: boolean;
    isMultiple?: boolean;
    showItem?: TypeItem[];
    typeError?: 'top' | 'bottom';
    isDisabled?: boolean;
    // textAlign?: 'left' | 'center' | 'right'; // el componente chakra no soporta este atributo
    onChange?: (values: string[]) => void;
}

export const FormikInputSelectByItems: FC<
    FormikInputSelectByItemsProps & FieldProps
> = ({
    label,
    icon,
    typeError = 'top',
    placeholder,
    isClearTrigger = false,
    isMultiple = false,
    showItem = ['value', 'label', 'color', 'icon', 'description'],
    onChange = () => {},

    items,
    field,
    form,
    isDisabled = false,
    ...props
}) => {
    const isError = form.touched[field.name] && form.errors[field.name];

    const handleChange = (values: string[]) => {
        onChange(values);
        // console.log('Selected values:', values);
        if (isMultiple) {
            form.setFieldValue(field.name, values);
            return;
        }
        form.setFieldValue(field.name, values[0]);
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
                <MyBox pos="relative" w="full" p={0} m={0}>
                    <MySelect
                        items={items}
                        showItem={showItem}
                        defaultValue={[field.value]}
                        isClearTrigger={isClearTrigger}
                        onChange={handleChange}
                        placeholder={placeholder}
                        disabled={isDisabled}
                        htmlFor={field.name}
                        isMultiple={isMultiple}
                        isInvalid={isError ? true : false}
                    />

                    {renderLabel()}
                </MyBox>
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
            <MyBox pos="relative" w="full" p={0} m={0}>
                <MySelect
                    items={items}
                    showItem={showItem}
                    defaultValue={[field.value]}
                    isClearTrigger={isClearTrigger}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    htmlFor={field.name}
                    isMultiple={isMultiple}
                    isInvalid={isError ? true : false}
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
