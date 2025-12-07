import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { FieldProps } from 'formik';
import {
    useCallback,
    useEffect,
    useState,
    type ChangeEvent,
    type FC,
    type KeyboardEvent,
    type FocusEvent
} from 'react';
import { MyBox, MyInputText } from '../../ui';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

interface CustomInputProps {
    label?: string;
    icon?: string;
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
    field,
    form,
    ...props
}) => {
    const isError = form.touched[field.name] && !!form.errors[field.name];
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        const value = field.value;
        if (value !== undefined && value !== null) {
            setInputValue(value.toString());
        } else {
            setInputValue('0');
        }
    }, [field.value]);

    useEffect(() => {
        if (suggestedValue !== undefined) {
            setInputValue(suggestedValue.toString());
            form.setFieldValue(field.name, suggestedValue);
        }
    }, [suggestedValue, field.name, form]);

    const handleOnChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        value = value.replace(',', '.');
        if (/^-?\d*\.?\d*$/.test(value)) {
            setInputValue(value);
        }
    }, []);

    const handleOnBlur = useCallback(
        (event: FocusEvent<HTMLInputElement>) => {
            let value = event.target.value;
            if (value.endsWith('.')) {
                value = value.slice(0, -1);
            }

            const parsedValue =
                value === '' || value === '-' ? 0 : parseFloat(value);
            const finalValue = isNaN(parsedValue) ? 0 : parsedValue;

            form.setFieldValue(field.name, finalValue);
            callBackOnChange(finalValue);
            setInputValue(finalValue.toString());
            form.handleBlur(event);
        },
        [form, field.name, callBackOnChange]
    );

    const handlePaste = useCallback(
        (event: React.ClipboardEvent<HTMLInputElement>) => {
            const pastedText = event.clipboardData.getData('text');
            const normalizedPastedText = pastedText
                .replace(/\s+/g, '')
                .replace(/(\d+),(?=\d{3}(?:[.,]|$))/g, '$1')
                .replace(',', '.');

            const parsedNumber = parseFloat(normalizedPastedText);
            if (!isNaN(parsedNumber)) {
                setInputValue(parsedNumber.toString());
                form.setFieldValue(field.name, parsedNumber);
                callBackOnChange(parsedNumber);
            }
            event.preventDefault();
        },
        [form, field.name, callBackOnChange]
    );

    const onKeyDownJustNumbers = useCallback(
        (event: KeyboardEvent<HTMLInputElement>) => {
            const { key, currentTarget } = event;
            const { value } = currentTarget;

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
                (key === 'a' && (event.metaKey || event.ctrlKey)) ||
                (key === 'c' && (event.metaKey || event.ctrlKey)) ||
                (key === 'v' && (event.metaKey || event.ctrlKey)) ||
                (key === 'x' && (event.metaKey || event.ctrlKey))
            ) {
                return;
            }

            if (key === '.' && !value.includes('.')) {
                return;
            }

            if (key === '-' && value.length === 0) {
                return;
            }

            if (!/^[0-9]$/.test(key)) {
                event.preventDefault();
            }
        },
        []
    );

    const renderLabel = () => (
        <ChakraField.Label css={floatingStyles} truncate>
            {icon && <SelectedIcons iconName={icon} />}
            {label}
        </ChakraField.Label>
    );

    return (
        <ChakraField.Root gap={1} {...props}>
            <MyBox pos="relative" w="full" p={0} m={0}>
                <MyInputText
                    id={field.name}
                    data-testid={field.name}
                    key={'key-input-' + field.name}
                    border={isError ? '1px solid #921313' : ''}
                    value={inputValue}
                    isDisabled={isDisabled}
                    textAlign={textAlign}
                    onChange={handleOnChange}
                    onBlur={handleOnBlur}
                    onPaste={handlePaste}
                    onKeyDown={onKeyDownJustNumbers}
                />
                {renderLabel()}
            </MyBox>
            <RenderErrorMessage
                name={field.name}
                position={typeError}
                isError={isError}
                errorMessage={form.errors[field.name] as string}
            />
        </ChakraField.Root>
    );
};

const floatingStyles = defineStyle({
    pos: 'absolute',
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
