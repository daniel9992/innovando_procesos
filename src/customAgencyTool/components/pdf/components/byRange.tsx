import { Document, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';
import type { FC } from 'react';
import { memo, useState } from 'react';
import DivGroupTitle from '../../divContainer/divGroupTitle';
import type { InterfaceRange } from './getPageRange';
import GetPageRange from './getPageRange';
import type { PdfProps } from './props';

const ByRangeToMemo: FC<PdfProps> = ({ pageList, pdfName }) => {
    const [isLoading, setIsLoading] = useState(false);

    /**
     *  ? -----------------------------
     *  * Handle On Page Range
     *  ? -----------------------------
     */
    const handleDownloadRange = async ({ from, to }: InterfaceRange) => {
        if (!pageList || from < 1 || to > pageList.length) {
            // ThrowErrorToast(new Error('La página seleccionada es incorrecta.'));
            return;
        }

        setIsLoading(true);
        try {
            const selectedElements = pageList.slice(from - 1, to);

            const blob = await pdf(
                <Document>{selectedElements}</Document>
            ).toBlob();

            // Optimización: Evitar crear un nuevo PDFDocument si el rango incluye todas las páginas
            if (from === 1 && to === pageList.length) {
                saveAs(blob, `${pdfName}.pdf`);
            } else {
                const arrayBuffer = await blob.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer);
                const newPdfDoc = await PDFDocument.create();
                const extractedPages = await newPdfDoc.copyPages(
                    pdfDoc,
                    Array.from({ length: to - from + 1 }, (_, i) => i)
                );
                extractedPages.forEach((page) => newPdfDoc.addPage(page));
                const newPdfBytes = await newPdfDoc.save();
                const newBlob = new Blob([new Uint8Array(newPdfBytes)], {
                    type: 'application/pdf'
                });
                saveAs(newBlob, `${pdfName}-Pages-${from}-to-${to}.pdf`);
            }
        } catch (error) {
            console.error('Error downloading selected page:', error);
            // Manejar el error, por ejemplo, mostrando una notificación al usuario
            // ThrowErrorToast(error as Error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DivGroupTitle title="Por Rango">
            <GetPageRange
                isLoading={isLoading}
                callBackSubmit={handleDownloadRange}
            />
        </DivGroupTitle>
    );
};

const ByRange = memo(ByRangeToMemo);

export default ByRange;
