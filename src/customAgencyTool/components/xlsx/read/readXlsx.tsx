import ExcelJS, { type CellValue } from 'exceljs';

export interface IGenericData {
    [key: string]: string | number | boolean | Date;
}

export interface IWorkSheet {
    name: string;
    data: IGenericData[];
}

export const ReadExcelFile = async (file: File): Promise<IWorkSheet[]> => {
    try {
        // Crear un nuevo workbook
        const workbook = new ExcelJS.Workbook();

        // Leer el archivo como ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Cargar el archivo Excel
        await workbook.xlsx.load(arrayBuffer);

        const worksheets: IWorkSheet[] = [];

        // Iterar sobre cada hoja del libro
        workbook.worksheets.forEach((worksheet) => {
            const sheetData: IGenericData[] = [];
            const headers: string[] = [];

            // Obtener los headers de la primera fila
            worksheet.getRow(1).eachCell((cell, colNumber) => {
                headers[colNumber - 1] =
                    cell.value?.toString() || `Column${colNumber}`;
            });

            // Iterar sobre cada fila (excluyendo la primera que son los headers)
            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Saltar la fila de headers

                const rowData: IGenericData = {};

                // Iterar sobre cada celda de la fila
                row.eachCell((cell, colNumber) => {
                    const header = headers[colNumber - 1];
                    let value: CellValue = cell.value;

                    // Manejar diferentes tipos de valores
                    if (value !== null && typeof value === 'object') {
                        if ('result' in value) {
                            // Manejar fórmulas
                            value = value.result || '';
                        } else if ('text' in value) {
                            // Manejar texto enriquecido
                            value = value.text || '';
                        }
                    }

                    // Convertir el valor al tipo apropiado
                    if (cell.type === ExcelJS.ValueType.Date) {
                        rowData[header] = cell.value as Date;
                    } else if (cell.type === ExcelJS.ValueType.Number) {
                        rowData[header] = Number(value);
                    } else if (cell.type === ExcelJS.ValueType.Boolean) {
                        rowData[header] = Boolean(value);
                    } else {
                        rowData[header] = String(value || '');
                    }
                });

                // Agregar la fila solo si tiene datos
                if (Object.keys(rowData).length > 0) {
                    sheetData.push(rowData);
                }
            });

            // Agregar la hoja de trabajo al array final
            worksheets.push({
                name: worksheet.name,
                data: sheetData
            });
        });

        return worksheets;
    } catch (error) {
        console.error('Error reading Excel file:', error);
        throw new Error('Failed to read Excel file');
    }
};
