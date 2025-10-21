import { FormikInputText } from '@src/customAgencyTool/components/formik';
import { FormikInputArrayString } from '@src/customAgencyTool/components/formik/01formikInput/FormikInputArrayString';
import {
    MyButton,
    MyDrawer,
    MyFlex,
    MyText
} from '@src/customAgencyTool/components/ui';
import {
    InterfaceCustomerContactSchema,
    type InterfaceCustomerContact
} from '@src/customAgencyTool/features/agenda/domain/agendaModel';
import { FastField, Field, Formik, type FormikHelpers } from 'formik';
import { useMemo, type FC } from 'react';
import { AdapterCustomerContact } from '../../../domain/utils/adapterCustomerContact';

interface AddInterfaceCustomerContactProps {
    selectedLine?: InterfaceCustomerContact;
    showDialog: boolean;
    onClose: () => void;
    onSubmit: (values: InterfaceCustomerContact) => void;
    isEdit: boolean;
}

const AddInterfaceCustomerContact: FC<AddInterfaceCustomerContactProps> = ({
    selectedLine,
    showDialog,
    onClose,
    onSubmit,
    isEdit
}) => {
    const initialFormValues = useMemo(() => {
        if (selectedLine) {
            return selectedLine;
        }

        const newItem = AdapterCustomerContact('');

        return newItem;
    }, [selectedLine]);

    const handledOnSubmit = (
        values: InterfaceCustomerContact,
        formikHelpers: FormikHelpers<InterfaceCustomerContact>
    ) => {
        onSubmit(values);
        setTimeout(() => {
            formikHelpers.setSubmitting(false);
            onClose();
        }, 200);
    };

    return (
        <MyDrawer
            withOutPortal={true}
            placement={'end'}
            size={'md'}
            header={isEdit ? 'Editar Contacto' : 'Agregar Contacto'}
            isOpen={showDialog}
            onOpenChange={() => {
                onClose();
            }}
        >
            <div>
                <Formik
                    initialValues={initialFormValues}
                    onSubmit={handledOnSubmit}
                    validationSchema={InterfaceCustomerContactSchema}
                    enableReinitialize // Permite reinicializar el formulario si cambia selectedClient
                >
                    {(props) => (
                        <MyFlex
                            direction={'column'}
                            gap={5}
                            p={0}
                            my={3}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    props.handleSubmit();
                                }
                            }}
                        >
                            <FastField
                                name="name"
                                label="Nombre"
                                icon="CUSTOMER"
                                component={FormikInputText}
                            />
                            <FastField
                                name="department"
                                label="Departamento o Rol"
                                icon="CUSTOMER"
                                component={FormikInputText}
                            />

                            <Field
                                name="email"
                                label="Emails"
                                icon="EMAIL"
                                placeholder="Escriba un email"
                                titleNode={
                                    <MyText
                                        color={'gray'}
                                        fontWeight={'semibold'}
                                        fontSize={'1.3rem'}
                                    >
                                        Emails
                                    </MyText>
                                }
                                maxItems={5}
                                maxHeight={'250px'}
                                component={FormikInputArrayString}
                            />

                            <Field
                                name="phone"
                                label="Teléfonos"
                                icon="PHONE"
                                placeholder="Escriba un teléfono"
                                titleNode={
                                    <MyText
                                        color={'gray'}
                                        fontWeight={'semibold'}
                                        fontSize={'1.3rem'}
                                    >
                                        Teléfonos
                                    </MyText>
                                }
                                maxItems={5}
                                maxHeight={'250px'}
                                component={FormikInputArrayString}
                            />

                            <MyFlex
                                direction={'column'}
                                gap={2}
                                alignItems={'flex-end'}
                                justifyContent={'flex-end'}
                            >
                                <MyButton
                                    colorPalette={'submit'}
                                    leftIcon={isEdit ? 'EDIT' : 'SAVE'}
                                    loading={
                                        props.isSubmitting || props.isValidating
                                    }
                                    onClick={() => {
                                        props.submitForm();
                                    }}
                                >
                                    {isEdit ? 'Editar' : 'Aceptar'}
                                </MyButton>
                            </MyFlex>
                        </MyFlex>
                    )}
                </Formik>
            </div>
        </MyDrawer>
    );
};

export default AddInterfaceCustomerContact;
