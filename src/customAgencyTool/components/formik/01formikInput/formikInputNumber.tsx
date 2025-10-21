import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { FieldProps } from 'formik';
import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FC,
    type KeyboardEvent
} from 'react';
import { MyBox, MyInputNumber, MyInputText } from '../../ui';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

interface CustomInputProps {
    label?: string;
    icon?: string;
    type?: 'text' | 'number';
    textAlign?: 'left' | 'center' | 'right';
    typeError?: 'top' | 'bottom';
    suggestedValue?: number;
    callBackOnChange?: (value: number) => void;
    isDisabled?: boolean;
}

export const FormikInputNumber: FC<CustomInputProps & FieldProps> = ({
    label = '',
    icon,
    textAlign = 'left',
    suggestedValue,
    callBackOnChange = () => {},
    isDisabled = false,
    typeError = 'top',
    type = 'number',
    field,
    form,
    ...props
}) => {
    const isError = form.touched[field.name] && form.errors[field.name];

    // const startInitialValue = useMemo(() => {
    //     if (!field.value) {
    //         return '0';
    //     }
    //     return field.value.toString();
    // }, [field.value]);

    // const [inputValue, setInputValue] = useState<string>(startInitialValue);

    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        if (field.value) {
            setInputValue(field.value.toString());
        } else {
            setInputValue('0');
        }
        // setInputValue(field.value.toString());
    }, [field.value]);

    useEffect(() => {
        if (suggestedValue) {
            setInputValue(suggestedValue.toString());

            //
            form.setFieldValue(field.name, suggestedValue);
        }
    }, [suggestedValue]);

    const handleOnChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value.replace(',', '.'); // Normalize comma to dot for consistency

            setInputValue(value);
            // Regex to validate a decimal number  or integer
            const decimalNumberRegex = /^-?\d*\.?\d*$/;

            if (decimalNumberRegex.test(value)) {
                const newValue =
                    value === '' || value === '-' || value === '.'
                        ? ''
                        : parseFloat(value);

                if (!isNaN(newValue as number)) {
                    form.setFieldValue(
                        field.name,
                        newValue === '' ? 0 : newValue
                    );

                    callBackOnChange(newValue as number);
                } else {
                    form.setFieldValue(field.name, 0);
                }
            }
        },
        [form, field.name, callBackOnChange]
    );

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        // Ejemplos de formato de número que se acepta y se convierte a decimal
        // 455,000,123.87 -> 455000123.87
        // 455, 000,123.87 -> 455000123.87
        // 455 , 000 , 123 . 87 -> 455000123.87
        // 455 000 123.87 -> 455000123.87
        // 235035,55 -> 235035.55

        // Get the pasted text from the clipboard
        const pastedText = event.clipboardData.getData('text');

        const normalizedPastedText = pastedText
            .replace(/\s+/g, '') // Remove all spaces
            .replace(/(\d+),(?=\d{3}(?:[.,]|$))/g, '$1') // Remove commas used as thousand separators
            .replace(',', '.'); // Convert comma used as decimal separator to a period

        const parsedNumber = parseFloat(normalizedPastedText);

        if (!isNaN(parsedNumber)) {
            setInputValue(`${parsedNumber}`);
            event.preventDefault();
            form.setFieldValue(field.name, parsedNumber);
            callBackOnChange(parsedNumber as number);
        }
    };

    const handleOnValueChange = (returnChage: unknown) => {
        const { value, valueAsNumber } = returnChage as {
            value: string;
            valueAsNumber: number;
        };

        if (valueAsNumber !== undefined) {
            form.setFieldValue(field.name, valueAsNumber);
            callBackOnChange(valueAsNumber);
        }

        if (value !== undefined) {
            setInputValue(value);
        }
    };

    /**
     * Un manejador de evento onKeyDown que solo permite la entrada de números y un único punto decimal.
     * También permite teclas de control y navegación para una mejor usabilidad.
     *
     * @param event El evento de teclado de React.
     */
    const onKeyDownJustNumbers = (event: KeyboardEvent<HTMLInputElement>) => {
        const { key, currentTarget } = event;
        const { value } = currentTarget;

        // 1. Permite teclas de control y navegación esenciales
        // (Backspace, Delete, Tab, Escape, Enter, flechas, etc.)
        // También permite modificadores como Ctrl/Cmd para acciones como copiar/pegar/seleccionar todo.
        if (
            [
                'Backspace',
                'Delete',
                'Tab',
                'Escape',
                'Enter',
                'ArrowLeft',
                'ArrowRight',
                'Home',
                'End'
            ].includes(key) ||
            event.metaKey || // Cmd en Mac
            event.ctrlKey // Ctrl en Windows
        ) {
            return; // No hagas nada, deja que la tecla funcione.
        }

        // 2. Maneja el caso del punto decimal para permitir solo uno.
        if (key === '.' && !value.includes('.')) {
            return; // Permite el primer punto.
        }

        // 3. Comprueba si la tecla presionada NO es un número.
        const isNumber = /^[0-9]$/.test(key);
        if (!isNumber) {
            // 4. Si no es una de las teclas permitidas ni un número, previene la acción.
            event.preventDefault();
        }
    };

    const renderLabel = () => (
        <ChakraField.Label css={floatingStyles} truncate>
            {icon && <SelectedIcons iconName={icon} />}
            {label}
        </ChakraField.Label>
    );

    return (
        <ChakraField.Root gap={1} {...props}>
            <MyBox pos="relative" w="full" p={0} m={0}>
                {type === 'number' ? (
                    <MyInputNumber
                        id={field.name}
                        data-testid={field.name}
                        key={'key-input-' + field.name}
                        border={isError ? '1px solid #921313' : ''}
                        value={inputValue}
                        isDisabled={isDisabled}
                        textAlign={textAlign}
                        onChange={handleOnChange}
                        onPaste={handlePaste}
                        onValueChange={handleOnValueChange}
                    />
                ) : (
                    <MyInputText
                        id={field.name}
                        data-testid={field.name}
                        key={'key-input-' + field.name}
                        border={isError ? '1px solid #921313' : ''}
                        value={inputValue}
                        isDisabled={isDisabled}
                        textAlign={textAlign}
                        onChange={handleOnChange}
                        onPaste={handlePaste}
                        onChangeCapture={handleOnValueChange}
                        onKeyDown={onKeyDownJustNumbers}
                    />
                )}
                {/* <MyInputNumber
                    id={field.name}
                    data-testid={field.name}
                    key={'key-input-' + field.name}
                    border={isError ? '1px solid #921313' : ''}
                    value={inputValue}
                    isDisabled={isDisabled}
                    textAlign={textAlign}
                    onChange={handleOnChange}
                    onPaste={handlePaste}
                    onValueChange={handleOnValueChange}
                /> */}
                {renderLabel()}
            </MyBox>
            <RenderErrorMessage
                name={field.name}
                position={typeError}
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
