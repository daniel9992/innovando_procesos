import { Field as ChakraField, defineStyle } from '@chakra-ui/react';

import {
    adapterDoc,
    initialValue,
    type InterfaceDoc
} from '@src/customAgencyTool/features/settings/domain/modelConfigDocList';
import { useSetting } from '@src/customAgencyTool/features/settings/infrastructure/settingHook';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { FieldProps } from 'formik';
import { useEffect, useMemo, useState, type FC } from 'react';
import { type SingleValue } from 'react-select';
import LoadingWithText from '../../loading/loadingWithText';
import { MyCombobox, MyFlex } from '../../ui';
import type { Option } from '../../ui/myCombobox';
import { RenderErrorMessage } from '../utils/renderErrorMessage';

interface CustomInputProps {
    label?: string;
    icon?: string;
    typeError?: 'top' | 'bottom';
    mask?: string;
    isDisabled?: boolean;
    callBackOnChange?: (rate: InterfaceDoc) => void;
}

export const FormikInputListOfDocs: FC<CustomInputProps & FieldProps> = ({
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
        'data-id-configListOfDocs'
    );

    const listOfDocs = useMemo(() => {
        if (!generalConfig) {
            return [];
        }

        if (generalConfig.id !== 'data-id-configListOfDocs') {
            return [];
        }

        const Docs = generalConfig.listDocs;

        return Docs.map(adapterDoc);
    }, [generalConfig]);

    const selected = useMemo(() => {
        if (!field.value) {
            return undefined;
        }

        const doc = field.value as InterfaceDoc;

        if (!doc.id || doc.id === '' || doc.docCode === '') {
            return undefined;
        }

        return doc;
    }, [field]);

    const [selectedDoc, setSelectedDoc] = useState<InterfaceDoc | undefined>();

    useEffect(() => {
        if (selected) {
            setSelectedDoc(selected);
        } else {
            setSelectedDoc(undefined);
        }
    }, [selected]);

    const adapterToOption = (doc: InterfaceDoc): Option | undefined => {
        if (!doc.id || doc.id === '' || doc.docCode === '') {
            return undefined;
        }
        return {
            value: doc.id.toString(),
            label: `(${doc.docCode}) ${doc.docName}`
        };
    };

    // const fetchDocs = useCallback(async () => {
    //     const storage = getFromLocalStorage('data-id-configListOfDocs');

    //     if (storage) {
    //         const Docs = storage as InterfaceDoc[];
    //         setListOfDocs(Docs.map(adapterDoc));
    //         return;
    //     } else {
    //         const result = await getSetting('data-id-configListOfDocs');

    //         const Docs = result.listDocs as InterfaceDoc[];

    //         persistLocalStorage(
    //             'data-id-configListOfDocs',
    //             Docs.map(adapterDoc)
    //         );

    //         setListOfDocs(Docs);
    //     }
    // }, [getSetting]);

    // useEffect(() => {
    //     if (listOfDocs.length === 0) {
    //         fetchDocs();
    //     }
    // }, [listOfDocs, fetchDocs]);

    const handleDocselection = (
        newValue: SingleValue<Option>
        // actionMeta: ActionMeta<Option>
    ) => {
        if (!newValue) {
            setSelectedDoc(undefined);
            form.setFieldValue(field.name, initialValue);
            return;
        }

        if (newValue.value === '') {
            setSelectedDoc(undefined);
            form.setFieldValue(field.name, initialValue);
            return;
        }
        const rate = listOfDocs.find(
            (rate) => rate.id.toString() === newValue.value
        );

        if (rate) {
            setSelectedDoc(rate);
            callBackOnChange(rate);
            form.setFieldValue(field.name, rate);
        } else {
            // console.log('rate no encontrado');
            setSelectedDoc(undefined);
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
                options={listOfDocs
                    .map(adapterToOption)
                    .filter((option) => option !== undefined)}
                value={selectedDoc ? adapterToOption(selectedDoc) : null}
                onChange={handleDocselection}
                placeholder="Seleccione una opción..."
                isClearable
                isSearchable
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
