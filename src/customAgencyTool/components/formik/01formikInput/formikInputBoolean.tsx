import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';

import { type FieldProps } from 'formik';
import { type FC } from 'react';
import { MyBox, MyButton, MyFlex, MySwitch } from '../../ui';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

interface CustomInputProps {
    label?: string;
    icon?: string;
    typeError?: 'top' | 'bottom';
    booleanType?: 'switch' | 'button';
    isDisabled?: boolean;
}

export const FormikInputBoolean: FC<CustomInputProps & FieldProps> = ({
    label = '',
    icon,
    typeError = 'top',
    booleanType = 'button',
    isDisabled = false,
    field,
    form,
    ...props
}) => {
    const isError = form.touched[field.name] && form.errors[field.name];

    const renderLabel = () => (
        <ChakraField.Label css={floatingStyles} truncate>
            {icon && <SelectedIcons iconName={icon} />}
            {label}
        </ChakraField.Label>
    );

    const renderBoolean = () => {
        if (booleanType == 'switch') {
            return (
                <MyFlex p={0} m={0} border={isError ? '1px solid #921313' : ''}>
                    <MySwitch
                        data-testid={field.name}
                        key={'key-input-' + field.name}
                        label={field.value ? 'Si' : 'No'}
                        isDisabled={isDisabled}
                        checked={field.value}
                        onCheckedChange={(check) => {
                            field.onChange(check);
                        }}
                    />
                </MyFlex>
            );
        }

        if (booleanType == 'button') {
            return (
                <MyButton
                    leftIcon={field.value ? 'Thumbsup' : 'Thumbsdown'}
                    colorPalette={field.value ? 'success' : ''}
                    variant={field.value ? 'solid' : 'outline'}
                    size={'xs'}
                    isDisabled={isDisabled}
                    onClick={() => {
                        form.setFieldValue(field.name, !field.value);
                    }}
                    width={'full'}
                ></MyButton>
            );
        }
    };

    if (typeError === 'top') {
        return (
            <ChakraField.Root gap={1} {...props}>
                <MyBox pos="relative" w="full">
                    {renderBoolean()}
                    {/* <MyInputText
                        id={field.name}
                        data-testid={field.name}
                        key={'key-input-' + field.name}
                        className="peer"
                        placeholder=""
                        border={isError ? '1px solid #921313' : ''}
                        {...field}
                    /> */}
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
                {renderBoolean()}

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
