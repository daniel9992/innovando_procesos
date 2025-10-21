import { MyButton } from '@src/customAgencyTool/components/ui';
import type { IWorkSheet } from '@src/customAgencyTool/components/xlsx/read/readXlsx';
import { GenerateExcelFile } from '@src/customAgencyTool/components/xlsx/write/writeXlsx';
import {
    changeDataKey,
    type IChangeDataKey
} from '@src/customAgencyTool/utils/objects/changeDataKey';
import type { FC } from 'react';
import type { InterfaceConfigListOfDocsSave } from '../../../../../domain/modelConfigDocList';
import { allowColumns } from '../downloadDocs/utils';

interface Props {
    selectedDocs: InterfaceConfigListOfDocsSave;
}

const UpLoadDocs: FC<Props> = ({ selectedDocs }) => {
    const handledOnUpload = async () => {
        const newAllowedColumns: IChangeDataKey[] = allowColumns
            .filter((item) => item.key !== 'id')
            .map((item) => ({
                dataKey: item.key,
                newDataKey: item.label
            }));

        try {
            const formatedData = selectedDocs.listDocs.map((item) => {
                const copyItem = {
                    ...item,
                    id: undefined
                };

                delete copyItem.id;

                return changeDataKey(copyItem, newAllowedColumns);
            });

            const worksheets: IWorkSheet = {
                name: 'Lista de Documentos',
                data: formatedData
            };

            await GenerateExcelFile([worksheets], 'Lista de Documentos.xlsx');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <MyButton
            size={'xs'}
            leftIcon="Download"
            colorPalette={'download'}
            onClick={handledOnUpload}
        >
            Exportar Documentos
        </MyButton>
    );
};

export default UpLoadDocs;
