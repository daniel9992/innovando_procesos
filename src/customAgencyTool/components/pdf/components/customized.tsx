import { Document, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { memo, useState, type FC } from 'react';
import DivGroupTitle from '../../divContainer/divGroupTitle';
import { MyButton, MyInputText } from '../../ui';
import type { PdfProps } from './props';

const CustomizedToMemo: FC<PdfProps> = ({ pageList, pdfName }) => {
    const [isLoading, setIsLoading] = useState(false);

    /**
     *  ? -----------------------------
     *  * Handle Custom Pages to Download
     *  ? -----------------------------
     */
    const [customPages, setCustomPages] = useState<string>('');

    const GetValidNumberList = (customPages: string) => {
        // Validar que customPages no sea vacío
        if (!customPages) {
            return [];
        }

        // Dividir la cadena por comas para manejar grupos separados
        const groups = customPages.split(',');
        const result: number[] = [];

        groups.forEach((group) => {
            // Dividir por espacios para manejar múltiples rangos
            const ranges = group.trim().split(' ');

            ranges.forEach((range) => {
                // Verificar si es un rango (contiene guión)
                if (range.includes('-')) {
                    const [start, end] = range.split('-').map(Number);
                    // Generar números para el rango
                    for (let i = start; i <= end; i++) {
                        result.push(i);
                    }
                } else {
                    // Si no es un rango, es un número individual
                    const num = Number(range);
                    if (!isNaN(num)) {
                        result.push(num);
                    }
                }
            });
        });

        // Ordenar y eliminar duplicados
        return [...new Set(result)].sort((a, b) => a - b);
    };

    const handleCustomPages = async () => {
        // console.log('handleCustomPages');

        // console.log('GetValidNumberList', GetValidNumberList(customPages));

        // return;
        try {
            setIsLoading(true);
            if (!pageList || pageList.length === 0) {
                throw new Error('No hay páginas para procesar');
            }

            // Validación básica de customPages antes de procesar
            const numberList = GetValidNumberList(customPages);

            if (!numberList || numberList.length === 0) {
                throw new Error('No hay páginas seleccionadas');
            }

            // Generar el array de páginas
            const selectedElements = pageList.filter((_, index) =>
                numberList.includes(index + 1)
            );

            // console.log('selectedElements', selectedElements);

            // return;
            // Generar PDF con las páginas (traducidas o originales si hubo error)
            const blob = await pdf(
                <Document>{selectedElements}</Document>
            ).toBlob();
            saveAs(blob, `${pdfName}-CustomPages.pdf`);

            // Clear customPages
            setCustomPages('');
        } catch (error) {
            console.error('Error al procesar customPages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DivGroupTitle title="Personalizado">
            <MyInputText
                placeholder="1,2,3,4,5"
                width={'150px'}
                textAlign={'center'}
                value={customPages}
                onChange={(e) => setCustomPages(e.target.value)}
            />
            <MyButton
                aria-label="Personalizado"
                icon={'DOCS'}
                colorPalette={'blue'}
                onClick={handleCustomPages}
                loading={isLoading}
            />
        </DivGroupTitle>
    );
};

const Customized = memo(CustomizedToMemo);

export default Customized;
