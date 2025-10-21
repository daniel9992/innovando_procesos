import { Field as ChakraField, defineStyle } from '@chakra-ui/react';
import { GetIVA } from '@src/customAgencyTool/constants/ivaList';
import {
    initialValue,
    type InterfaceRate
} from '@src/customAgencyTool/features/settings/domain/modelListOfRates';
import { useSetting } from '@src/customAgencyTool/features/settings/infrastructure/settingHook';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { GetRamdom } from '@src/customAgencyTool/utils/stringUtils/getRamdom';
import type { FieldProps } from 'formik';
import { useEffect, useMemo, useState, type FC } from 'react';
import { type SingleValue } from 'react-select';
import LoadingWithText from '../../loading/loadingWithText';
import { MyCombobox, MyFlex } from '../../ui';
import type { Option } from '../../ui/myCombobox';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

const fixListOfRates = (
    listOfRates: InterfaceRate[],
    rate: InterfaceRate
): InterfaceRate => {
    const copyRate = { ...rate };

    // old version only has rateName and code
    // const oldKey = [
    //     'rateName',
    //     'code',
    // ]
    const length = Object.keys(copyRate).length;
    if (length === 2) {
        const rateName = rate.rateName;

        const findRate = listOfRates.find(
            (rate) =>
                rate.rateName.toLocaleUpperCase() ===
                rateName.toLocaleUpperCase()
        );

        // validar si posee id
        if (!copyRate.id) {
            copyRate.id = findRate?.id || GetRamdom();
        }

        if (!copyRate.rateType) {
            copyRate.rateType = findRate?.rateType || GetRamdom();
        }

        if (!copyRate.code) {
            copyRate.code = findRate?.code || GetRamdom();
        }

        if (!copyRate.cabys) {
            copyRate.cabys = findRate?.cabys || GetRamdom();
        }

        if (!copyRate.iva) {
            copyRate.iva = findRate?.iva || 0.13;
        }

        if (!copyRate.measuremnetUnit) {
            copyRate.measuremnetUnit = findRate?.measuremnetUnit || GetRamdom();
        }

        if (!copyRate.declaraitionCode) {
            copyRate.declaraitionCode =
                findRate?.declaraitionCode || GetRamdom();
        }
    }

    return copyRate;
};

interface CustomInputProps {
    label?: string;
    icon?: string;
    typeError?: 'top' | 'bottom';
    mask?: string;
    isDisabled?: boolean;
    callBackOnChange?: (rate: InterfaceRate) => void;
}

export const FormikInputInterfaceRate: FC<CustomInputProps & FieldProps> = ({
    label = '',
    icon,
    callBackOnChange = () => {},
    isDisabled = false,
    typeError = 'top',
    field,
    form,
    ...props
}) => {
    const isError = form.touched[field.name] && form.errors[field.name];

    const { data: generalConfig, isLoading: isLoadingSetting } = useSetting(
        'data-id-configListOfRates'
    );

    const listOfRates = useMemo(() => {
        try {
            if (!generalConfig) {
                return [];
            }

            if (generalConfig.id !== 'data-id-configListOfRates') {
                return [];
            }

            if (!generalConfig.listOfRates) {
                return [];
            }

            const rates = generalConfig.listOfRates as InterfaceRate[];

            return rates;
        } catch (e) {
            console.log('e', e);
            return [];
        }
    }, [generalConfig]);

    const selected = useMemo(() => {
        if (!field.value) {
            return undefined;
        }

        return field.value as InterfaceRate;
    }, [field]);

    const [selectedRate, setSelectedRate] = useState<InterfaceRate | undefined>(
        undefined
    );

    useEffect(() => {
        try {
            if (selected) {
                const rate = fixListOfRates(listOfRates, selected);

                setSelectedRate(rate);
            } else {
                setSelectedRate(undefined);
            }
        } catch (e) {
            console.log('e', e);
            setSelectedRate(undefined);
        }
    }, [selected, listOfRates]);

    const adapterToOption = (rate: InterfaceRate): Option | undefined => {
        if (rate.id === '') {
            return undefined;
        }
        return {
            value: rate.id.toString(),
            label: `(${rate.code}) ${rate.rateName} - ${GetIVA(rate.iva, true)}`
        };
    };

    const handleRateSelection = (
        newValue: SingleValue<Option>
        // actionMeta: ActionMeta<Option>
    ) => {
        // console.log('newValue', newValue);

        // console.log('listOfRates', listOfRates);

        // const rate1 = listOfRates.find(
        //     (rate) => rate.id.toString() === newValue.value
        // );

        // console.log('rate1', rate1);
        // return;

        if (!newValue) {
            setSelectedRate(undefined);
            form.setFieldValue(field.name, initialValue);
            return;
        }

        if (newValue.value === '') {
            setSelectedRate(undefined);
            form.setFieldValue(field.name, initialValue);
            return;
        }
        const rate = listOfRates.find(
            (rate) => rate.id.toString() === newValue.value
        );

        if (rate) {
            setSelectedRate(rate);
            callBackOnChange(rate);
            form.setFieldValue(field.name, rate);
        } else {
            // console.log('rate no encontrado');
            setSelectedRate(undefined);
            form.setFieldValue(field.name, initialValue);
        }
    };

    if (isLoadingSetting) {
        return (
            <MyFlex bg={'bg.muted'} p={1} width={'100%'}>
                <LoadingWithText text={`Cargando: ${label}...`} />
            </MyFlex>
        );
    }

    const renderLabel = () => (
        <ChakraField.Label css={floatingStyles} truncate>
            {icon && <SelectedIcons iconName={icon} />}
            {label}
        </ChakraField.Label>
    );

    return (
        <ChakraField.Root gap={1} width={'100%'} pos="relative" {...props}>
            {renderLabel()}
            <MyCombobox
                options={listOfRates
                    .map(adapterToOption)
                    .filter((option) => option !== undefined)}
                value={selectedRate ? adapterToOption(selectedRate) : null}
                onChange={handleRateSelection}
                placeholder="Seleccione una opción..."
                isClearable
                isDisabled={isDisabled}
                isError={isError ? true : false}
            />
            <RenderErrorMessage
                name={field.name}
                position={typeError}
                isError={!!isError}
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
    top: '-4',
    zIndex: '1',
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
