import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import {
    GetToday,
    ShowDate,
    StringDate
} from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { type FieldProps } from 'formik';
import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type FC
} from 'react';
import { MyBox, MyInputText, MyTooltip } from '../../ui';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

interface CustomInputProps {
    label?: string;
    icon?: string;
    typeError?: 'top' | 'bottom';
    type?: 'short' | 'long';
    onChange?: (date: Date | undefined) => void;
}

export const FormikInputDate: FC<CustomInputProps & FieldProps> = ({
    label = '',
    icon,
    typeError = 'top',
    type = 'short',
    onChange = () => {},
    field,
    form,
    ...props
}) => {
    // --- Referencia y Estado para la nueva funcionalidad ---
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputType, setInputType] = useState<
        'text' | 'date' | 'datetime-local'
    >('text');

    // --- Valores Derivados (sin cambios) ---
    const isError = !!(form.touched[field.name] && form.errors[field.name]);
    const valueAsDate = field.value instanceof Date ? field.value : null;

    const { realInputType, formatForInput } = useMemo(
        () => ({
            realInputType: type === 'short' ? 'date' : 'datetime-local',
            formatForInput: type === 'short' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'
        }),
        [type]
    );

    const inputValue = valueAsDate
        ? ShowDate(valueAsDate, formatForInput, 'es')
        : '';
    const tooltipText = valueAsDate
        ? ShowDate(valueAsDate, 'dddd D [de] MMMM [del] YYYY', 'es')
        : 'Ninguna fecha seleccionada';

    // --- Efecto para cambiar el tipo de input ---
    // Cambia a 'text' si no hay valor, o al tipo de fecha si sí lo hay.
    useEffect(() => {
        setInputType(
            valueAsDate ? (realInputType as 'date' | 'datetime-local') : 'text'
        );
    }, [valueAsDate, realInputType]);

    // --- Manejadores de Eventos ---
    const handledOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const dateString = event.target.value;
        if (!dateString) {
            form.setFieldValue(field.name, null);
            return;
        }
        // const newDate = StringDate(dateString);
        // form.setFieldValue(field.name, newDate);
        // onChange(newDate);

        const dateTemp = StringDate(dateString);
        const today = GetToday();
        dateTemp.setHours(today.getHours());
        dateTemp.setMinutes(today.getMinutes());
        dateTemp.setSeconds(today.getSeconds());

        const result = StringDate(dateTemp.toISOString());

        form.setFieldValue(field.name, result);

        onChange(result);
    };

    // Manejador de clic para abrir el date picker
    const handleClick = () => {
        // Si el input es de texto (porque está vacío), lo cambiamos a tipo fecha y mostramos el picker.
        if (inputType === 'text') {
            setInputType(realInputType as 'date' | 'datetime-local');
            // Usamos un timeout para dar tiempo a React a re-renderizar el input con el nuevo tipo.
            setTimeout(() => {
                inputRef.current?.showPicker();
            }, 0);
        }
    };

    // --- Renderizado ---
    const renderInput = () => (
        <MyInputText
            ref={inputRef}
            id={field.name}
            data-testid={field.name}
            className="peer"
            // El placeholder es un espacio en blanco para que funcionen los estilos :placeholder-shown
            placeholder=" "
            // El tipo del input ahora viene del estado
            type={inputType}
            border={isError ? '1px solid #921313' : ''}
            value={inputValue}
            onChange={handledOnChange}
            onClick={handleClick}
            // Cuando el valor se borra, vuelve a ser texto y se oculta el valor anterior
            onBlur={() => {
                if (!field.value) {
                    setInputType('text');
                }
            }}
        />
    );

    const renderLabel = () => (
        <ChakraField.Label css={floatingStyles} truncate>
            {icon && <SelectedIcons iconName={icon} />}
            {label}
        </ChakraField.Label>
    );

    return (
        <ChakraField.Root gap={1} {...props}>
            <MyTooltip content={tooltipText}>
                <MyBox pos="relative" w="full" p={0}>
                    {renderInput()}
                    {renderLabel()}
                </MyBox>
            </MyTooltip>
            {/* {renderErrorMessage(typeError)} */}
            <RenderErrorMessage
                name={field.name}
                position={typeError}
                isError={isError ? true : false}
                errorMessage={form.errors[field.name] as string}
            />
        </ChakraField.Root>
    );
};

// Estilos (se ajusta _peerPlaceholderShown para usar el placeholder)
const floatingStyles = defineStyle({
    pos: 'absolute',
    bg: 'bg.muted',
    px: '0.5rem',
    borderRadius: '5px',
    top: '-3',
    insetStart: '2',
    fontWeight: 'normal',
    pointerEvents: 'none',
    transition: 'top 0.2s, font-size 0.2s, color 0.2s',
    // Cuando el placeholder (aunque sea un espacio) se muestra, la etiqueta baja.
    _peerPlaceholderShown: {
        color: 'fg.muted',
        top: '2.5',
        insetStart: '3'
    },
    _peerFocus: {
        color: 'fg',
        top: '-3',
        insetStart: '2'
    }
});

// import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
// import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';

// import {
//     GetToday,
//     ShowDate,
//     StringDate
// } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
// import { ErrorMessage, type FieldProps } from 'formik';
// import {
//     useEffect,
//     useRef,
//     useState,
//     type ChangeEvent,
//     type FC
// } from 'react';
// import { MyBox, MyFlex, MyInputText, MyText, MyTooltip } from '../../ui';

// interface CustomInputProps {
//     label?: string;
//     Icon?: string;
//     typeError?: 'top' | 'bottom';
//     type?: 'short' | 'long';
//     onChange?: (date: Date | undefined) => void;
// }

// export const FormikInputDate: FC<CustomInputProps & FieldProps> = ({
//     label = '',
//     Icon,
//     typeError = 'top',
//     type = 'short',
//     onChange = () => {},
//     field,
//     form,
//     ...props
// }) => {
//     const isError = form.touched[field.name] && form.errors[field.name];

//     // Estado local para almacenar la fecha mostrada en el input.
//     const [showDate, setShowDate] = useState<string>('');
//     const [inputType, setInputType] = useState<'date' | 'text'>('date');
//     const [selectedDate, setSelectedDate] = useState<string>('');
//     const inputRef = useRef<HTMLInputElement>(null);

//     // Efecto para actualizar showDate cuando cambia el valor del campo.
//     useEffect(() => {
//         if (field.value instanceof Date) {
//             const dateStr =
//                 type === 'short'
//                     ? //dayjs(field.value).format('YYYY-MM-DD')
//                       ShowDate(field.value, 'YYYY-MM-DD', 'es')
//                     : //dayjs(field.value).format('YYYY-MM-DDTHH:mm:ss');
//                       ShowDate(field.value, 'YYYY-MM-DDTHH:mm:ss', 'es');

//             const str = ShowDate(
//                 field.value,
//                 'dddd D [,] MMMM [del] YYYY',
//                 'es'
//             );

//             setSelectedDate(str);

//             setShowDate(dateStr as string);
//         }
//     }, [field.value, type]);

//     // Manejador para el evento onChange del input.
//     const handledOnChange = (event: ChangeEvent<HTMLInputElement>) => {
//         const date = event.target.value;

//         setShowDate(date);

//         // Verifica que date sea una cadena de texto válida antes de intentar convertirla en una fecha.
//         // if (typeof date === 'string' && date.trim() !== '') {
//         if (date) {
//             if (type === 'short') {
//                 const dateTemp = StringDate(date);
//                 const today = GetToday();
//                 dateTemp.setHours(today.getHours());
//                 dateTemp.setMinutes(today.getMinutes());
//                 dateTemp.setSeconds(today.getSeconds());
//                 const result = StringDate(dateTemp.toISOString());
//                 onChange(result);
//                 form.setFieldValue(field.name, result);
//                 return;
//             }

//             const dateTemp = StringDate(date);

//             const result = StringDate(dateTemp.toISOString());

//             const str = ShowDate(
//                 result,
//                 'dddd D [,] MMMM [del] YYYY',
//                 'es'
//             );

//             form.setFieldValue(field.name, result);

//             setSelectedDate(str);

//             onChange(result);
//         } else {
//             form.setFieldValue(field.name, '');

//             onChange(undefined);

//             setSelectedDate('');
//         }
//     };

//     const handleClick = () => {
//         // if (showDate === '') {
//         //     setInputType('text');
//         // } else {
//         //     setInputType('date');
//         // }
//         // if (inputType === 'date') {
//         //     inputRef.current?.click();
//         // }
//     };

// const renderErrorMessage = (position?: 'top' | 'bottom') => {
//     if (!isError) return null;

//     if (position === 'top') {
//         return (
//             <MyTooltip
//                 showArrow={true}
//                 portalled={true}
//                 content={form.errors[field.name] as string}
//                 positioning={{ placement: 'left' }}
//             >
//                 <MyFlex
//                     position={'absolute'}
//                     top={'-15px'}
//                     right={'-15px'}
//                     borderRadius={'10px'}
//                     bg={'red'}
//                     p={1.5}
//                     gap={2}
//                     align={'center'}
//                     color={'#ffff'}
//                     boxShadow={'0 0 0 1px #921313'}
//                 >
//                     <SelectedIcons iconName="Alert" />
//                 </MyFlex>
//             </MyTooltip>
//         );
//     }

//     return (
//         <MyFlex
//             direction={'row'}
//             gap={2}
//             align={'center'}
//             color={'#921313'}
//             bg={'rgba(255, 255, 255, 0.1)'}
//             py={0}
//         >
//             <MyFlex px={0} mx={0}>
//                 <SelectedIcons iconName="Alert" />
//             </MyFlex>
//             <ErrorMessage name={field.name}>
//                 {(msg) => (
//                     <MyText
//                         fontSize={'0.8rem'}
//                         fontWeight={'semibold'}
//                     >
//                         {msg}
//                     </MyText>
//                 )}
//             </ErrorMessage>
//         </MyFlex>
//     );
// };

//     const renderLabel = () => (
//         <ChakraField.Label css={floatingStyles}>
//             {Icon && <SelectedIcons iconName={Icon} />}
//             {label}
//         </ChakraField.Label>
//     );

//     const renderInput = () => {
//         return (
//             <MyInputText
//                 ref={inputRef}
//                 id={field.name}
//                 data-testid={field.name}
//                 key={'key-input-' + field.name}
//                 className="peer"
//                 // type={showDate ? 'date' : 'text'}
//                 type={inputType}
//                 border={isError ? '1px solid #921313' : ''}
//                 value={showDate}
//                 onChange={handledOnChange}
//                 onClick={handleClick}
//             />
//         );
//     };

//     if (typeError === 'top') {
//         return (
//             <ChakraField.Root gap={1} {...props}>
//                 <MyBox pos="relative" w="full">
//                     {renderInput()}
//                     {renderLabel()}
//                 </MyBox>

//                 {renderErrorMessage('top')}
//             </ChakraField.Root>
//         );
//     }

//     return (
//         <ChakraField.Root gap={1} {...props}>
//             <MyBox pos="relative" w="full">
//                 <MyTooltip content={selectedDate}>
//                     {renderInput()}
//                 </MyTooltip>

//                 {renderLabel()}
//             </MyBox>
//             {renderErrorMessage('bottom')}
//         </ChakraField.Root>
//     );
// };

// const floatingStyles = defineStyle({
// pos: 'absolute',
// // bg: 'bg',
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
