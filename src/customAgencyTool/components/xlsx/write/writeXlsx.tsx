import ExcelJS from 'exceljs';

export interface IGenericData {
    [key: string]: string | number | boolean | Date;
}

export interface IWorkSheet {
    name: string;
    data: IGenericData[];
}

export const GenerateExcelFile = async (
    worksheets: IWorkSheet[],
    fileName: string = 'download.xlsx'
): Promise<void> => {
    try {
        // Crear un nuevo workbook
        const workbook = new ExcelJS.Workbook();

        // Configurar las propiedades del documento
        workbook.creator = 'Your App';
        workbook.lastModifiedBy = 'Your App';
        workbook.created = new Date();
        workbook.modified = new Date();

        // Procesar cada worksheet
        worksheets.forEach(({ name, data }) => {
            // Crear una nueva hoja
            const worksheet = workbook.addWorksheet(name);

            if (data.length === 0) return;

            // Obtener los headers del primer objeto
            const headers = Object.keys(data[0]);

            // Configurar las columnas
            worksheet.columns = headers.map((header) => ({
                header,
                key: header,
                width: 15, // Ancho por defecto
                style: {
                    font: { bold: true } // Estilo para el header
                }
            }));

            // Estilizar la fila de headers
            const headerRow = worksheet.getRow(1);
            headerRow.font = { bold: true };
            headerRow.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE0E0E0' }
            };
            headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

            // Agregar los datos
            data.forEach((rowData) => {
                const row = worksheet.addRow(rowData);

                // Aplicar formato según el tipo de dato
                row.eachCell((cell /*, colNumber*/) => {
                    const value = cell.value;

                    // Configurar el tipo de celda según el valor
                    if (value instanceof Date) {
                        cell.numFmt = 'dd/mm/yyyy';
                    } else if (typeof value === 'number') {
                        cell.numFmt = '#,##0.00';
                    }

                    // Alineación según el tipo de dato
                    cell.alignment = {
                        vertical: 'middle',
                        horizontal: typeof value === 'number' ? 'right' : 'left'
                    };
                });
            });

            // Agregar bordes a todas las celdas
            worksheet.eachRow((row /*, rowNumber*/) => {
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });

            // Congelar la primera fila
            worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }];

            // Ajustar el ancho de las columnas automáticamente
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column?.eachCell?.({ includeEmpty: true }, (cell) => {
                    const columnLength = cell.value
                        ? cell.value.toString().length
                        : 10;
                    if (columnLength > maxLength) {
                        maxLength = columnLength;
                    }
                });
                column.width = maxLength < 10 ? 10 : maxLength + 2;
            });
        });

        // Generar el archivo y descargarlo
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Crear link de descarga
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        // Limpiar
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating Excel file:', error);
        throw new Error('Failed to generate Excel file');
    }
};
