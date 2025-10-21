import { MyButton } from '@src/customAgencyTool/components/ui';
import type { IWorkSheet } from '@src/customAgencyTool/components/xlsx/read/readXlsx';
import { GenerateExcelFile } from '@src/customAgencyTool/components/xlsx/write/writeXlsx';
import {
    changeDataKey,
    type IChangeDataKey
} from '@src/customAgencyTool/utils/objects/changeDataKey';
import { type FC } from 'react';
import { type InterfaceSelectedRateOnSave } from '../../../../../domain/modelListOfRates';
import { allowColumns } from '../downLoadRates/utils';

interface Props {
    selectedRate: InterfaceSelectedRateOnSave;
}

const UpLoadRates: FC<Props> = ({ selectedRate }) => {
    const handledOnUpload = async () => {
        const newAllowedColumns: IChangeDataKey[] = allowColumns.map(
            (item) => ({
                dataKey: item.key,
                newDataKey: item.label
            })
        );

        try {
            const formatedData = selectedRate.listOfRates.map((item) => {
                const copyItem = {
                    ...item,
                    id: undefined
                };

                delete copyItem.id;

                return changeDataKey(copyItem, newAllowedColumns);
            });

            const worksheets: IWorkSheet = {
                name: 'Lista de Rubros',
                data: formatedData
            };

            await GenerateExcelFile([worksheets], 'Lista de Rubros.xlsx');
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
            Exportar Rubros
        </MyButton>
    );
};

export default UpLoadRates;
