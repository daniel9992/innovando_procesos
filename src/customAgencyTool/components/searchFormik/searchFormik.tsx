import { Field, Formik, type FormikHelpers, type FormikProps } from 'formik';
import { type FC, useEffect, useState } from 'react';
import * as Yup from 'yup';

import { FormikInputText } from '../formik';
import { MyButton, MyFlex } from '../ui';

interface SearchFormValues {
    search: string;
}

interface SearchFormikProps {
    placeholder?: string;
    onClear?: () => void;
    onChange?: (value: string) => void;
    value?: string;
}
const SearchFormik: FC<SearchFormikProps> = ({
    placeholder = 'Buscar',
    onClear = () => {},
    onChange = () => {},
    value
}) => {
    const [initValue, setInitValue] = useState<SearchFormValues>({
        search: ''
    });

    const validateSchema = Yup.object().shape({
        search: Yup.string()
            .min(3, 'Mínimo 3 caracteres')
            .max(100, 'Máximo 100 caracteres')
            .required('Campo requerido')
    });

    useEffect(() => {
        if (value) {
            setInitValue({
                search: value
            });
        }
    }, [value]);

    const handleSubmit = async (
        values: SearchFormValues,
        { setSubmitting, resetForm }: FormikHelpers<SearchFormValues>
    ) => {
        onChange(values.search.trim());

        resetForm({ values });

        setSubmitting(false);
    };

    return (
        <Formik
            initialValues={initValue}
            onSubmit={handleSubmit}
            validationSchema={validateSchema}
            enableReinitialize
        >
            {(props: FormikProps<SearchFormValues>) => (
                <MyFlex
                    direction={'row'}
                    gap={2}
                    align={'center'}
                    p={0}
                    m={0}
                    w={'100%'}
                    maxW={'400px'}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            props.handleSubmit();
                        }
                    }}
                >
                    <Field
                        name="search"
                        label={placeholder}
                        icon={'SEARCH'}
                        component={FormikInputText}
                    />

                    <MyButton
                        aria-label="Clear"
                        icon={'TRASH'}
                        colorPalette={'red'}
                        size="xs"
                        display={
                            props.values.search.length > 0 ? 'flex' : 'none'
                            //props.errors.search ? 'flex' : 'none'
                        }
                        onClick={() => {
                            props.resetForm({ values: { search: '' } });
                            onClear();
                        }}
                    />

                    <input
                        //type="submit"
                        style={{
                            display: 'none',
                            margin: '0px',
                            padding: '0px'
                        }}
                        disabled={props.isSubmitting}
                    />
                </MyFlex>
            )}
            {/* 
                React Hydration Error
            {(props: FormikProps<SearchFormValues>) => (
                <Form>
                    <MyFlex
                        direction={'row'}
                        gap={4}
                        align={'center'}
                        p={0}
                        m={0}
                        w={'100%'}
                    >
                        <Field
                            name="search"
                            label={placeholder}
                            icon={'SEARCH'}
                            component={FormikInputText}
                        />

                        <MyButton
                            aria-label="Clear"
                            icon={'TRASH'}
                            colorPalette={'red'}
                            size="xs"
                            display={props.errors.search ? 'flex' : 'none'}
                            onClick={() => {
                                props.resetForm({ values: { search: '' } });
                                onClear();
                            }}
                        />
                    </MyFlex>

                    <input
                        type="submit"
                        style={{
                            display: 'none',
                            margin: '0px',
                            padding: '0px'
                        }}
                        disabled={props.isSubmitting}
                    />
                </Form>
            )} */}
        </Formik>
    );
};

export default SearchFormik;
