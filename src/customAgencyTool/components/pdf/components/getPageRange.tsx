import { Field, Form, Formik, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { FormikInputText } from '../../formik';
import { MyButton, MyFlex } from '../../ui';

export interface InterfaceRange {
    from: number;
    to: number;
}
export interface InterfaceGetPageRangeProps {
    isLoading: boolean;
    callBackSubmit: (range: { from: number; to: number }) => void;
}

const GetPageRange: React.FC<InterfaceGetPageRangeProps> = ({
    isLoading,
    callBackSubmit
}) => {
    const validationSchema = Yup.object({
        numberInput: Yup.string()
            .matches(
                /^(\d+ - \d+|\d+-\d+|\d+ a \d+|\d+a\d+)$/,
                'Debe ser "number - number" o "number a number"'
            )
            .required('Debe ser "1 - 2" o "1 a 2"')
    });

    interface Values {
        numberInput: string;
    }

    const onSubmit = (
        values: Values,
        { setSubmitting }: FormikHelpers<Values>
    ) => {
        setSubmitting(false);

        const [from, to] = values.numberInput.split(/ - |-| a |a/).map(Number);

        callBackSubmit({ from, to });
    };

    return (
        <Formik
            initialValues={{ numberInput: '' }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {() => (
                <Form>
                    <MyFlex
                        direction={'row'}
                        //gap={4}
                        align={'center'}
                        p={0}
                    >
                        <Field
                            name="numberInput"
                            className="form-control text-center me-2"
                            style={{ width: '70px' }}
                            // placeholder="# - #"
                            mask="9-9"
                            textAlign={'center'}
                            component={FormikInputText}
                        />

                        <MyButton
                            type="submit"
                            colorPalette={'blue'}
                            loading={isLoading}
                            icon={'DOCS'}
                            aria-label="Download"
                        />
                    </MyFlex>
                </Form>
            )}
        </Formik>
    );
};

export default GetPageRange;
