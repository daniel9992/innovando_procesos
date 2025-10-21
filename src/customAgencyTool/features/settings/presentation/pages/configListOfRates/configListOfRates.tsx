import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import AddNewLine from '@src/customAgencyTool/components/customButtons/addNewLine';
import SubmitButton from '@src/customAgencyTool/components/customButtons/submetBtn';
import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import { MyFlex, MyHeading } from '@src/customAgencyTool/components/ui';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import { useNotificationAdapter } from '@src/customAgencyTool/context/toastAppNotification/useNotificationAdapter';
import { isEmptyObject } from '@src/customAgencyTool/utils/objects/isEmptyObj';
import {
    FieldArray,
    Form,
    Formik,
    type FormikHelpers,
    type FormikProps
} from 'formik';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import type { InterfaceAppSetting } from '../../../domain/modelFather';
import {
    type InterfaceRate,
    type InterfaceSelectedRate,
    type InterfaceSelectedRateOnSave,
    idRateSave,
    initialValue,
    initialValueOnSave
} from '../../../domain/modelListOfRates';
import {
    createSetting,
    readSetting,
    selectSetting,
    selectStatus,
    updateSetting
} from '../../../infrastructure/settingSlice';
import DownLoadRates from './components/downLoadRates/downLoadRates';
import DynamicTableListOfRates from './components/dynamicTable/dynamicTableProvider';
import FormikListOfRates from './components/formikListOfRates';
import UpLoadRates from './components/upLoadRate/upLoadRate';

const adapterDoctToReadyToUse = (doc: InterfaceRate): InterfaceRate => {
    const copyDoc = { ...doc };

    return copyDoc;
};

const adapterDoctSaveToReadyToUse = (
    setting: InterfaceAppSetting
): InterfaceSelectedRateOnSave => {
    const copyDoc = { ...setting };

    if ('listRate' in copyDoc) {
        if (Array.isArray(copyDoc.listRate)) {
            copyDoc.listOfRates = copyDoc.listRate.map(adapterDoctToReadyToUse);
        }
    }

    return copyDoc as InterfaceSelectedRateOnSave;
};

const ConfigListOfRates = () => {
    const { sendNotification } = useNotificationAdapter();

    const dispatch = useAppDispatch();

    const selectedStatus = useAppSelector(selectStatus);

    const selectedSettingStore = useAppSelector(selectSetting);

    const [selectedRate, setSelectedRate] = useState<InterfaceSelectedRate>({
        showDialog: false,
        index: 0,
        rate: initialValue
    });

    const handledOnRead = useCallback(() => {
        dispatch(readSetting({ id: idRateSave }));
    }, [dispatch]);

    /**
     *  ? ----------------------------------
     *  ?   State
     *  ? ----------------------------------
     */
    useEffect(() => {
        // si no hay configuración, lee la configuración
        if (!selectedSettingStore) {
            handledOnRead();
            return;
        }
        // si existe configuracion pero no es el id adecuado
        if (selectedSettingStore.id !== idRateSave) {
            handledOnRead();
            return;
        }
    }, [selectedSettingStore, handledOnRead]);

    const startValue = useMemo(() => {
        if (isEmptyObject(selectedSettingStore)) {
            return initialValueOnSave;
        }

        if (
            selectedSettingStore.id === '' ||
            selectedSettingStore.type !== 'CONFIG_LIST_OF_RATES'
        ) {
            return initialValueOnSave;
        }

        const dataFormat = adapterDoctSaveToReadyToUse(selectedSettingStore);

        const start: InterfaceSelectedRateOnSave = {
            ...initialValueOnSave,
            ...selectedSettingStore,
            type: 'CONFIG_LIST_OF_RATES',
            listOfRates: dataFormat.listOfRates.map(adapterDoctToReadyToUse)
        };

        return start;
    }, [selectedSettingStore]);

    /**
     *  ? ----------------------------------
     *  ?   On Submit
     *  ? ----------------------------------
     */
    const handledNotification = () => {
        sendNotification({
            status: 'success',
            type: 'success',
            title: 'Exito',
            message: 'Se guardaron los cambios.'
        });
    };
    const handledOnSubmit = (
        values: InterfaceSelectedRateOnSave,
        helpers: FormikHelpers<InterfaceSelectedRateOnSave>
    ) => {
        if (values.id === '') {
            const copyValues = { ...values };
            copyValues.id = idRateSave;

            dispatch(
                createSetting({
                    values: copyValues
                })
            )
                .then(() => {
                    handledNotification();
                })
                .finally(() => {
                    helpers.setSubmitting(false);
                });
        } else {
            dispatch(
                updateSetting({
                    values: values
                })
            )
                .then(() => {
                    handledNotification();
                })
                .finally(() => {
                    helpers.setSubmitting(false);
                });
        }
    };
    /**
     *  ? ----------------------------------
     *  ?   Render
     *  ? ----------------------------------
     */
    if (selectedStatus === ReduxStatus.LOADING) {
        return (
            <MyFlex
                justifyContent={'center'}
                align={'center'}
                h={'100vh'}
                w={'100%'}
            >
                <Helmet>
                    <title>Lista de Rubros</title>
                </Helmet>

                <LoadingWithText text={'Cargando...'} />
            </MyFlex>
        );
    }

    return (
        <>
            <Helmet>
                <title>Lista de Rubros</title>
            </Helmet>

            <Formik initialValues={startValue} onSubmit={handledOnSubmit}>
                {(props: FormikProps<InterfaceSelectedRateOnSave>) => (
                    <Form style={{ width: '100%' }}>
                        <MyFlex
                            justifyContent={'space-between'}
                            align={'center'}
                            p={0}
                            mb={3}
                        >
                            <MyHeading size={'md'}>Lista de Rubros</MyHeading>

                            <MyFlex p={0}>
                                <DownLoadRates selectedRate={props.values} />

                                <UpLoadRates selectedRate={props.values} />
                            </MyFlex>
                        </MyFlex>

                        <DynamicTableListOfRates
                            listOfRates={props.values.listOfRates}
                            onClick={(item, index) => {
                                setSelectedRate({
                                    showDialog: true,
                                    index: index,
                                    rate: item
                                });
                            }}
                        />

                        <FieldArray
                            name="listOfRates"
                            render={(arrayHelpers) => (
                                <>
                                    <FormikListOfRates
                                        isOpen={selectedRate.showDialog}
                                        handleOnClose={() => {
                                            setSelectedRate({
                                                showDialog: false,
                                                index: 0,
                                                rate: initialValue
                                            });
                                        }}
                                        selectedRate={selectedRate}
                                        onSubmit={(values) => {
                                            if (selectedRate.index === -1) {
                                                arrayHelpers.unshift(values);
                                                return;
                                            }

                                            const index = selectedRate.index;

                                            arrayHelpers.replace(index, values);
                                        }}
                                        onDelete={(index) => {
                                            arrayHelpers.remove(index);
                                        }}
                                    />
                                </>
                            )}
                        />

                        <MyFlex
                            p={0}
                            width={'100%'}
                            justifyContent={'center'}
                            align={'center'}
                            gap={10}
                        >
                            <AddNewLine
                                label="Agregar Nuevo Documento"
                                onClick={() => {
                                    setSelectedRate({
                                        showDialog: true,
                                        index: -1,
                                        rate: initialValue
                                    });
                                }}
                            />

                            <SubmitButton
                                label="Guardar Cambios"
                                isLoading={props.isSubmitting}
                                onClick={() => {}}
                            />
                        </MyFlex>
                    </Form>
                )}
            </Formik>
        </>
    );
};
export default ConfigListOfRates;
