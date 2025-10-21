import { FormikInputText } from '@src/customAgencyTool/components/formik';
import { FormikInputTextArea } from '@src/customAgencyTool/components/formik/01formikInput/formikInputTextArea';
import {
    MyButton,
    MyDrawer,
    MyFlex
} from '@src/customAgencyTool/components/ui';
import { Field, Form, Formik, type FormikProps } from 'formik';
import { type FC } from 'react';
import {
    schemaInterfaceDoc,
    type InterfaceDoc,
    type InterfaceSelectedDoc
} from '../../../../domain/modelConfigDocList';

interface Props {
    isOpen: boolean;
    handleOnClose: () => void;
    selectedRate: InterfaceSelectedDoc;

    onSubmit: (values: InterfaceDoc) => void;
    onDelete?: (index: number) => void;
}

const DocListFormik: FC<Props> = ({
    isOpen,
    handleOnClose,
    selectedRate,
    onSubmit,
    onDelete = () => {}
}) => {
    const handledOnSubmit = (values: InterfaceDoc) => {
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
                selectedRate.doc.docCode === ''
                    ? 'Crear Documento'
                    : 'Editar Documento'
            }
        >
            <Formik
                initialValues={selectedRate.doc}
                onSubmit={handledOnSubmit}
                validationSchema={schemaInterfaceDoc}
            >
                {(props: FormikProps<InterfaceDoc>) => (
                    <Form>
                        <MyFlex
                            direction={'column'}
                            gap={3}
                            justifyContent={'space-between'}
                            // height={'70vh'}
                            // overflow={'auto'}
                            my={3}
                        >
                            <Field
                                name="docCode"
                                label="Código"
                                icon="NUMBER"
                                component={FormikInputText}
                            />

                            <Field
                                name="docName"
                                label="Nombre del Documento"
                                icon="DOC"
                                height="350px"
                                component={FormikInputTextArea}
                            />
                        </MyFlex>

                        <MyFlex
                            direction={'row'}
                            justifyContent={'end'}
                            gap={3}
                            width={'100%'}
                            my={5}
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

export default DocListFormik;
