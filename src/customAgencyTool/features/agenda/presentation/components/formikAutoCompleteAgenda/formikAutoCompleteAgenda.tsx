import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { RenderErrorMessage } from '@src/customAgencyTool/components/formik/utils/renderErrorMessage';
import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import { MyBox, MyCombobox, MyFlex } from '@src/customAgencyTool/components/ui';
import type { Option } from '@src/customAgencyTool/components/ui/myCombobox';
import { useDebounce } from '@src/customAgencyTool/hook/useDebounce';
import { searchFuntionCollection } from '@src/customAgencyTool/services/searchFuntion/searchFuntionCollection';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { FieldProps } from 'formik';
import { useEffect, useMemo, useState, type FC } from 'react';
import { type InterfaceClient } from '../../../domain/agendaModel';

interface CustomInputProps {
    label?: string;
    icon?: string;
    typeError?: 'top' | 'bottom';
    placeHolder?: string;
    isDisabled?: boolean;
    onChangeClient?: (client: InterfaceClient) => void;
}

const adaptClientToOption = (client: InterfaceClient): Option => ({
    value: client.id,
    label: client.clientName
});

/**
 *  @class FormikAutoCompleteAgenda
 *  @description Custom input for autocomplete agenda
 *  @param {CustomInputProps} props - The props for the component
 *  @param {FieldProps} field - The field props
 *  @param {FormikHelpers<InterfaceClient>} form - The formik helpers
 *  @param {(client: InterfaceClient) => void} onChangeClient - The callback for the onChangeClient event
 *  @param {string} label - The label for the input
 *  @param {string} icon - The icon for the input
 *  @param {'top' | 'bottom'} typeError - The type of error for the input
 *  @param {string} placeHolder - The placeholder for the input
 *  @param {boolean} isDisabled - The disabled state for the input
 *  @returns {React.ReactElement} - The component
 */

export const FormikAutoCompleteAgenda: FC<CustomInputProps & FieldProps> = ({
    label = '',
    icon,
    typeError = 'top',
    placeHolder = '',
    isDisabled = false,

    field,
    form,
    onChangeClient,
    ...props
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [clients, setClients] = useState<InterfaceClient[]>([]);

    // Derived states
    const isError = form.touched[field.name] && form.errors[field.name];
    const options = useMemo(() => clients.map(adaptClientToOption), [clients]);

    // Show filed value
    useEffect(() => {
        if (!field.value) {
            return;
        }
        const simpleOption: Option = {
            value: field.value,
            label: field.value
        };

        setSelectedOption(simpleOption);
    }, [field.value]);

    // Search handler with debounce
    const searchClients = useDebounce(async (term: string) => {
        // tiene que se mayor a 3 caracteres
        if (searchTerm.length < 3) return;

        if (!term.trim()) {
            setClients([]);
            return;
        }

        setIsLoading(true);

        try {
            const response = await searchFuntionCollection({
                collectionName: 'clientCollection',
                searchTerms: term,
                itemsPerPage: 5,
                useSoundex: true
            });

            setClients(response.data as InterfaceClient[]);
        } catch (error) {
            console.error('Error searching clients:', error);
            setClients([]);
        } finally {
            setIsLoading(false);
        }
    }, 300);

    // Handle input change
    const handleInputChange = (inputValue: string) => {
        setSearchTerm(inputValue);
    };

    useEffect(() => {
        if (!searchTerm) return;

        searchClients(searchTerm);
    }, [searchTerm, searchClients]);

    // Handle selection change
    const handleChange = (newValue: Option | null) => {
        const value = newValue?.value || '';

        setSelectedOption(newValue);

        setSearchTerm('');

        if (newValue && onChangeClient) {
            const selectedClient = clients.find(
                (client) => client.id === value
            );
            if (selectedClient) {
                onChangeClient(selectedClient);
            }
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
            <MyBox
                //
                pos="relative"
                w="full"
                p={0}
                m={0}
            >
                <MyCombobox
                    options={options}
                    isError={!!isError}
                    value={selectedOption}
                    onChange={handleChange}
                    onInputChange={handleInputChange}
                    isLoading={isLoading}
                    isClearable
                    isSearchable
                    placeholder={placeHolder || 'Buscar cliente...'}
                    isDisabled={isDisabled}
                    noOptionsMessage={({ inputValue }) => {
                        if (isLoading) return 'Buscando...';
                        if (!inputValue) return 'Escriba para buscar clientes';
                        return 'No se encontraron clientes';
                    }}
                    loadingMessage={() => (
                        <MyFlex justify={'center'} align={'center'} p={0}>
                            <LoadingWithText text={'Cargando resultados...'} />
                        </MyFlex>
                    )}
                    filterOption={null}
                    menuPlacement="auto"
                    menuPortalTarget={document.body}
                    closeMenuOnSelect={true}
                />
                {renderLabel()}
            </MyBox>
            <RenderErrorMessage
                name={field.name}
                position={typeError}
                isError={!!isError}
                errorMessage={form.errors[field.name] as string}
            />
        </ChakraField.Root>
    );
};

// Styles
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
