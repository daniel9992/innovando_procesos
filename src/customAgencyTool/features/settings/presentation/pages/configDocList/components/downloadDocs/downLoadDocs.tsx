import {
    MyButton,
    MyDialog,
    MyFileUpload,
    MyFlex,
    MyText
} from '@src/customAgencyTool/components/ui';
import { ReadExcelFile } from '@src/customAgencyTool/components/xlsx/read/readXlsx';

import { useAppDispatch } from '@src/customAgencyTool/app/hooks';
import {
    createSetting,
    updateSetting
} from '@src/customAgencyTool/features/settings/infrastructure/settingSlice';
import { useState, type FC } from 'react';
import {
    idDocSave,
    type InterfaceConfigListOfDocsSave
} from '../../../../../domain/modelConfigDocList';
import { adapterXLSXToDoc, allowColumns, validateColumns } from './utils';

interface Props {
    selectedDocs: InterfaceConfigListOfDocsSave;
}

const DownLoadDocs: FC<Props> = ({ selectedDocs }) => {
    const dispatch = useAppDispatch();

    const [showDialog, setShowDialog] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const [isLoading, setIsLoading] = useState(false);

    const handleOnChange = async (files: File[]) => {
        setErrorMessage(undefined);

        if (files.length === 0) {
            setErrorMessage('No se encontró ningún archivo');
            return;
        }

        const firstFile = files[0];

        try {
            setIsLoading(true);

            const worksheets = await ReadExcelFile(firstFile);

            // console.log('Excel data:', worksheets);
            if (worksheets.length === 0) {
                setErrorMessage('No se encontró ningún archivo');
                return;
            }

            const firstSheet = worksheets[0];
            // console.log('First sheet:', firstSheet);

            // validate columns
            const isValid = validateColumns(firstSheet.data[0]);

            if (!isValid) {
                setErrorMessage('Los nombres de las columnas no son válidos');
                return;
            }

            // remove first row (headers)
            //firstSheet.data.shift();

            const dataResult = firstSheet.data.map((item) => {
                return adapterXLSXToDoc(item);
            });

            console.log('dataResult', dataResult);

            const dataToSave = {
                ...selectedDocs,
                listDocs: dataResult
            };

            if (dataToSave.id === '') {
                dataToSave.id = idDocSave;

                dispatch(
                    createSetting({
                        values: dataToSave
                    })
                ).finally(() => {
                    setShowDialog(false);
                });
            } else {
                dispatch(
                    updateSetting({
                        values: dataToSave
                    })
                ).finally(() => {
                    setShowDialog(false);
                });
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <MyButton
                size={'xs'}
                leftIcon="Upload"
                colorPalette={'upload'}
                onClick={() => setShowDialog(true)}
            >
                Importar Documentos
            </MyButton>

            <MyDialog
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                header={'Importar Documentos'}
                body={
                    <MyFlex direction={'column'} gap={3} p={0}>
                        <MyText>
                            El archivo debe ser un archivo de Excel (.xlsx) con
                            alguna las siguientes columnas:
                        </MyText>

                        <MyFlex
                            direction={'column'}
                            gap={3}
                            p={0}
                            px={5}
                            borderRadius={'10px'}
                            mt={3}
                        >
                            {allowColumns.map((item, index) => (
                                <MyText
                                    key={`allow-column-${index}`}
                                    fontWeight={'semibold'}
                                >
                                    {index + 1}) {item.label}
                                </MyText>
                            ))}
                        </MyFlex>

                        {errorMessage && (
                            <MyText color={'red'} fontWeight={'semibold'}>
                                Error: {errorMessage}
                            </MyText>
                        )}

                        <MyFlex direction={'row'} ms={'auto'} gap={2} p={0}>
                            <MyFileUpload
                                text={'Importar'}
                                accept={[
                                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                                ]}
                                maxFiles={1}
                                buttonStyle={{
                                    variant: 'solid',
                                    colorPalette: 'upload',
                                    size: 'sm'
                                }}
                                onChange={handleOnChange}
                                loading={isLoading}
                            />
                        </MyFlex>
                    </MyFlex>
                }
            />
        </>
    );
};

export default DownLoadDocs;
