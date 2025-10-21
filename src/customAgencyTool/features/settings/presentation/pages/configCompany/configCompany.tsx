// import {
//     useAppDispatch,
//     useAppSelector
// } from '@src/customAgencyTool/app/hooks';
// import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
// import { isEmptyObject } from '@src/customAgencyTool/utils/objects/isEmptyObj';
// import type { FormikHelpers } from 'formik';
// import { useCallback, useEffect, useMemo } from 'react';
// import {
//     type InterfaceConfigGeneral,
//     type InterfaceConfigGeneralOnSave,
//     initialValues
// } from '../../../domain/modelCompany';
// import {
//     createSetting,
//     readSetting,
//     selectSetting,
//     selectStatus,
//     updateSetting
// } from '../../../infrastructure/settingSlice';
// import FormikCompany from './components/formikCompany';

import {
    useAppDispatch,
    useAppSelector
} from '@src/customAgencyTool/app/hooks';
import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import { MyFlex } from '@src/customAgencyTool/components/ui';
import { ReduxStatus } from '@src/customAgencyTool/constants/reduxConstants';
import { isEmptyObject } from '@src/customAgencyTool/utils/objects/isEmptyObj';
import type { FormikHelpers } from 'formik';
import { useCallback, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    initialValues,
    type InterfaceConfigGeneral,
    type InterfaceConfigGeneralOnSave
} from '../../../domain/modelCompany';
import {
    createSetting,
    readSetting,
    selectSetting,
    selectStatus,
    updateSetting
} from '../../../infrastructure/settingSlice';
import FormikCompany from './components/formikCompany';

const ConfigCompany = () => {
    const idConfigCompany = 'data-id-configGeneral';

    const dispatch = useAppDispatch();

    const selectedStatus = useAppSelector(selectStatus);

    const selectedSettingStore = useAppSelector(selectSetting);

    const handledOnRead = useCallback(() => {
        dispatch(readSetting({ id: idConfigCompany }));
    }, [dispatch]);

    useEffect(() => {
        if (
            selectedSettingStore.id === '' ||
            selectedSettingStore.id !== idConfigCompany
        ) {
            handledOnRead();
        }
    }, [selectedSettingStore, handledOnRead]);

    const handledOnSubmit = (
        values: InterfaceConfigGeneral,
        helpers: FormikHelpers<InterfaceConfigGeneral>
    ) => {
        const id =
            selectedSettingStore.id === ''
                ? idConfigCompany
                : selectedSettingStore.id;

        const emcapsulateValues: InterfaceConfigGeneralOnSave = {
            id: id,
            type: 'CONFIG_GENERAL',
            ...values
        };

        if (selectedSettingStore.id === '') {
            dispatch(createSetting({ values: emcapsulateValues })).finally(
                () => {
                    helpers.setSubmitting(false);
                }
            );
        } else {
            dispatch(updateSetting({ values: emcapsulateValues })).finally(
                () => {
                    helpers.setSubmitting(false);
                }
            );
        }
    };

    const startValue = useMemo((): InterfaceConfigGeneral => {
        if (isEmptyObject(selectedSettingStore)) {
            return initialValues;
        }

        if (
            selectedSettingStore.id === '' ||
            selectedSettingStore.type !== 'CONFIG_GENERAL'
        ) {
            return initialValues;
        }

        const dataToSave = selectedSettingStore as InterfaceConfigGeneralOnSave;

        const copySettingStore = {
            ...dataToSave,
            id: undefined,
            type: undefined
        };

        delete copySettingStore.id;
        delete copySettingStore.type;

        const result: InterfaceConfigGeneral = {
            ...initialValues,
            ...copySettingStore
        };
        return result;
    }, [selectedSettingStore]);

    if (selectedStatus === ReduxStatus.LOADING) {
        return (
            <MyFlex
                justifyContent={'center'}
                align={'center'}
                h={'100vh'}
                w={'100%'}
            >
                <Helmet>
                    <title>Configuración</title>
                </Helmet>

                <LoadingWithText text={'Cargando...'} />
            </MyFlex>
        );
    }

    return (
        <>
            <Helmet>
                <title>Configuración</title>
            </Helmet>

            <FormikCompany
                selectedCompany={startValue}
                onSubmit={handledOnSubmit}
            />
        </>
    );
};

export default ConfigCompany;
