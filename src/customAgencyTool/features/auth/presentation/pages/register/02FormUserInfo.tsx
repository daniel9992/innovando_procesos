import { FormikInputText } from '@src/customAgencyTool/components/formik';
import { FormikInputDate } from '@src/customAgencyTool/components/formik/01formikInput/formikInputDate';
import { MyFlex, MyHeading } from '@src/customAgencyTool/components/ui';
import { MyFileImgUploadStandalone } from '@src/customAgencyTool/components/ui/myFileImgUploadStandalone';
import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import DOMPurify from 'dompurify';
import {
    Field,
    Form,
    Formik,
    type FormikHelpers,
    type FormikProps
} from 'formik';
import { useEffect, useState, type FC } from 'react';
import * as Yup from 'yup';
import RefreshFormik from '../../components/refreshFormik';

export interface InterfaceUserData {
    name: string;
    phone: string;
    img: File | undefined;
    birthday: Date;
}

interface InterfaceFormUserInfo {
    formRef?: React.RefObject<FormikProps<InterfaceUserData>>;
    values?: InterfaceUserData;
    handledOnSubmit?: (
        values: InterfaceUserData,
        acctions: FormikHelpers<InterfaceUserData>
    ) => void;
}

const FormUserInfo: FC<InterfaceFormUserInfo> = ({
    formRef,
    values,
    handledOnSubmit = () => {}
}) => {
    const initValues: InterfaceUserData = {
        name: '',
        phone: '',
        img: undefined,
        birthday: GetToday()
    };

    const [isRefresh, setIsRefresh] = useState(false);

    const [startInitValues, setStartInitValues] =
        useState<InterfaceUserData>(initValues);

    useEffect(() => {
        if (values) {
            setIsRefresh(true);
            setStartInitValues(values);
            setTimeout(() => {
                setIsRefresh(false);
            }, 100);
        }
    }, [values]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Debe ingresar el nombre'),
        phone: Yup.string().required('Debe ingresar el telefono'),
        photoURL: Yup.string()
    });

    const onSubmit = (
        values: InterfaceUserData,
        acctions: FormikHelpers<InterfaceUserData>
    ) => {
        const copyData: InterfaceUserData = {
            name: DOMPurify.sanitize(values.name),
            phone: DOMPurify.sanitize(values.phone),
            img: values.img,
            birthday: values.birthday
        };

        handledOnSubmit(copyData, acctions);
    };

    if (isRefresh) {
        return <RefreshFormik />;
    }

    return (
        <div>
            <MyHeading
                w="100%"
                fontSize="2rem"
                textAlign={'center'}
                fontWeight="normal"
                mb="2%"
                lineHeight="1.5"
            >
                Información de Usuario
            </MyHeading>

            <Formik
                innerRef={formRef}
                initialValues={startInitValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {(props: FormikProps<InterfaceUserData>) => (
                    <Form>
                        <MyFlex
                            direction={'column'}
                            gap={5}
                            justifyContent={'center'}
                            mx={'auto'}
                        >
                            <MyFileImgUploadStandalone
                                type={'image'}
                                height={'15rem'}
                                title={'Foto de perfil'}
                                acceptedFileTypes={[
                                    'image/png',
                                    'image/jpeg',
                                    'image/jpg'
                                ]}
                                onFileChange={async (event: File | null) => {
                                    props.setFieldValue('img', event);
                                }}
                            />

                            <Field
                                name="name"
                                id="name"
                                label="Nombre"
                                icon="CUSTOMER"
                                typeError={'bottom'}
                                component={FormikInputText}
                            />

                            <Field
                                name="phone"
                                id="phone"
                                label="Teléfono"
                                icon="PHONE"
                                typeError={'bottom'}
                                component={FormikInputText}
                            />

                            <Field
                                name="birthday"
                                id="birthday"
                                label="Fecha de cumpleaños"
                                icon="CALENDAR"
                                typeError={'bottom'}
                                component={FormikInputDate}
                            />
                        </MyFlex>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default FormUserInfo;
