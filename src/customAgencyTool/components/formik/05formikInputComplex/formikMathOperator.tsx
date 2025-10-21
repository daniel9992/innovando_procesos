import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { toFixedNumber } from '@src/customAgencyTool/utils/numberOperator/toFixNumber';
import type { FieldProps } from 'formik';
import { memo, useEffect, useMemo } from 'react';
import { MyBox, MyInputText } from '../../ui';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

interface FormikMathOperatorProps extends FieldProps {
    label?: string;
    icon?: string;
    textAlign?: 'left' | 'center' | 'right';
    operatorValue?: number | string; // Prop unificada
    callBackOnChange?: (value: string | number) => void;
    debounceTime?: number;
}

// 래 Envuelve el componente en React.memo para evitar re-renders si las props no cambian.
/**
 *  FormikMathOperator
 *  @param label The label to show in the label
 *  @param icon Some icon to show in the label
 *  @param textAlign 'left' | 'center' | 'right'
 *  @param operatorValue The value to show in the input
 *  @param callBackOnChange Function to call when the value changes
 *  @param debounceTime Time to wait before updating the value
 */
export const FormikMathOperator: React.FC<FormikMathOperatorProps> = memo(
    ({
        label = '',
        icon,
        textAlign = 'center',
        operatorValue,
        callBackOnChange,
        debounceTime = 300,
        field,
        form,
        ...props
    }) => {
        // 래 Calcula el valor a mostrar y actualiza una sola vez
        const displayValue = useMemo(() => {
            if (typeof operatorValue === 'number') {
                if (isNaN(operatorValue)) {
                    console.warn('operatorValue debe ser un número válido');
                    return ''; // Retorna un valor por defecto
                }
                return toFixedNumber(operatorValue, 2);
            }
            return operatorValue ?? ''; // Usa el valor o un string vacío si es undefined/null
        }, [operatorValue]);

        // 래 Simplifica la lógica de error, no necesita useMemo
        const isError = form.touched[field.name] && form.errors[field.name];
        const errorMessage = form.errors[field.name] as string;

        // 래 El useEffect ahora maneja el debounce internamente y es mucho más estable
        useEffect(() => {
            // Solo ejecuta si el valor del campo es diferente al que vamos a setear
            if (field.value === displayValue) {
                return;
            }

            const timer = setTimeout(() => {
                form.setFieldValue(field.name, displayValue);
                if (callBackOnChange) {
                    callBackOnChange(displayValue);
                }
            }, debounceTime);

            // Función de limpieza para cancelar el timeout si el valor cambia de nuevo
            return () => {
                clearTimeout(timer);
            };
            // Depende del valor calculado y del tiempo de debounce. `form` y `field` son estables
            // en este contexto gracias a `React.memo` y la lógica de Formik.
        }, [
            displayValue,
            debounceTime,
            form.setFieldValue,
            field.name,
            callBackOnChange,
            field.value
        ]);

        const Label = useMemo(
            () => (
                <ChakraField.Label css={floatingStyles} truncate>
                    {icon && <SelectedIcons iconName={icon} />}
                    {label}
                </ChakraField.Label>
            ),
            [icon, label]
        );

        return (
            <ChakraField.Root gap={1} {...props}>
                <MyBox pos="relative" w="full">
                    <MyInputText
                        id={field.name}
                        data-testid={field.name}
                        className="peer"
                        placeholder=""
                        disabled={true}
                        textAlign={textAlign}
                        border={isError ? '1px solid #921313' : undefined}
                        // Asigna `displayValue` directamente para reflejar el estado correcto
                        {...field}
                        value={displayValue}
                    />
                    {Label}
                </MyBox>
                <RenderErrorMessage
                    name={field.name}
                    position="bottom"
                    isError={!!isError}
                    errorMessage={errorMessage}
                />
            </ChakraField.Root>
        );
    }
);

// Los estilos no cambian
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

// import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
// import { useDebounce } from '@src/customAgencyTool/hook/useDebounce';
// import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
// import { toFixedNumber } from '@src/customAgencyTool/utils/numberOperator/toFixNumber';
// import type { FieldProps } from 'formik';
// import { useCallback, useEffect, useMemo, useRef, type FC } from 'react';
// import { MyBox, MyInputText } from '../../ui';
// import { RenderErrorMessage } from '../utils/renderErrorMessage';

// interface FormikMathOperatorProps extends FieldProps {
//     label?: string;
//     icon?: string;
//     textAlign?: 'left' | 'center' | 'right';
//     operatorValueNumber?: number;
//     operatorValueString?: string;
//     callBackOnChange?: (value: string | number) => void;
//     debounceTime?: number;
// }

// export const FormikMathOperator: FC<FormikMathOperatorProps> = ({
//     label = '',
//     icon,
//     textAlign = 'center',
//     operatorValueNumber,
//     operatorValueString,
//     callBackOnChange,
//     debounceTime = 300,
//     field,
//     form,
//     ...props
// }) => {
//     const timerRef = useRef<NodeJS.Timeout>(null);

//     const isError = useMemo(
//         () => form.touched[field.name] && form.errors[field.name],
//         [form.touched[field.name], form.errors[field.name]]
//     );

//     const updateFieldValue = useCallback(
//         (value: number | string) => {
//             try {
//                 form.setFieldValue(field.name, value);
//                 callBackOnChange?.(value);
//             } catch (error) {
//                 console.error('Error al actualizar el valor:', error);
//             }
//         },
//         [field.name, form, callBackOnChange]
//     );

//     const debouncedUpdate = useDebounce(updateFieldValue, debounceTime);

//     useEffect(() => {

//         if (operatorValueNumber !== undefined) {
//             if (isNaN(operatorValueNumber)) {
//                 console.warn('operatorValueNumber debe ser un número válido');
//                 return;
//             }
//             const result = toFixedNumber(operatorValueNumber, 2);
//             debouncedUpdate(result);
//         }
//     }, [operatorValueNumber, debouncedUpdate]);

//     useEffect(() => {
//         if (operatorValueString !== undefined) {
//             debouncedUpdate(operatorValueString);
//         }
//     }, [operatorValueString, debouncedUpdate]);

//     // Limpieza del timer cuando el componente se desmonta
//     useEffect(() => {
//         return () => {
//             if (timerRef.current) {
//                 clearTimeout(timerRef.current);
//             }
//         };
//     }, []);

//     const Label = useMemo(
//         () => (
//             <ChakraField.Label css={floatingStyles} truncate>
//                 {icon && <SelectedIcons iconName={icon} />}
//                 {label}
//             </ChakraField.Label>
//         ),
//         [icon, label]
//     );

//     return (
//         <ChakraField.Root gap={1} {...props}>
//             <MyBox pos="relative" w="full">
//                 <MyInputText
//                     id={field.name}
//                     data-testid={field.name}
//                     key={`key-input-${field.name}`}
//                     className="peer"
//                     placeholder=""
//                     disabled={true}
//                     textAlign={textAlign}
//                     border={isError ? '1px solid #921313' : undefined}
//                     {...field}
//                 />
//                 {Label}
//             </MyBox>
//             <RenderErrorMessage
//                 name={field.name}
//                 position="bottom"
//                 isError={!!isError}
//                 errorMessage={form.errors[field.name] as string}
//             />
//         </ChakraField.Root>
//     );
// };

// const floatingStyles = defineStyle({
// pos: 'absolute',
// bg: 'bg.muted',
// px: '0.5rem',
// borderRadius: '5px',
// top: '-3',
// insetStart: '2',
// fontWeight: 'normal',
// pointerEvents: 'none',
// transition: 'position',
// _peerPlaceholderShown: {
//     color: 'fg.muted',
//     top: '2.5',
//     insetStart: '3'
// },
// _peerFocusVisible: {
//     color: 'fg',
//     top: '-3',
//     insetStart: '2'
// }
// });
