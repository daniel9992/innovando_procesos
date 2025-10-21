import { Document, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { memo, useState, type FC } from 'react';
import DivGroupTitle from '../../divContainer/divGroupTitle';
import { MyButton, MySelect } from '../../ui';
import type { PdfProps } from './props';

const ByPageToMemo: FC<PdfProps> = ({ howManyPages, pageList, pdfName }) => {
    const [selectedPage, setSelectedPage] = useState<number>(1);

    const [isLoading, setIsLoading] = useState(false);

    /**
     *  ? -----------------------------
     *  * Handle On Page Select
     *  ? -----------------------------
     */
    const handleDownloadSelectedPage = async () => {
        if (!pageList || selectedPage < 1 || selectedPage > pageList.length) {
            // ThrowErrorToast(new Error('La página seleccionada es incorrecta.'));
            return;
        }

        setIsLoading(true);
        try {
            // Optimización: Evitar crear un nuevo PDFDocument si solo se descarga una página
            const selectedElement = pageList[selectedPage - 1];
            const blob = await pdf(
                <Document>{selectedElement}</Document>
            ).toBlob();
            saveAs(blob, `${pdfName}-Page-${selectedPage}.pdf`);
        } catch (error) {
            console.error('Error downloading selected page:', error);
            // ThrowErrorToast(error as Error);
            // Manejar el error, por ejemplo, mostrando una notificación al usuario
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DivGroupTitle title="Por Página">
            <MySelect
                width="100px"
                showItem={['label']}
                defaultValue={[`${selectedPage}`]}
                items={Array.from(
                    { length: howManyPages },
                    (_, i) => i + 1
                ).map((pageNum) => ({
                    value: pageNum,
                    label: `Page ${pageNum}`
                }))}
                onChange={(value) => {
                    const pageNum = Number(value[0]);
                    setSelectedPage(pageNum);
                }}
            />
            <MyButton
                leftIcon={'DOC'}
                colorPalette={'blue'}
                onClick={handleDownloadSelectedPage}
                loading={isLoading}
            >
                {`${selectedPage} p`}
            </MyButton>
        </DivGroupTitle>
    );
};

const ByPage = memo(ByPageToMemo);

export default ByPage;
