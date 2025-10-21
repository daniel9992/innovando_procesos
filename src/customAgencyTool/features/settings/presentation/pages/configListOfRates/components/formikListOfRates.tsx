import { FormikInputText } from '@src/customAgencyTool/components/formik';
import { FormikInputTextArea } from '@src/customAgencyTool/components/formik/01formikInput/formikInputTextArea';
import { FormikInputSelectByItems } from '@src/customAgencyTool/components/formik/02formikInputSelected/formikInputSelectByItems';
import {
    MyButton,
    MyDrawer,
    MyFlex
} from '@src/customAgencyTool/components/ui';
import { ListIVA } from '@src/customAgencyTool/constants/ivaList';
import { Field, Form, Formik, type FormikProps } from 'formik';
import { type FC } from 'react';
import {
    schemaInterfaceRate,
    type InterfaceRate,
    type InterfaceSelectedRate
} from '../../../../domain/modelListOfRates';

interface Props {
    isOpen: boolean;
    handleOnClose: () => void;
    selectedRate: InterfaceSelectedRate;

    onSubmit: (values: InterfaceRate) => void;
    onDelete?: (index: number) => void;
}

const FormikListOfRates: FC<Props> = ({
    isOpen,
    handleOnClose,
    selectedRate,
    onSubmit,
    onDelete = () => {}
}) => {
    const handledOnSubmit = (values: InterfaceRate) => {
        onSubmit(values);
        handleOnClose();
    };
    return (
        <MyDrawer
            size={'md'}
            isOpen={isOpen}
            onOpenChange={() => {
                handleOnClose();
            }}
            header={
                selectedRate.rate.id === '' ? 'Crear Tarifa' : 'Editar Tarifa'
            }
        >
            <Formik
                initialValues={selectedRate.rate}
                onSubmit={handledOnSubmit}
                validationSchema={schemaInterfaceRate}
            >
                {(props: FormikProps<InterfaceRate>) => (
                    <Form>
                        <MyFlex
                            direction={'column'}
                            height={'75vh'}
                            overflow={'auto'}
                            pt={3}
                            p={0}
                            pe={3}
                            gap={4}
                        >
                            <Field
                                name="id"
                                label="ID"
                                icon="NUMBER"
                                typeError={'bottom'}
                                component={FormikInputText}
                            />

                            <Field
                                name="rateType"
                                label="Tipo de tarifa"
                                icon="TYPE"
                                typeError={'bottom'}
                                component={FormikInputText}
                            />

                            <Field
                                name="code"
                                label="Código"
                                icon="NUMBER"
                                typeError={'bottom'}
                                component={FormikInputText}
                            />

                            <Field
                                name="cabys"
                                label="Cabys"
                                icon="NAME"
                                typeError={'bottom'}
                                component={FormikInputText}
                            />

                            <Field
                                name="rateName"
                                label="Nombre de tarifa"
                                icon="NAME"
                                typeError={'bottom'}
                                component={FormikInputTextArea}
                            />

                            <Field
                                name="iva"
                                label="IVA"
                                icon="IVA"
                                showItem={['label']}
                                items={ListIVA}
                                typeError={'bottom'}
                                component={FormikInputSelectByItems}
                            />

                            <Field
                                name="measuremnetUnit"
                                label="Unidad de medida"
                                icon="RULER"
                                typeError={'bottom'}
                                component={FormikInputText}
                            />

                            <Field
                                name="declaraitionCode"
                                label="Código declaración"
                                icon="DOC"
                                typeError={'bottom'}
                                component={FormikInputText}
                            />
                        </MyFlex>

                        <MyFlex
                            direction={'row'}
                            justifyContent={'end'}
                            gap={3}
                            width={'100%'}
                            mt={5}
                        >
                            <MyButton
                                colorPalette={'submit'}
                                onClick={() => {
                                    props.handleSubmit();
                                }}
                                leftIcon={'SAVE'}
                            >
                                Aceptar
                            </MyButton>
                            {selectedRate.index !== -1 && (
                                <MyButton
                                    variant="outline"
                                    colorPalette={'delete'}
                                    onClick={() => {
                                        onDelete(selectedRate.index);
                                        handleOnClose();
                                    }}
                                    leftIcon={'DELETE'}
                                >
                                    Borrar
                                </MyButton>
                            )}
                        </MyFlex>
                    </Form>
                )}
            </Formik>
        </MyDrawer>
    );
};

export default FormikListOfRates;
