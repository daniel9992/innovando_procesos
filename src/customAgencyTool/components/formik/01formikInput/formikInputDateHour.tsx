import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { ShowDate } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import dayjs from 'dayjs';
import { ErrorMessage, type FieldProps } from 'formik';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ChangeEvent,
    type FC
} from 'react';
import { MyBox, MyFlex, MyInputText, MyText, MyTooltip } from '../../ui';
import { useColorModeValue } from '../../ui/color-mode';

// Interfaces y Hooks (sin cambios, ya estaban bien estructurados)
interface TimeOption {
    value: string;
    label: string;
}

export const TIME_REGEX = /^([0-9]{1,2}):([0-9]{1,2}) (am|pm)$/;

// Props del componente (se elimina la prop 'onChange' y 'type' por ser innecesarias)
interface FormikInputDateHourProps extends FieldProps {
    label?: string;
    Icon?: string;
    typeError?: 'top' | 'bottom';
    onChange?: (date: Date | undefined) => void;
}

export const FormikInputDateHour: FC<FormikInputDateHourProps> = ({
    label = '',
    Icon,
    typeError = 'top',
    onChange = () => {},
    field,
    form,
    ...props
}) => {
    // --- Estado y Referencias ---
    // Se elimina 'showDate', solo necesitamos controlar la visibilidad del dropdown.
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null); // Renombrado para mayor claridad
    const optionsRef = useRef<(HTMLDivElement | null)[]>([]);
    const { formatTimeDisplay } = useDateFormatter();
    const hoursList = useTimeSlots();

    // --- Valores Derivados ---
    // En lugar de usar un estado, derivamos el valor del input directamente desde Formik.
    const isError = !!(
        form.touched[field.name] && form.errors[field.name]
    );
    const valueAsDate = field.value instanceof Date ? field.value : null;
    const inputValue = valueAsDate ? formatTimeDisplay(valueAsDate) : '';

    // --- Lógica para cerrar el dropdown ---
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
            containerRef.current &&
            !containerRef.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [handleClickOutside]);

    // --- ✨ NUEVO useEffect para el scroll automático ---
    useEffect(() => {
        // Solo actuar si el desplegable está abierto y hay un valor seleccionado
        if (isOpen && valueAsDate) {
            // 1. Encontrar el índice de la hora seleccionada
            const selectedIndex = hoursList.findIndex(
                (option) => option.label === inputValue
            );

            // 2. Si se encuentra, obtener el elemento del DOM desde la ref
            if (selectedIndex !== -1) {
                const selectedElement = optionsRef.current[selectedIndex];

                // 3. Hacer scroll para que el elemento sea visible
                if (selectedElement) {
                    selectedElement.scrollIntoView({
                        block: 'nearest', // 'nearest' es eficiente, 'center' también es buena opción
                        behavior: 'smooth' // Opcional: para una animación suave
                    });
                }
            }
        }
    }, [isOpen, valueAsDate, inputValue, hoursList]);

    // --- Handlers Simplificados ---
    // Se elimina 'setShowDate' de los handlers.
    const handleTimeSelect = useCallback(
        (timeOption: TimeOption) => {
            setIsOpen(false);
            const date =
                field.value instanceof Date ? field.value : new Date();
            const newDateWithTime = dayjs(
                `${dayjs(date).format('YYYY-MM-DD')} ${timeOption.value}`
            ).toDate();
            form.setFieldValue(field.name, newDateWithTime);

            onChange(newDateWithTime);
        },
        [field.name, field.value, form, onChange]
    );

    // El handler para la entrada manual se mantiene para permitir escribir la hora.
    const handleTimeChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const timeString = event.target.value;

            if (!timeString) {
                onChange(undefined);
                return;
            }

            const match = timeString.match(TIME_REGEX);
            if (!match) return;

            const [, hours, minutes, period] = match;
            const formattedTime = `${hours.padStart(
                2,
                '0'
            )}:${minutes.padStart(2, '0')} ${period}`;

            const selectedTime = hoursList.find(
                (item) => item.label === formattedTime
            );
            if (selectedTime) {
                const currentDate = dayjs(field.value);
                const newDate = `${currentDate.format(
                    'YYYY-MM-DD'
                )} ${formattedTime}`;
                const resultDate = dayjs(newDate).toDate();

                form.setFieldValue(field.name, resultDate);
            }
        },
        [field.name, field.value, form, hoursList, onChange]
    );

    // --- Renderizado ---
    const renderLabel = () => (
        // Se aplica el estilo flotante
        <ChakraField.Label css={floatingStyles}>
            {Icon && <SelectedIcons iconName={Icon} />}
            {label}
        </ChakraField.Label>
    );

    const renderErrorMessage = (position?: 'top' | 'bottom') => {
        if (!isError) return null;

        if (position === 'top') {
            return (
                <MyTooltip
                    showArrow={true}
                    portalled={true}
                    content={form.errors[field.name] as string}
                    positioning={{ placement: 'left' }}
                >
                    <MyFlex
                        position={'absolute'}
                        top={'-15px'}
                        right={'-15px'}
                        borderRadius={'10px'}
                        bg={'red'}
                        p={1.5}
                        gap={2}
                        align={'center'}
                        color={'#ffff'}
                        boxShadow={'0 0 0 1px #921313'}
                    >
                        <SelectedIcons iconName="Alert" />
                    </MyFlex>
                </MyTooltip>
            );
        }

        return (
            <MyFlex
                direction={'row'}
                gap={2}
                align={'center'}
                color={'#921313'}
                bg={'rgba(255, 255, 255, 0.1)'}
                py={0}
            >
                <MyFlex px={0} mx={0}>
                    <SelectedIcons iconName="Alert" />
                </MyFlex>
                <ErrorMessage name={field.name}>
                    {(msg) => (
                        <MyText
                            fontSize={'0.8rem'}
                            fontWeight={'semibold'}
                        >
                            {msg}
                        </MyText>
                    )}
                </ErrorMessage>
            </MyFlex>
        );
    };

    const bgDropdown = useColorModeValue('gray.50', 'gray.800');

    return (
        <ChakraField.Root gap={1} {...props}>
            <MyBox pos="relative" w="full" ref={containerRef}>
                {/* Se añaden las props 'className' y 'placeholder' para la etiqueta flotante */}
                <MyInputText
                    id={field.name}
                    data-testid={field.name}
                    className="peer"
                    placeholder=" "
                    border={isError ? '1px solid #921313' : ''}
                    type="text"
                    value={inputValue} // El valor ahora es derivado
                    onChange={handleTimeChange}
                    onFocus={() => setIsOpen(true)}
                    autoComplete="off"
                />

                {/* El dropdown de opciones */}
                {isOpen && (
                    <MyBox
                        position="absolute"
                        top="110%"
                        left="0"
                        right="0"
                        maxH="200px"
                        overflowY="auto"
                        // bg="bg.surface" // Usar tokens de Chakra para el fondo
                        bg={bgDropdown}
                        borderRadius="md"
                        boxShadow="lg"
                        zIndex={1000}
                        border="1px"
                        borderColor="border"
                    >
                        {hoursList.map((timeOption, index) => (
                            <MyBox
                                ref={(el: HTMLDivElement | null) => {
                                    optionsRef.current[index] = el;
                                }}
                                key={index}
                                px={3}
                                py={2}
                                cursor="pointer"
                                bg={
                                    formatTimeDisplay(field.value) ===
                                    timeOption.label
                                        ? 'bg.muted'
                                        : ''
                                }
                                _hover={{ bg: 'bg.muted' }} // Usar token para hover
                                onClick={() =>
                                    handleTimeSelect(timeOption)
                                }
                            >
                                <MyText fontSize={'0.8rem'}>
                                    {timeOption.label}
                                </MyText>
                            </MyBox>
                        ))}
                    </MyBox>
                )}

                {renderLabel()}
            </MyBox>
            {renderErrorMessage(typeError)}
        </ChakraField.Root>
    );
};

// Estilos (se ajusta _peerFocusVisible a _peerFocus para mejor respuesta)
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
    _peerPlaceholderShown: {
        color: 'fg.muted',
        top: '2.5',
        insetStart: '3'
    },
    // Se activa con cualquier foco, no solo el de teclado
    _peerFocus: {
        color: 'fg',
        top: '-3',
        insetStart: '2'
    }
});

// Separar la lógica de generación de horas en un hook personalizado
const useTimeSlots = () => {
    return useMemo<TimeOption[]>(() => {
        const slots: TimeOption[] = [];
        for (let hour = 0; hour < 24; hour++) {
            const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
            const ampm = hour < 12 ? 'am' : 'pm';

            slots.push({
                value: `${hour.toString().padStart(2, '0')}:00`,
                label: `${hour12.toString().padStart(2, '0')}:00 ${ampm}`
            });
            slots.push({
                value: `${hour.toString().padStart(2, '0')}:30`,
                label: `${hour12.toString().padStart(2, '0')}:30 ${ampm}`
            });
        }
        return slots;
    }, []);
};

const useDateFormatter = () => {
    const formatTimeDisplay = useCallback((date: Date): string => {
        const hourStr = ShowDate(date, 'hh', 'es');
        const minutes = date.getMinutes();
        const hours12 = ShowDate(date, 'a', 'es');
        const minutesStr = minutes < 30 ? '00' : '30';
        return `${hourStr}:${minutesStr} ${hours12}`;
    }, []);

    return { formatTimeDisplay };
};
