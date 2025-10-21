import { Document, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { memo, useState, type FC } from 'react';
import DivGroupTitle from '../../divContainer/divGroupTitle';
import { MyButton } from '../../ui';
import type { PdfProps } from './props';

const EntireDocumentToMemo: FC<PdfProps> = ({ pageList, pdfName }) => {
    const [isLoading, setIsLoading] = useState(false);

    /**
     *  ? -----------------------------
     *  * Handle On download All
     *  ? -----------------------------
     */
    const handleDownloadAll = async () => {
        if (!pageList) {
            console.error('No pages to download');
            return;
        }

        setIsLoading(true);
        const blob = await pdf(<Document>{pageList}</Document>).toBlob();
        const url = URL.createObjectURL(blob);
        saveAs(url, `${pdfName}.pdf`);
        setIsLoading(false);
    };

    return (
        <DivGroupTitle title="Documento" minW={'110px'}>
            <MyButton
                leftIcon={'DOCS'}
                colorPalette={'blue'}
                loading={isLoading}
                onClick={handleDownloadAll}
            >
                Todo
            </MyButton>
        </DivGroupTitle>
    );
};

const EntireDocument = memo(EntireDocumentToMemo);

export default EntireDocument;
