import { FormikInputText } from '@src/customAgencyTool/components/formik';
import {
    MyButton,
    MyDialog,
    MyFlex
} from '@src/customAgencyTool/components/ui';
import { Field, Formik } from 'formik';
import { type FC, type ReactNode } from 'react';

interface IDialogToRename {
    headerDialog?: string;
    headerChild?: ReactNode;

    fileToRename?: string;

    showDialog: boolean;
    onClose: () => void;
    title?: string;
    onSubmit: (newTitle: string) => void;
}

const DialogToRename: FC<IDialogToRename> = ({
    headerDialog = 'Renombrar',
    fileToRename = 'Escribe el nuevo título',
    headerChild,
    showDialog,
    onClose,
    title,
    onSubmit
}) => {
    return (
        <MyDialog
            isOpen={showDialog}
            onClose={onClose}
            showCloseButton={false}
            header={headerDialog}
            body={
                <div>
                    <Formik
                        initialValues={{
                            title: title || ''
                        }}
                        onSubmit={(values) => {
                            onSubmit(values.title);
                        }}
                    >
                        {(props) => (
                            <MyFlex direction={'column'} gap={0}>
                                <MyFlex direction={'column'} gap={4}>
                                    <>{headerChild}</>

                                    <Field
                                        name="title"
                                        label={fileToRename}
                                        icon="EDIT"
                                        component={FormikInputText}
                                    />

                                    <MyFlex
                                        direction={'row'}
                                        justifyContent={'flex-end'}
                                        align={'center'}
                                        gap={3}
                                    >
                                        <MyButton
                                            leftIcon={'TRASH'}
                                            colorPalette={'red'}
                                            variant={'outline'}
                                            onClick={onClose}
                                        >
                                            Cancelar
                                        </MyButton>
                                        <MyButton
                                            leftIcon={'SAVE'}
                                            colorPalette={'submit'}
                                            onClick={() => {
                                                props.submitForm();
                                            }}
                                        >
                                            Editar
                                        </MyButton>
                                    </MyFlex>
                                </MyFlex>
                            </MyFlex>
                        )}
                    </Formik>
                </div>
            }
        />
    );
};

export default DialogToRename;
