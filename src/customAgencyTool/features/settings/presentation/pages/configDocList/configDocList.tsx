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
import {
    idDocSave,
    initialValue,
    initialValueOnSave,
    type InterfaceConfigListOfDocsSave,
    type InterfaceSelectedDoc
} from '../../../domain/modelConfigDocList';
import type { InterfaceAppSetting } from '../../../domain/modelFather';
import {
    createSetting,
    readSetting,
    selectSetting,
    selectStatus,
    updateSetting
} from '../../../infrastructure/settingSlice';
import DocListFormik from './components/docListFormik';
import DownLoadDocs from './components/downloadDocs/downLoadDocs';
import { adapterDoctToReadyToUse } from './components/downloadDocs/utils';
import DynamicTableDocList from './components/dynamicTable/dynamicTableProvider';
import UpLoadDocs from './components/upLoadDocs/upLoadDocs';

const adapterDoctSaveToReadyToUse = (
    setting: InterfaceAppSetting
): InterfaceConfigListOfDocsSave => {
    const copyDoc = { ...setting };

    if ('listRate' in copyDoc) {
        if (Array.isArray(copyDoc.listRates)) {
            copyDoc.listRates = copyDoc.listRates.map(adapterDoctToReadyToUse);
        }
    }

    return copyDoc as InterfaceConfigListOfDocsSave;
};

const ConfigDocList = () => {
    const { sendNotification } = useNotificationAdapter();

    const dispatch = useAppDispatch();

    const selectedStatus = useAppSelector(selectStatus);

    const selectedSettingStore = useAppSelector(selectSetting);

    const handledOnRead = useCallback(() => {
        dispatch(readSetting({ id: idDocSave }));
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
        if (selectedSettingStore.id !== idDocSave) {
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
            selectedSettingStore.type !== 'CONFIG_LIST_OF_DOCS'
        ) {
            return initialValueOnSave;
        }

        const dataFormat = adapterDoctSaveToReadyToUse(selectedSettingStore);

        const start: InterfaceConfigListOfDocsSave = {
            ...initialValueOnSave,
            ...selectedSettingStore,
            type: 'CONFIG_LIST_OF_DOCS',
            listDocs: dataFormat.listDocs.map(adapterDoctToReadyToUse)
        };

        return start;
    }, [selectedSettingStore]);

    const [selectedDoc, setSelectedDoc] = useState<InterfaceSelectedDoc>({
        showDialog: false,
        index: -1,
        doc: initialValue
    });

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
        values: InterfaceConfigListOfDocsSave,
        helpers: FormikHelpers<InterfaceConfigListOfDocsSave>
    ) => {
        if (values.id === '') {
            const copyValues = { ...values };
            copyValues.id = idDocSave;

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
                    <title>Lista de Documentos</title>
                </Helmet>

                <LoadingWithText text={'Cargando...'} />
            </MyFlex>
        );
    }

    return (
        <>
            <Helmet>
                <title>Lista de Documentos</title>
            </Helmet>

            <Formik initialValues={startValue} onSubmit={handledOnSubmit}>
                {(props: FormikProps<InterfaceConfigListOfDocsSave>) => (
                    <Form style={{ width: '100%' }}>
                        <MyFlex
                            justifyContent={'space-between'}
                            align={'center'}
                            p={0}
                            mb={3}
                        >
                            <MyHeading size={'md'}>
                                Lista de Documentos
                            </MyHeading>

                            <MyFlex p={0}>
                                <DownLoadDocs selectedDocs={props.values} />

                                <UpLoadDocs selectedDocs={props.values} />
                            </MyFlex>
                        </MyFlex>

                        <DynamicTableDocList
                            listDocs={props.values.listDocs}
                            onClick={(item, index) => {
                                setSelectedDoc({
                                    showDialog: true,
                                    index: index,
                                    doc: item
                                });
                            }}
                        />
                        <FieldArray
                            name="listDocs"
                            render={(arrayHelpers) => (
                                <>
                                    <DocListFormik
                                        isOpen={selectedDoc.showDialog}
                                        handleOnClose={() => {
                                            setSelectedDoc({
                                                showDialog: false,
                                                index: -1,
                                                doc: initialValue
                                            });
                                        }}
                                        selectedRate={selectedDoc}
                                        onSubmit={(values) => {
                                            if (values.id === '') {
                                                arrayHelpers.unshift(values);
                                                return;
                                            }

                                            const index = selectedDoc.index;

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
                                    setSelectedDoc({
                                        showDialog: true,
                                        index: -1,
                                        doc: initialValue
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

export default ConfigDocList;
