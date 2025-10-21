import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { type FieldProps } from 'formik';
import { type FC } from 'react';
import { withMask } from 'use-mask-input';
import { MyBox, MyInputText } from '../../ui';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

interface CustomInputProps {
    label?: string;
    icon?: string;
    typeError?: 'top' | 'bottom';
    mask?: string;
    textAlign?: 'left' | 'center' | 'right';
    isDisabled?: boolean;
}

export const FormikInputText: FC<CustomInputProps & FieldProps> = ({
    label = '',
    icon,
    typeError = 'top',
    mask = '',
    textAlign = 'left',
    isDisabled = false,
    field,
    form,
    ...props
}) => {
    const isError = form.touched[field.name] && form.errors[field.name];

    const maskToInput = withMask(mask);

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
                    <MyInputText
                        id={field.name}
                        data-testid={field.name}
                        key={'key-input-' + field.name}
                        className="peer"
                        textAlign={textAlign}
                        placeholder={mask}
                        border={isError ? '1px solid #921313' : ''}
                        disabled={isDisabled}
                        ref={
                            mask !== ''
                                ? (input: HTMLInputElement) => {
                                      maskToInput(input);
                                  }
                                : undefined
                        }
                        {...field}
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
                <MyInputText
                    id={field.name}
                    data-testid={field.name}
                    key={'key-input-' + field.name}
                    className="peer"
                    textAlign={textAlign}
                    placeholder={mask}
                    border={isError ? '1px solid #921313' : ''}
                    disabled={isDisabled}
                    ref={
                        mask !== ''
                            ? (input: HTMLInputElement) => {
                                  maskToInput(input);
                              }
                            : undefined
                    }
                    {...field}
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
