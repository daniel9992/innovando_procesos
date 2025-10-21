import {
    Combobox,
    Portal,
    useFilter,
    useListCollection
} from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { useMemo, useState, type FC } from 'react';
import { MyFlex } from './myFlex';
import { MySpinner } from './mySpinner';
import { MyText } from './myText';

export interface Option {
    value: string;
    label: string;
    disabled?: boolean;
}
// 1. Props Unificadas y Genéricas
// Usamos genéricos para que el tipo de `value` y `onChange` se adapte
// automáticamente si `isMulti` es verdadero o falso.

// 2. Componentes auxiliares fuera del render principal para evitar re-declaraciones
interface EmpyProps {
    empyMessage: string;
}
const NoOptionsMessage: FC<EmpyProps> = ({ empyMessage }) => (
    <Combobox.Empty>
        <MyText
            fontWeight="semibold"
            color="gray"
            fontSize="sm"
            textAlign="center"
        >
            {empyMessage}
        </MyText>
    </Combobox.Empty>
);

interface Props {
    icon?: string;
    label?: string;
    placeholder?: string;
    empyMessage?: string;
    selectedValue?: string[];
    options: Option[];
    isMulti?: boolean;
    isCloseOnSelect?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    onChange?: (value: string[]) => void;
}

export const MyComboBoxCh: FC<Props> = ({
    icon,
    label,
    placeholder = 'Buscar...',
    empyMessage = 'No se encontraron nada',
    selectedValue,
    isMulti = true,
    isLoading = false,
    isCloseOnSelect = false,
    isDisabled = false,
    onChange = () => {}
}) => {
    const { contains } = useFilter({ sensitivity: 'base' });

    const [value, setValue] = useState<string[]>([]);

    const { collection, filter } = useListCollection({
        initialItems: frameworks,
        filter: contains
    });

    const selectedValueStr = useMemo(() => {
        // if (!selectedValue) return placeholder;
        // value.length === 0 ? placeholder :

        if (value.length === 0) return placeholder;

        let resultStr = '';

        collection.items.forEach((item) => {
            if (value.includes(item.value)) {
                resultStr = resultStr.replace(item.value, '');
            }
        });

        if (selectedValue) {
            resultStr = selectedValue.join(', ') + resultStr;
        } else {
            resultStr = placeholder;
        }

        return resultStr;
    }, [selectedValue, placeholder, collection, value]);

    interface SelectedDetails {
        value: string[];
        itemValue: string;
    }
    const handledOnSelect = (details: SelectedDetails) => {
        onChange(details.value);
    };

    return (
        <Combobox.Root
            collection={collection}
            defaultValue={selectedValue}
            value={value}
            onValueChange={(e) => setValue(e.value)}
            onInputValueChange={(e) => filter(e.inputValue)}
            onSelect={handledOnSelect}
            multiple={isMulti}
            closeOnSelect={isCloseOnSelect}
            highlightedValue={value[0]}
            disabled={isDisabled}
        >
            {icon ||
                (label && (
                    <Combobox.Label>
                        {icon && <SelectedIcons iconName={icon} />}
                        {label && <MyText>{label}</MyText>}
                    </Combobox.Label>
                ))}
            <Combobox.Control>
                <Combobox.Input placeholder={selectedValueStr} />
                <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content>
                        <NoOptionsMessage empyMessage={empyMessage} />
                        {isLoading && (
                            <Combobox.Item
                                item={{
                                    value: 'loading',
                                    disabled: true
                                }}
                                key="loading"
                            >
                                <MyFlex
                                    direction={'row'}
                                    gap={2}
                                    align={'center'}
                                    p={0}
                                >
                                    <MySpinner />

                                    <MyText
                                        fontWeight="semibold"
                                        color="gray"
                                        fontSize="sm"
                                        textAlign="center"
                                    >
                                        Cargando...
                                    </MyText>
                                </MyFlex>
                            </Combobox.Item>
                        )}
                        {collection.items.map((item) => (
                            <Combobox.Item item={item} key={item.value}>
                                {item.label}
                                <Combobox.ItemIndicator />
                            </Combobox.Item>
                        ))}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
};

const frameworks: Option[] = [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
    { label: 'Preact', value: 'preact' },
    { label: 'Qwik', value: 'qwik' },
    { label: 'Lit', value: 'lit' },
    { label: 'Alpine.js', value: 'alpinejs' },
    { label: 'Ember', value: 'ember' },
    { label: 'Next.js', value: 'nextjs' }
];
