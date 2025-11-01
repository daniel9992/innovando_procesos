import { FormikInputTextArea } from '@src/customAgencyTool/components/formik';
import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import {
    MyButton,
    MyDialog,
    MyDragAndDropZone,
    MyFlex,
    MyText,
    MyUploadFile
} from '@src/customAgencyTool/components/ui';
import { useNotificationAdapter } from '@src/customAgencyTool/context/toastAppNotification/useNotificationAdapter';
import type { IPrompt } from '@src/customAgencyTool/features/iAChat/domain/chatConfig.model';

import ShowAttachedDocs from '@src/customAgencyTool/components/showAttachedDocs/showAttachedDocs';
import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import { GetRamdom } from '@src/customAgencyTool/utils/stringUtils/getRamdom';
import type { FileDataPart, InlineDataPart } from 'firebase/ai';
import {
    Field,
    Form,
    Formik,
    type FormikHelpers,
    type FormikProps
} from 'formik';
import { useCallback, useMemo, useRef, useState, type FC } from 'react';
import { useHotkeys } from 'reakeys';
import { allowedMIMETypes, isValidateFile } from '../../../utils/fileToBase64';
import SelectedSavePromptDrawer from './selectedSavePromptDrawer';
import ShowIconByMINEType from './showIconByMINEType';

interface ISelectedFile {
    showDialog: boolean;
    file?: File;
}
const initialStateSelectedFile: ISelectedFile = {
    showDialog: false
};
interface IManagePrompt {
    showDrawer: boolean;
    selectedPrompt?: IPrompt;
}
const initialStateManagePrompt: IManagePrompt = {
    showDrawer: false
};
export interface IMyChat {
    message: string;
    files: File[];
    fileDataParts?: FileDataPart[];
    inlineParts?: InlineDataPart[];
    isReplyConversation?: boolean;
}

interface MyInputChatProps {
    isLoading?: boolean;
    onSubmit?: (values: IMyChat, formikHelpers: FormikHelpers<IMyChat>) => void;
    disabled?: boolean;
}

const MyChatInput: FC<MyInputChatProps> = ({
    isLoading = false,
    onSubmit = () => {},
    disabled = false
}) => {
    const formRef = useRef<FormikProps<IMyChat>>(null);

    const { sendNotification } = useNotificationAdapter();

    const [mangePrompt, setIsMangePrompt] = useState<IManagePrompt>(
        initialStateManagePrompt
    );

    const [files, setFiles] = useState<File[]>([]);

    const [showSelectedFiles, setShowSelectedFiles] = useState<ISelectedFile>(
        initialStateSelectedFile
    );

    const showFiles = useMemo(() => {
        return files.map((file, index) => (
            <MyFlex
                key={`key-file-${index}`}
                direction={'row'}
                gap={2}
                p={0}
                ps={2}
                align={'center'}
                bg={'bg.muted'}
            >
                <ShowIconByMINEType mineType={file.type} size={'0.8rem'} />
                <MyText
                    fontSize={'0.8rem'}
                    color={'gray'}
                    cursor={'pointer'}
                    onClick={() => {
                        setShowSelectedFiles({
                            showDialog: true,
                            file: file
                        });
                    }}
                >
                    {file.name}
                </MyText>
                <MyButton
                    variant={'plain'}
                    leftIcon="CLOSE"
                    colorPalette={'red'}
                    size={'xs'}
                    onClick={() => {
                        setFiles((prev) => {
                            const newList = [...prev];
                            newList.splice(index, 1);
                            return newList;
                        });
                    }}
                />
            </MyFlex>
        ));
    }, [files]);

    useHotkeys([
        {
            name: 'Sumit conversation',
            keys: 'shift+enter',
            callback: (event) => {
                if (!event) {
                    return;
                }
                event.preventDefault();
                console.log('Sumit conversation');
                formRef.current?.submitForm();
            }
        }
    ]);

    const initialState: IMyChat = {
        message: '',
        files: []
    };

    const handleOnSubmit = (
        values: IMyChat,
        formikHelpers: FormikHelpers<IMyChat>
    ) => {
        const copyValues = { ...values };

        copyValues.files = files;

        // reset the state of the form
        setFiles([]);
        formikHelpers.resetForm();

        onSubmit(copyValues, formikHelpers);
    };

    const handleOnAddFiles = useCallback(
        async (files: File[]) => {
            if (files.length > 10) {
                sendNotification({
                    title: 'Cantidad de archivos excedido',
                    message: 'El número máximo de archivos es de 10',
                    status: 'error',
                    position: 'top-right',
                    duration: 10000
                });

                return;
            }

            const validFiles = files.filter((file) => {
                const result = isValidateFile(file);

                if (!result.isValid) {
                    sendNotification({
                        title: 'Error al subir archivo: ' + file.name,
                        message: result.message,
                        status: 'error',
                        position: 'top-right',
                        duration: 10000
                    });
                }
                return result.isValid;
            });

            setFiles((prev) => [...prev, ...validFiles]);
        },
        [sendNotification]
    );

    const handleOnDrop = useCallback(
        async (droppedFiles: FileList) => {
            const tempFiles = Array.from(droppedFiles);

            handleOnAddFiles(tempFiles);
        },
        [handleOnAddFiles]
    );

    return (
        <div style={{ width: '100%' }}>
            <Formik
                ref={formRef}
                initialValues={initialState}
                onSubmit={handleOnSubmit}
            >
                {(props) => (
                    <Form>
                        <MyDragAndDropZone onDrop={handleOnDrop}>
                            <MyFlex
                                direction={'column'}
                                gap={0}
                                p={0}
                                w={'100%'}
                                flex={1}
                            >
                                <MyFlex
                                    direction={'row'}
                                    flexWrap={'wrap'}
                                    gap={2}
                                    p={0}
                                    mb={4}
                                >
                                    {showFiles}
                                </MyFlex>

                                <Field
                                    name="message"
                                    label="Escribe tu mensaje"
                                    icon="Comment"
                                    isDisabled={disabled}
                                    component={FormikInputTextArea}
                                />

                                <MyFlex
                                    direction={'row'}
                                    flexWrap={'wrap'}
                                    justifyContent={'center'}
                                    align={'center'}
                                    p={0}
                                    my={2}
                                >
                                    <MyFlex
                                        gap={2}
                                        justifyContent={'justify-content'}
                                        p={0}
                                    >
                                        <MyUploadFile
                                            accept={Array.from(
                                                allowedMIMETypes
                                            ).map((item) => item.extension)}
                                            maxFiles={10}
                                            onChange={(files) => {
                                                handleOnAddFiles(files);
                                            }}
                                            disabled={disabled}
                                        />

                                        <MyButton
                                            leftIcon={'TextSearch'}
                                            variant={'outline'}
                                            isDisabled={disabled}
                                            onClick={() => {
                                                const temp: IManagePrompt = {
                                                    showDrawer: true
                                                };
                                                setIsMangePrompt(temp);
                                            }}
                                        >
                                            Seleccionar Prompt
                                        </MyButton>

                                        <MyButton
                                            leftIcon={'SAVE'}
                                            variant={'outline'}
                                            isDisabled={disabled}
                                            onClick={() => {
                                                setIsMangePrompt((prev) => {
                                                    return {
                                                        ...prev,
                                                        showRenameDialog: true,
                                                        selectedPrompt: {
                                                            id: '',
                                                            createdAt:
                                                                GetToday(),
                                                            title: props.values.message.substring(
                                                                0,
                                                                30
                                                            ),
                                                            prompt: props.values
                                                                .message
                                                        }
                                                    };
                                                });
                                            }}
                                        >
                                            Guardar Prompt
                                        </MyButton>
                                    </MyFlex>

                                    <MyFlex gap={2} p={0}>
                                        {props.isSubmitting ||
                                            (isLoading && (
                                                <>
                                                    <LoadingWithText
                                                        size={'xs'}
                                                        text={
                                                            'Generando respuesta...'
                                                        }
                                                    />
                                                </>
                                            ))}

                                        <MyButton
                                            leftIcon={
                                                props.isSubmitting
                                                    ? 'Hourglass'
                                                    : 'SEND'
                                            }
                                            colorPalette={'submit'}
                                            aria-label={'Submit'}
                                            isDisabled={disabled}
                                            onClick={() => {
                                                props.submitForm();
                                            }}
                                        >
                                            Preguntar
                                        </MyButton>
                                    </MyFlex>
                                </MyFlex>
                            </MyFlex>
                        </MyDragAndDropZone>

                        <SelectedSavePromptDrawer
                            showDrawer={mangePrompt.showDrawer}
                            suggestPrompt={mangePrompt.selectedPrompt}
                            onClose={() => {
                                setIsMangePrompt(initialStateManagePrompt);
                            }}
                            onSelectPrompt={(selectedPrompt) => {
                                props.setFieldValue(
                                    'message',
                                    selectedPrompt.prompt
                                );

                                setIsMangePrompt(initialStateManagePrompt);
                            }}
                        />
                    </Form>
                )}
            </Formik>

            <MyDialog
                isOpen={showSelectedFiles.showDialog}
                size="full"
                maxHeight={'90vh'}
                onClose={() => {
                    setShowSelectedFiles(initialStateSelectedFile);
                }}
                header={'Seleccionar Archivo'}
                body={
                    <div>
                        {!showSelectedFiles.file && (
                            <p>Seleccione un archivo para ver su contenido.</p>
                        )}
                        {showSelectedFiles.file && (
                            <ShowAttachedDocs
                                selectedItem={{
                                    id: GetRamdom(),
                                    name: showSelectedFiles.file.name || '',
                                    url: URL.createObjectURL(
                                        showSelectedFiles.file
                                    )
                                }}
                            />
                        )}
                    </div>
                }
            />
        </div>
    );
};

export default MyChatInput;
