import ContryListJson from '@src/customAgencyTool/constants/contries.json';
import { useOutsideClick } from '@src/customAgencyTool/hook/useOutsideClick';

import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { CapitalizeFirstLetter } from '@src/customAgencyTool/utils/stringUtils/capitalizeFirstLetter';
import { getNormalizedString } from '@src/customAgencyTool/utils/stringUtils/getNormalizedString';
import type { FieldProps } from 'formik';
import {
    type ChangeEvent,
    type FC,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'; // Import useMemo
import CountryFlag from 'react-country-flag';
import { MyBox, MyButton, MyFlex, MyInputText, MyText } from '../../ui';
import { LabelIncon } from '../utils/labelIncon';

export interface InterfaceCountry {
    name: string;
    iso3166Code: string;
}

interface InterfaceParams {
    label: string;
    icon?: string;
    onChange?: (value: InterfaceCountry | null) => void;
    disabled?: boolean;
    placeholder?: string;
}

const FormikInputSelectedCountry: FC<InterfaceParams & FieldProps> = ({
    label,
    icon,
    onChange: onSelectionChangeCallback,
    disabled = false,
    placeholder = 'Escriba para buscar un país...',
    field,
    form
}) => {
    /**
     *  ? -----------------------------
     *  * Variables
     *  ? -----------------------------
     */

    const countriesMap: Map<string, InterfaceCountry> = useMemo(() => {
        try {
            // Asegurarse de que ContryListJson es un objeto/array antes de clonar
            if (typeof ContryListJson === 'object' && ContryListJson !== null) {
                const result = new Map<string, InterfaceCountry>();

                ContryListJson.forEach((country) => {
                    result.set(getNormalizedString(country.name), country);
                });

                return result;
            }
            return new Map<string, InterfaceCountry>(); // Retornar un array vacío si el JSON no es válido o está vacío
        } catch (error) {
            console.error('Error parsing countries JSON:', error);
            return new Map<string, InterfaceCountry>(); // En caso de error en el parseo
        }
    }, []); // Dependencia vacía porque ContryListJson se importa estáticamente

    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<InterfaceCountry[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCountryForUI, setSelectedCountryForUI] =
        useState<InterfaceCountry | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    //const listboxRef = useRef<HTMLDivElement>(null);

    // Sincronizar UI (bandera y texto del input) con el valor de Formik.
    // Este useEffect ahora solo se ejecutará si field.value cambia (o si 'countries' cambiara,
    // lo cual no sucederá gracias a useMemo si ContryListJson es estático).
    useEffect(() => {
        const formikCountryUnknown = field.value;

        if (typeof formikCountryUnknown === 'string') {
            if (formikCountryUnknown === '') {
                setSelectedCountryForUI(null);
                setInputValue('');
                return;
            }
            // search for country by name

            const country = countriesMap.get(
                getNormalizedString(formikCountryUnknown)
            );

            if (country) {
                setSelectedCountryForUI(country);
                // Solo actualiza inputValue si el input no está enfocado o si el valor es diferente
                // Esto ayuda a no interferir mientras el usuario escribe.
                if (
                    document.activeElement !== inputRef.current
                    // || 					inputValue !== country.name
                ) {
                    setInputValue(country.name);
                    setSelectedCountryForUI(country);
                }
            } else {
                // wrong country name
                setInputValue(formikCountryUnknown);
            }

            return;
        }

        if (formikCountryUnknown) {
            if (
                'iso3166Code' in formikCountryUnknown &&
                'name' in formikCountryUnknown
            ) {
                // is a country object
                setSelectedCountryForUI(formikCountryUnknown);
                setInputValue(formikCountryUnknown.name);
                return;
            }
        }
    }, [field.value, countriesMap]); // 'countries' ahora es una dependencia estable

    useOutsideClick({
        ref: dropdownContainerRef,
        handler: () => {
            if (isDropdownOpen) {
                setIsDropdownOpen(false);
                const formikCountry = countriesMap.get(
                    getNormalizedString(field.value)
                );
                if (formikCountry) {
                    // Si el input tiene un texto que no coincide con el país seleccionado,
                    // revertir al nombre del país seleccionado.
                    if (
                        inputValue.toLowerCase() !==
                        formikCountry.name.toLowerCase()
                    ) {
                        setInputValue(formikCountry.name);
                    }
                } else if (inputValue.trim() !== '') {
                    // Si no hay país seleccionado en Formik y el input tiene texto, limpiarlo
                    // ya que no corresponde a una selección válida.
                    setInputValue('');
                }
                setActiveIndex(-1);
            }
        }
    });

    const performSelection = useCallback(
        (country: InterfaceCountry) => {
            setInputValue(country.name); // Establece el texto del input al nombre del país seleccionado
            // setSelectedCountryForUI(country); // No es estrictamente necesario aquí, useEffect lo hará

            form.setFieldValue(field.name, country); // Actualiza Formik (esto disparará el useEffect de arriba)

            if (onSelectionChangeCallback) {
                onSelectionChangeCallback(country);
            }
            setIsDropdownOpen(false);
            setSuggestions([]);
            setActiveIndex(-1);
        },
        [form, field.name, onSelectionChangeCallback]
    ); // `countries` ya no es necesario como dependencia directa aquí si `performSelection` no la usa para filtrar.

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setInputValue(value); // Permite al usuario escribir libremente
        setActiveIndex(-1);

        if (value.trim() === '') {
            setSuggestions([]);
            setIsDropdownOpen(false);
            if (field.value !== '') {
                form.setFieldValue(field.name, ''); // Limpia Formik si el input se borra
                // setSelectedCountryForUI(null); // useEffect se encargará
                if (onSelectionChangeCallback) onSelectionChangeCallback(null);
            }
        } else {
            const filtered = Array.from(countriesMap.values()).filter(
                (country) =>
                    getNormalizedString(country.name).includes(
                        getNormalizedString(value)
                    )
            );

            setSuggestions(filtered);
            // setIsDropdownOpen(filtered.length > 0);
            setIsDropdownOpen(true);
        }
    };

    const handleSuggestionClick = (country: InterfaceCountry) => {
        performSelection(country);
    };

    const handleInputFocus = () => {
        if (inputValue.trim() !== '' && suggestions.length > 0) {
            setIsDropdownOpen(true);
        } else if (inputValue.trim() !== '') {
            const filtered = Array.from(countriesMap.values()).filter(
                (country) =>
                    getNormalizedString(country.name).includes(
                        getNormalizedString(inputValue)
                    )
            );
            if (filtered.length > 0) {
                setSuggestions(filtered);
                setIsDropdownOpen(true);
            }
        }
    };

    const handleFormikBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        form.handleBlur(e); // Para el 'touched' de Formik
        // La lógica de `useOutsideClick` usualmente maneja el cierre y la reconciliación del valor.
        // Si necesitas una acción específica inmediata en blur que `useOutsideClick` no cubre,
        // puedes agregarla aquí, pero con cuidado de no interferir.
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (isDropdownOpen && suggestions.length > 0) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setActiveIndex((prev) => (prev + 1) % suggestions.length);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setActiveIndex(
                        (prev) =>
                            (prev - 1 + suggestions.length) % suggestions.length
                    );
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (activeIndex >= 0 && activeIndex < suggestions.length) {
                        performSelection(suggestions[activeIndex]);
                    } else if (suggestions.length === 1) {
                        performSelection(suggestions[0]);
                    }
                    // Si no hay sugerencia activa pero el texto coincide exactamente con una, seleccionarla (opcional avanzado)
                    // else {
                    //    const exactMatch = suggestions.find(s => s.name.toLowerCase() === inputValue.toLowerCase());
                    //    if (exactMatch) performSelection(exactMatch);
                    // }
                    break;
                case 'Escape':
                    setIsDropdownOpen(false);
                    setActiveIndex(-1);
                    break;
                case 'Tab':
                    e.preventDefault();
                    setActiveIndex((prev) => (prev + 1) % suggestions.length);
                    break;
                default:
                    break;
            }
        } else if (e.key === 'ArrowDown' && inputValue.trim() !== '') {
            const filtered = Array.from(countriesMap.values()).filter(
                (country) =>
                    country.name
                        .toLowerCase()
                        .includes(inputValue.toLowerCase())
            );
            //     countries.filter((country) =>
            //     country.name.toLowerCase().includes(inputValue.toLowerCase())
            // );
            if (filtered.length > 0) {
                setSuggestions(filtered);
                setIsDropdownOpen(true);
                setActiveIndex(0);
                e.preventDefault();
            }
        } else if (e.key === 'Enter') {
            // Si el dropdown no está abierto y se presiona Enter:
            // Comprobar si el texto actual coincide exactamente con un país.
            // Esto permite seleccionar un país si se escribió su nombre completo y se presionó Enter.
            const exactMatch = Array.from(countriesMap.values()).find(
                (s) =>
                    getNormalizedString(s.name) ===
                    getNormalizedString(inputValue)
            );
            // countries.find(
            // (s) =>
            //     getNormalizedString(s.name) ===
            //     getNormalizedString(inputValue)
            //);
            if (exactMatch) {
                performSelection(exactMatch);
                e.preventDefault(); // Evitar submit del formulario si está dentro de uno
            }
        } else if (e.key === 'Tab') {
            const exactMatch = Array.from(countriesMap.values()).find(
                (s) =>
                    getNormalizedString(s.name) ===
                    getNormalizedString(inputValue)
            );
            if (!exactMatch) {
                setIsDropdownOpen(false);

                // crea el country luego del tab
                const newCountry = CapitalizeFirstLetter(inputValue);

                performSelection({
                    name: newCountry,
                    iso3166Code: ''
                });
            }
        }
    };

    useEffect(() => {
        if (
            activeIndex >= 0 &&
            isDropdownOpen &&
            dropdownContainerRef.current
        ) {
            const listElement =
                dropdownContainerRef.current.querySelector('ul');
            if (listElement) {
                const activeItem = listElement.children[
                    activeIndex
                ] as HTMLLIElement;
                if (activeItem) {
                    activeItem.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }
        }
    }, [activeIndex, isDropdownOpen]);

    const handledOnOpenDropdown = () => {
        setIsDropdownOpen(true);
        inputRef.current?.focus();
        setSuggestions(Array.from(countriesMap.values()));
    };

    const renderCountryFlag = useCallback(
        (country: InterfaceCountry | null) => {
            if (!country) {
                return null;
            }
            return (
                <MyBox
                    //mr={2}
                    flexShrink={0}
                >
                    {/* Contenedor para la bandera con margen */}
                    {country.iso3166Code !== '' && (
                        <CountryFlag
                            countryCode={country.iso3166Code}
                            svg
                            style={{
                                // width: '55px',
                                width: '5em',
                                height: '1.5em',
                                display: 'block'
                            }} // display: 'block' o 'flex' para evitar espacio extra debajo
                            title={`Bandera de ${country.name}`}
                        />
                    )}
                    {country.iso3166Code === '' && (
                        <SelectedIcons iconName={'FlagX'} width={'5em'} />
                    )}
                </MyBox>
            );
        },
        []
    );

    /**
     *  ? -----------------------------
     *  * Render
     *  ? -----------------------------
     */
    return (
        <MyBox
            position={'relative'}
            width="100%"
            ref={dropdownContainerRef}
            p={0}
        >
            {/* <LabelIcon label={label} Icon={Icon} name={field.name} /> */}
            <LabelIncon htmlFor={field.name} label={label} icon={icon} />

            <MyFlex
                direction={'row'}
                alignItems={'center'}
                width={'100%'}
                gap={2}
                mt={1}
                p={0}
                position={'relative'}
                bg={'gray.100'}
                border={'1px solid blue.100'}
                _dark={{
                    bg: 'gray.700',
                    border: '1px solid blue.700'
                }}
            >
                <MyFlex
                    direction={'row'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    gap={1}
                    p={0}
                    width={'100%'}
                >
                    <MyBox
                        border={'none'}
                        //   width={'50px'} bg={'red'}
                    >
                        {renderCountryFlag(selectedCountryForUI)}
                    </MyBox>
                    <MyInputText
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleFormikBlur}
                        onKeyDown={handleKeyDown}
                        onClick={handledOnOpenDropdown}
                        disabled={disabled}
                        placeholder={placeholder}
                        autoComplete="off"
                        width="100%"
                        id={field.name}
                        name={field.name} // Asegúrate que el name de Formik esté en el input
                        role="combobox"
                        aria-autocomplete="list"
                        aria-expanded={isDropdownOpen}
                        aria-controls={`${field.name}-suggestions`}
                        aria-activedescendant={
                            activeIndex >= 0
                                ? `${field.name}-suggestion-${activeIndex}`
                                : undefined
                        }
                        // border={'1px solid #9c9c9c'}
                        // borderRadius={'10px'}
                        py={1}
                        px={2}
                        // bg={'gray.100'}
                        // border={'1px solid blue.100'}
                        // _dark={{
                        // 	bg: 'gray.700',
                        // 	border: '1px solid blue.700',
                        // }}
                    />
                    <MyBox border={'none'} px={2}>
                        <MyButton
                            icon={'ArrowDown'}
                            aria-label="Abrir el selector de países"
                            colorScheme="blue"
                            size={'xs'}
                            variant="ghost"
                            onClick={handledOnOpenDropdown}
                        />
                    </MyBox>
                </MyFlex>
            </MyFlex>

            {isDropdownOpen && (
                <MyBox
                    position="absolute"
                    top="100%"
                    left={0}
                    right={0}
                    width="100%"
                    bg="gray.100"
                    borderWidth="1px"
                    borderColor="blue.100"
                    _dark={{
                        bg: 'gray.700',
                        borderColor: 'blue.700'
                    }}
                    borderRadius="md"
                    boxShadow="lg"
                    maxH="200px"
                    overflowY="auto"
                    zIndex="dropdown"
                    mt={1}
                    id={`${field.name}-suggestions`}
                    role="listbox"
                >
                    {suggestions.length > 0 ? (
                        <MyFlex
                            direction={'column'}
                            gap={1}
                            _focus={{
                                border: '1px solid #9c9c9c'
                            }}
                            p={0}
                        >
                            {suggestions.map((country, index) => (
                                <MyFlex
                                    direction={'row'}
                                    gap={3}
                                    key={country.iso3166Code}
                                    onClick={() =>
                                        handleSuggestionClick(country)
                                    }
                                    py={2}
                                    _hover={{
                                        bg: 'rgba(0, 0, 0, 0.1)',
                                        cursor: 'pointer'
                                    }}
                                    bg={
                                        activeIndex === index
                                            ? 'gray.200'
                                            : 'transparent'
                                    }
                                    id={`${field.name}-suggestion-${index}`}
                                    role="option"
                                    aria-selected={activeIndex === index}
                                    alignItems={'center'}
                                    borderRadius={'none'}
                                    _focus={{
                                        border: '1px solid #9c9c9c'
                                    }}
                                >
                                    <CountryFlag
                                        countryCode={country.iso3166Code}
                                        svg
                                        style={{
                                            width: '2em',
                                            height: '1em',
                                            display: 'block'
                                        }} // display: 'block' o 'flex' para evitar espacio extra debajo
                                        title={`Bandera de ${country.name}`}
                                    />
                                    <MyText p={0} m={0}>
                                        {country.name}
                                    </MyText>
                                </MyFlex>
                            ))}
                        </MyFlex>
                    ) : (
                        // Mensaje si no hay sugerencias
                        <MyBox p={3}>
                            <MyText color="gray.400" fontWeight={'semibold'}>
                                No se encontraron países.
                            </MyText>
                            <MyText color="gray.500" fontSize={'0.9em'}>
                                Para agregar el país, escribe el nombre completo
                                y luego oprimir Tab.
                            </MyText>
                        </MyBox>
                    )}
                </MyBox>
            )}

            {/* <ErrorMessageTag name={field.name} /> */}
        </MyBox>
    );
};

export default FormikInputSelectedCountry;
