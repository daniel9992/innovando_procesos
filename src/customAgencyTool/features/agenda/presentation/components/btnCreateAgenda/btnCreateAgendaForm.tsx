import { FormikInputText } from '@src/customAgencyTool/components/formik';
import { FormikInputTextArea } from '@src/customAgencyTool/components/formik/01formikInput/formikInputTextArea';
import { MyButton, MyFlex } from '@src/customAgencyTool/components/ui';
import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import { FastField, FieldArray, Formik, type FormikHelpers } from 'formik';
import { useMemo, type FC } from 'react';
import {
    initialValues,
    InterfaceClienteSchema,
    type InterfaceClient
} from '../../../domain/agendaModel';
import { ManageCustomerContact } from '../customerContactUtils/manageCustomerContact';
import SelectedPoliticalDivision from '../politicalDivision/selectedPoliticalDivision';

interface BtnCreateAgendaFormProps {
    selectedClient?: InterfaceClient;
    onSubmit: (
        client: InterfaceClient,
        formikHelpers: FormikHelpers<InterfaceClient>
    ) => void;
    onPrint?: (client: InterfaceClient) => void;
    onXLSXExport?: (client: InterfaceClient) => void;
}

export const BtnCreateAgendaForm: FC<BtnCreateAgendaFormProps> = ({
    selectedClient,
    onSubmit,
    onPrint,
    onXLSXExport
}) => {
    // No necesitas useState ya que puedes usar directamente el valor memorizado
    const initialFormValues = useMemo((): InterfaceClient => {
        return {
            ...initialValues,
            ...(selectedClient && { ...selectedClient }),
            createdAt: selectedClient?.createdAt || GetToday()
        };
    }, [selectedClient]);

    // Añadir manejo de errores
    const handleSubmit = (
        values: InterfaceClient,
        formikHelpers: FormikHelpers<InterfaceClient>
    ) => {
        onSubmit(values, formikHelpers);
    };

    return (
        <Formik
            initialValues={initialFormValues}
            onSubmit={handleSubmit}
            validationSchema={InterfaceClienteSchema}
            enableReinitialize // Permite reinicializar el formulario si cambia selectedClient
        >
            {({ isSubmitting, submitForm, values, setFieldValue }) => (
                <MyFlex
                    direction={'column'}
                    p={0}
                    // onKeyDown={(e) => {
                    //     if (e.key === 'Enter') {
                    //         e.preventDefault();
                    //         handleSubmit();
                    //     }
                    // }}
                >
                    <MyFlex direction={'column'} gap={5} p={0}>
                        <MyFlex p={0}>
                            <FastField
                                name="typeLegalIdentity"
                                label="Tipo de identificación"
                                icon="LEGALIDENTITY"
                                component={FormikInputText}
                            />
                            <FastField
                                name="legalIdentity"
                                label="Cédula Juridica"
                                icon="LEGALIDENTITY"
                                component={FormikInputText}
                            />
                        </MyFlex>

                        <MyFlex p={0}>
                            <FastField
                                name="clientName"
                                label="Nombre completo"
                                icon="CUSTOMER"
                                component={FormikInputText}
                            />
                            <FastField
                                name="economicActivityNumber"
                                label="Número de actividad económica"
                                icon="NUMBER"
                                component={FormikInputText}
                            />
                            {/* <InputEconomicActivityNumber
                                name="economicActivityNumber"
                                label="Número de actividad económica"
                                icon="NUMBER"
                            /> */}
                        </MyFlex>

                        <MyFlex p={0}>
                            <FastField
                                name="phone"
                                label="Teléfono principal"
                                icon="PHONE"
                                component={FormikInputText}
                            />
                            <FastField
                                name="emailForInvoicing"
                                label="Correo Empresarial"
                                icon="EMAIL"
                                component={FormikInputText}
                            />
                        </MyFlex>

                        <MyFlex p={0} direction={'column'}>
                            <SelectedPoliticalDivision
                                politicalDivision={values.politicalDivision}
                                clientDireccion={values.clientDireccion}
                                onChange={(
                                    politicalDivision,
                                    clientDireccion
                                ) => {
                                    setFieldValue(
                                        'politicalDivision',
                                        politicalDivision
                                    );
                                    setFieldValue(
                                        'clientDireccion',
                                        clientDireccion
                                    );
                                }}
                            />
                        </MyFlex>

                        <MyFlex p={0}>
                            <FastField
                                name="clientDireccion"
                                label="Dirección pricipal"
                                icon="DIRECTION"
                                component={FormikInputTextArea}
                            />
                        </MyFlex>
                    </MyFlex>

                    <FieldArray
                        name="customerContact"
                        render={(arrayHelpers) => (
                            <ManageCustomerContact
                                title="Lista de Contactos"
                                idBelongsToClient={values.id}
                                lines={values.customerContact}
                                {...arrayHelpers}
                            />
                        )}
                    />

                    <MyFlex
                        direction="row"
                        justifyContent={
                            values.id === '' ? 'flex-end' : 'space-between'
                        }
                        mt={3}
                    >
                        <MyFlex
                            direction="row"
                            p={0}
                            display={values.id === '' ? 'none' : 'flex'}
                        >
                            <MyButton
                                display={onPrint ? 'flex' : 'none'}
                                colorPalette="pdf"
                                leftIcon="PDF"
                                onClick={() => {
                                    onPrint?.(values);
                                }}
                            >
                                Exportar a PDF
                            </MyButton>
                            <MyButton
                                display={onXLSXExport ? 'flex' : 'none'}
                                colorPalette="xlsx"
                                leftIcon="EXCEL"
                                onClick={() => {
                                    onXLSXExport?.(values);
                                }}
                            >
                                Exportar a Excel
                            </MyButton>
                        </MyFlex>
                        <MyButton
                            colorPalette="submit"
                            leftIcon="SAVE"
                            loading={isSubmitting}
                            onClick={() => {
                                submitForm();
                            }}
                            // type="submit"
                        >
                            Aceptar
                        </MyButton>
                    </MyFlex>
                </MyFlex>
            )}
        </Formik>
    );
};

export default BtnCreateAgendaForm;
