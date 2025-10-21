import { logosComnpany } from '@src/customAgencyTool/assets/_imgListToSelected/imgListToSelected_BL';
import { FormikInputText } from '@src/customAgencyTool/components/formik';
import { FormikInputTextArea } from '@src/customAgencyTool/components/formik/01formikInput/formikInputTextArea';
import FormikInputSelectedCountry from '@src/customAgencyTool/components/formik/05formikInputComplex/formikInputSelectedCountry';
import { FormikInputSelectImgs } from '@src/customAgencyTool/components/formik/05formikInputComplex/formikInputSelecteImgs';
import {
    MyButton,
    MyFlex,
    MyHeading
} from '@src/customAgencyTool/components/ui';
import { Field, Form, Formik, type FormikHelpers } from 'formik';
import React, { useMemo, type FC } from 'react';
import {
    initialValues,
    validationSchema,
    type InterfaceConfigGeneral
} from '../../../../domain/modelCompany';

interface Props {
    selectedCompany?: InterfaceConfigGeneral;
    onSubmit: (
        values: InterfaceConfigGeneral,
        helpers: FormikHelpers<InterfaceConfigGeneral>
    ) => void;
}
const FormikCompany: FC<Props> = ({
    //
    selectedCompany,
    onSubmit
}) => {
    const [isReresh, setIsReresh] = React.useState(false);

    const startValue = useMemo(() => {
        if (selectedCompany) {
            setIsReresh(true);

            setTimeout(() => {
                setIsReresh(false);
            }, 100);
            return selectedCompany;
        }
        return initialValues;
    }, [selectedCompany]);

    const handleSubmit = (
        values: InterfaceConfigGeneral,
        helpers: FormikHelpers<InterfaceConfigGeneral>
    ) => {
        onSubmit(values, helpers);
    };

    if (isReresh) {
        return <div>Loading...</div>;
    }

    return (
        <MyFlex direction={'column'} width={'100%'}>
            <MyHeading size={'md'}>
                Configuración General de la Empresa
            </MyHeading>
            <Formik
                initialValues={startValue}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <MyFlex direction={'column'} gap={5}>
                            <MyFlex
                                direction={{
                                    base: 'column',
                                    md: 'row'
                                }}
                                gap={5}
                                p={0}
                            >
                                {/* Logo 1 URL */}
                                <Field
                                    name="companyLogo1"
                                    label="URL del Logo Principal"
                                    icon="PHOTO"
                                    height="100px"
                                    component={FormikInputSelectImgs}
                                    items={logosComnpany}
                                />

                                {/* Logo 2 URL */}
                                <Field
                                    name="companyLogo2"
                                    label="URL del Logo Secundario (Opcional)"
                                    icon="PHOTO"
                                    height="100px"
                                    component={FormikInputSelectImgs}
                                    items={logosComnpany}
                                />
                            </MyFlex>
                            <MyFlex
                                direction={{
                                    base: 'column',
                                    md: 'row'
                                }}
                                gap={5}
                                p={0}
                            >
                                {/* ID Fiscal/Legal */}
                                <Field
                                    name="companyID"
                                    label="ID Fiscal/Legal"
                                    icon="IDCARD"
                                    component={FormikInputText}
                                />
                                {/* Nombre de la Empresa */}
                                <Field
                                    name="companyName"
                                    label="Nombre de la Empresa"
                                    icon="BUILDING"
                                    component={FormikInputText}
                                />
                            </MyFlex>
                            <MyFlex
                                direction={{
                                    base: 'column',
                                    md: 'row'
                                }}
                                gap={5}
                                p={0}
                            >
                                {/* Email de la Empresa */}
                                <Field
                                    name="companyEmail"
                                    label="Email de Contacto"
                                    icon="EMAIL"
                                    component={FormikInputText}
                                />

                                {/* Teléfono de la Empresa */}
                                <Field
                                    name="companyPhone"
                                    label="Teléfono de Contacto"
                                    icon="PHONE"
                                    component={FormikInputText}
                                />
                            </MyFlex>
                            <MyFlex
                                direction={{
                                    base: 'column',
                                    md: 'row'
                                }}
                                gap={5}
                                p={0}
                            >
                                {/* Apartado Postal (PO Box) */}
                                <Field
                                    name="companyPoBox"
                                    label="Apartado Postal (Opcional)"
                                    icon="MAP"
                                    component={FormikInputText}
                                />
                                {/* Sitio Web de la Empresa */}
                                <Field
                                    name="companyWebsite"
                                    label="Sitio Web Oficial"
                                    icon="WEBPAGE"
                                    component={FormikInputText}
                                />
                            </MyFlex>
                            {/* Slogan */}
                            <Field
                                name="slogan"
                                label="Eslogan de la Empresa"
                                icon="TEXT"
                                component={FormikInputText}
                            />
                            {/* País */}
                            <Field
                                name="companyCountry"
                                label="País de Operación"
                                icon="CONTRY"
                                component={FormikInputSelectedCountry}
                            />
                            {/* Dirección/Ubicación */}
                            <Field
                                name="companyLocation"
                                label="Dirección / Ubicación"
                                icon="LOADINGLOCATION"
                                component={FormikInputTextArea}
                            />{' '}
                            <MyFlex justify={'center'} p={0} mb={5}>
                                <MyButton
                                    loading={isSubmitting}
                                    colorPalette={'submit'}
                                    type="submit"
                                    rightIcon={'SUBMIT'}
                                >
                                    Guardar Configuración
                                </MyButton>
                            </MyFlex>
                        </MyFlex>
                    </Form>
                )}
            </Formik>
        </MyFlex>
    );
};

export default FormikCompany;
