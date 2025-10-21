import { useBreakpointValue } from '@chakra-ui/react';
import { Document, pdf, PDFDownloadLink } from '@react-pdf/renderer';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { DividerElements } from '@src/customAgencyTool/utils/pdf/pdfTools';
import { saveAs } from 'file-saver';
import {
    useEffect,
    useState,
    type FC,
    type JSX,
    type ReactElement,
    type ReactNode
} from 'react';
import { MyAspectRatio, MyButton, MyFlex } from '../ui';
import ByPage from './components/byPage';
import ByRange from './components/byRange';
import Customized from './components/customized';
import EntireDocument from './components/entireDocument';
import Translation from './components/translation';

interface PdfFrameProps {
    arrayOfPages: ReactNode;
    pdfName: string;
    isTranslate?: boolean;
}
const PdfFrame: FC<PdfFrameProps> = ({
    arrayOfPages,
    pdfName,
    isTranslate = false
}) => {
    /**
     *  ? -----------------------------
     *  * Initial Values
     *  ? -----------------------------
     */
    const [howManyPages, setHowManyPages] = useState(0);

    const [pageList, setPageList] = useState<ReactElement[]>();

    const breakPoints = useBreakpointValue({
        base: true,
        md: false
    });

    /**
     *  ? -----------------------------
     *  * Handle State
     *  ? -----------------------------
     */
    useEffect(() => {
        try {
            if (!arrayOfPages) {
                return;
            }

            const result = DividerElements(arrayOfPages as JSX.Element);

            setPageList(result as ReactElement[]);

            setHowManyPages(result.length);

            // set pdf blob
            // GenerateBlobPDf(children);

            // console.log(children);
        } catch (error) {
            console.error(error);
        }
    }, [arrayOfPages]);

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

        const blob = await pdf(<Document>{pageList}</Document>).toBlob();
        const url = URL.createObjectURL(blob);
        saveAs(url, `${pdfName}.pdf`);
    };

    /**
     *  ? -----------------------------
     *  * Render
     *  ? -----------------------------
     */
    const menuRender = (
        <MyFlex
            p={0}
            gap={4}
            direction={'row'}
            flexWrap={'wrap'}
            justifyContent={'center'}
            align={'center'}
            width={'100%'}
            mx={'auto'}
        >
            <ByPage
                howManyPages={howManyPages}
                pageList={pageList}
                pdfName={pdfName}
            />
            <ByRange
                howManyPages={howManyPages}
                pageList={pageList}
                pdfName={pdfName}
            />
            <Customized
                howManyPages={howManyPages}
                pageList={pageList}
                pdfName={pdfName}
            />
            <EntireDocument
                howManyPages={howManyPages}
                pageList={pageList}
                pdfName={pdfName}
            />
            <Translation
                isTranslate={isTranslate}
                arrayOfPages={arrayOfPages}
                howManyPages={howManyPages}
                pageList={pageList}
                pdfName={pdfName}
            />
        </MyFlex>
    );

    if (breakPoints) {
        return (
            <div>
                {menuRender}

                <MyFlex
                    justifyContent={'center'}
                    align={'center'}
                    height={'50vh'}
                    gap={5}
                >
                    <SelectedIcons iconName="PDF" size={'80px'} />
                    <MyButton
                        variant="solid"
                        bg={'tomato'}
                        color={'white'}
                        onClick={() => {
                            handleDownloadAll();
                        }}
                    >
                        Descargar PDF
                    </MyButton>
                </MyFlex>
            </div>
        );
    }

    return (
        <>
            {menuRender}

            <br />

            <MyAspectRatio
                ratio={{
                    base: 1,
                    // md: 16 / 7,
                    md: 17 / 7
                }}
            >
                <PDFDownloadLink
                    document={
                        <Document>{arrayOfPages as ReactElement}</Document>
                    }
                    fileName={`${pdfName}.pdf`}
                >
                    {({
                        //blob,
                        url,
                        loading,
                        error
                    }) => {
                        if (loading) {
                            return <p>Loading...</p>;
                        }
                        if (error) {
                            return <p>Error :(</p>;
                        }
                        if (url) {
                            return (
                                <iframe
                                    src={url}
                                    style={{ width: '100%', height: '100%' }}
                                />
                            );
                        }
                    }}
                </PDFDownloadLink>
                {/* <PDFViewer>
                    <Document>{arrayOfPages as ReactElement}</Document>
                </PDFViewer> */}
            </MyAspectRatio>
        </>
    );
};

export default PdfFrame;

// const PdfFrame1: FC<PdfFrameProps> = ({
//     arrayOfPages,
//     pdfName,
//     isTranslate = false
// }) => {
//     /**
//      *  ? -----------------------------
//      *  * Initial Values
//      *  ? -----------------------------
//      */
//     const [howManyPages, setHowManyPages] = useState(0);
//     const [selectedPage, setSelectedPage] = useState<number>(1);
//     const [pageList, setPageList] = useState<ReactElement[]>();
//     const { sendNotification } = useNotificationAdapter();

//     const [isLoading, setIsLoading] = useState({
//         isLoadingSelectedPage: false,
//         isLoadingAllPage: false,
//         isLoadingRangePage: false,
//         isLoadingCustomPages: false,
//         isLoadingTranslate: false
//     });

//     // set pdf blob
//     // const [pdfBlob, setPdfBlob] = useState<Blob>();

//     const ThrowErrorToast = useCallback(
//         (error: Error) => {
//             sendNotification({
//                 title: `Error`,
//                 description: error.message,
//                 status: 'error',
//                 duration: 9000,
//                 isClosable: true
//             });
//         },
//         [sendNotification]
//     );

//     /**
//      *  ? -----------------------------
//      *  * Handle State
//      *  ? -----------------------------
//      */
//     useEffect(() => {
//         try {
//             if (!arrayOfPages) {
//                 return;
//             }

//             const result = DividerElements(arrayOfPages as JSX.Element);

//             setPageList(result as ReactElement[]);

//             setHowManyPages(result.length);

//             // set pdf blob
//             // GenerateBlobPDf(children);

//             // console.log(children);
//         } catch (error) {
//             console.error(error);
//             ThrowErrorToast(error as Error);
//         }
//     }, [arrayOfPages, ThrowErrorToast]);

//     /**
//      *  ? -----------------------------
//      *  * Handle On Page Select
//      *  ? -----------------------------
//      */
//     const handleDownloadSelectedPage = async () => {
//         if (!pageList || selectedPage < 1 || selectedPage > pageList.length) {
//             ThrowErrorToast(new Error('La página seleccionada es incorrecta.'));
//             return;
//         }

//         setIsLoading((prev) => ({ ...prev, isLoadingSelectedPage: true }));
//         try {
//             // Optimización: Evitar crear un nuevo PDFDocument si solo se descarga una página
//             const selectedElement = pageList[selectedPage - 1];
//             const blob = await pdf(
//                 <Document>{selectedElement}</Document>
//             ).toBlob();
//             saveAs(blob, `${pdfName}-Page-${selectedPage}.pdf`);
//         } catch (error) {
//             console.error('Error downloading selected page:', error);
//             ThrowErrorToast(error as Error);
//             // Manejar el error, por ejemplo, mostrando una notificación al usuario
//         } finally {
//             setIsLoading((prev) => ({ ...prev, isLoadingSelectedPage: false }));
//         }
//     };

//     /**
//      *  ? -----------------------------
//      *  * Handle On download All
//      *  ? -----------------------------
//      */
//     const handleDownloadAll = async () => {
//         if (!pageList) {
//             console.error('No pages to download');
//             return;
//         }

//         setIsLoading({
//             ...isLoading,
//             isLoadingAllPage: true
//         });
//         const blob = await pdf(<Document>{pageList}</Document>).toBlob();
//         const url = URL.createObjectURL(blob);
//         saveAs(url, `${pdfName}.pdf`);
//         setIsLoading({
//             ...isLoading,
//             isLoadingAllPage: false
//         });
//     };

//     /**
//      *  ? -----------------------------
//      *  * Handle On Page Range
//      *  ? -----------------------------
//      */
//     const handleDownloadRange = async ({ from, to }: InterfaceRange) => {
//         if (!pageList || from < 1 || to > pageList.length) {
//             ThrowErrorToast(new Error('La página seleccionada es incorrecta.'));
//             return;
//         }

//         setIsLoading((prev) => ({ ...prev, isLoadingRangePage: true }));
//         try {
//             const selectedElements = pageList.slice(from - 1, to);

//             console.log('selectedElements', selectedElements);

//             const blob = await pdf(
//                 <Document>{selectedElements}</Document>
//             ).toBlob();

//             // Optimización: Evitar crear un nuevo PDFDocument si el rango incluye todas las páginas
//             if (from === 1 && to === pageList.length) {
//                 saveAs(blob, `${pdfName}.pdf`);
//             } else {
//                 const arrayBuffer = await blob.arrayBuffer();
//                 const pdfDoc = await PDFDocument.load(arrayBuffer);
//                 const newPdfDoc = await PDFDocument.create();
//                 const extractedPages = await newPdfDoc.copyPages(
//                     pdfDoc,
//                     Array.from({ length: to - from + 1 }, (_, i) => i)
//                 );
//                 extractedPages.forEach((page) => newPdfDoc.addPage(page));
//                 const newPdfBytes = await newPdfDoc.save();
//                 const newBlob = new Blob([new Uint8Array(newPdfBytes)], {
//                     type: 'application/pdf'
//                 });
//                 saveAs(newBlob, `${pdfName}-Pages-${from}-to-${to}.pdf`);
//             }
//         } catch (error) {
//             console.error('Error downloading selected page:', error);
//             // Manejar el error, por ejemplo, mostrando una notificación al usuario
//             ThrowErrorToast(error as Error);
//         } finally {
//             setIsLoading((prev) => ({ ...prev, isLoadingRangePage: false }));
//         }
//     };

//     /**
//      *  ? -----------------------------
//      *  * Handle Custom Pages to Download
//      *  ? -----------------------------
//      */
//     const [customPages, setCustomPages] = useState<string>('');

//     const GetValidNumberList = (customPages: string) => {
//         // Validar que customPages no sea vacío
//         if (!customPages) {
//             return [];
//         }

//         // Dividir la cadena por comas para manejar grupos separados
//         const groups = customPages.split(',');
//         const result: number[] = [];

//         groups.forEach((group) => {
//             // Dividir por espacios para manejar múltiples rangos
//             const ranges = group.trim().split(' ');

//             ranges.forEach((range) => {
//                 // Verificar si es un rango (contiene guión)
//                 if (range.includes('-')) {
//                     const [start, end] = range.split('-').map(Number);
//                     // Generar números para el rango
//                     for (let i = start; i <= end; i++) {
//                         result.push(i);
//                     }
//                 } else {
//                     // Si no es un rango, es un número individual
//                     const num = Number(range);
//                     if (!isNaN(num)) {
//                         result.push(num);
//                     }
//                 }
//             });
//         });

//         // Ordenar y eliminar duplicados
//         return [...new Set(result)].sort((a, b) => a - b);
//     };

//     const handleCustomPages = async () => {
//         // console.log('handleCustomPages');

//         // console.log('GetValidNumberList', GetValidNumberList(customPages));

//         // return;
//         try {
//             setIsLoading((prev) => ({ ...prev, isLoadingCustomPages: true }));
//             if (!pageList || pageList.length === 0) {
//                 throw new Error('No hay páginas para procesar');
//             }

//             // Validación básica de customPages antes de procesar
//             const numberList = GetValidNumberList(customPages);

//             if (!numberList || numberList.length === 0) {
//                 throw new Error('No hay páginas seleccionadas');
//             }

//             // Generar el array de páginas
//             const selectedElements = pageList.filter((_, index) =>
//                 numberList.includes(index + 1)
//             );

//             // console.log('selectedElements', selectedElements);

//             // return;
//             // Generar PDF con las páginas (traducidas o originales si hubo error)
//             const blob = await pdf(
//                 <Document>{selectedElements}</Document>
//             ).toBlob();
//             saveAs(blob, `${pdfName}-CustomPages.pdf`);

//             // Clear customPages
//             setCustomPages('');
//         } catch (error) {
//             console.error('Error al procesar customPages:', error);
//         } finally {
//             setIsLoading((prev) => ({ ...prev, isLoadingCustomPages: false }));
//         }
//     };

//     /**
//      *  ? -----------------------------
//      *  * Handle Translation
//      *  ? -----------------------------
//      */
//     const [language, setLanguage] = useState<string>('en');

//     const languageOptions: Array<InterfaceItem> = [
//         {
//             label: 'English',
//             value: 'en'
//         },
//         // {
//         //     label: 'Arabic',
//         //     value: 'ar'
//         // },
//         {
//             label: 'Francés',
//             value: 'fr'
//         },
//         {
//             label: 'Portugués',
//             value: 'pt'
//         },
//         {
//             label: 'German',
//             value: 'de'
//         },
//         {
//             label: 'Italian',
//             value: 'it'
//         }
//     ];

//     const handleTranslateAndDownload = async () => {
//         if (!arrayOfPages || !pdfName) {
//             return;
//         }

//         // console.log('handleTranslateAndDownload');

//         // console.log('arrayOfPages', arrayOfPages);

//         const jsxElement = arrayOfPages as ReactElement;
//         if (!jsxElement) {
//             console.log('No JSX element found');
//             ThrowErrorToast(new Error('No JSX element found'));
//             return;
//         }

//         const pagesJSXElements = React.Children.toArray(
//             (jsxElement as { props: { children: ReactElement[] } }).props
//                 .children
//         ) as ReactElement[];

//         // console.log('pagesJSXElements', pagesJSXElements);

//         try {
//             setIsLoading((prev) => ({ ...prev, isLoadingTranslate: true }));
//             const textByPages: Array<Array<string>> = [];

//             // 1. Get all text from pages
//             pagesJSXElements.map(async (pageJSXElement) => {
//                 const arrayTexts = GetArrayTextFromJSXElement(pageJSXElement);
//                 textByPages.push(arrayTexts);
//             });

//             // console.log('textByPages', textByPages);

//             // setIsLoading((prev) => ({ ...prev, isLoadingTranslate: false }));
//             // return;

//             // 2. Translate all text
//             const translatedTexts: Array<Array<string>> = await Promise.all(
//                 textByPages.map(async (arrayTexts) => {
//                     try {
//                         const resultTranslate = await translateText({
//                             text: arrayTexts,
//                             targetLanguage: language
//                         });

//                         const payload = resultTranslate.result;

//                         if (!payload) {
//                             throw new Error('Error al traducir');
//                         }

//                         const translatedTexts = payload as Array<string>;

//                         // console.log(translatedTexts);

//                         return translatedTexts;
//                     } catch (error) {
//                         console.log(error);
//                         throw error;
//                     }
//                 })
//             );

//             // console.log(translatedTexts);

//             // setIsLoading((prev) => ({ ...prev, isLoadingTranslate: false }));
//             // return;

//             // 3. Set text to pages
//             const updatedPagesPromises = pagesJSXElements.map(
//                 async (pageJSXElement, index) => {
//                     const pageTranslated = translatedTexts[index];
//                     return SetArrayTextFromJSXElement(
//                         pageJSXElement,
//                         pageTranslated
//                     );
//                 }
//             );

//             // console.log(updatedPagesPromises);

//             // 4. Generate PDF after processing all pages
//             const updatedPages = await Promise.all(updatedPagesPromises);

//             // UFT-8 - todo bien
//             // console.log(updatedPages);

//             // 5. Generate PDF
//             const blob = await pdf(
//                 <Document language={language}>{updatedPages}</Document>
//             ).toBlob();

//             // console.log(blob);

//             const url = URL.createObjectURL(blob);

//             saveAs(url, `${pdfName}.pdf`);
//         } catch (error) {
//             console.error(error);
//             ThrowErrorToast(error as Error);
//         } finally {
//             setIsLoading((prev) => ({ ...prev, isLoadingTranslate: false }));
//         }
//     };

//     /**
//      *  ? -----------------------------
//      *  * Render
//      *  ? -----------------------------
//      */
//     return (
//         <MyFlex direction={'column'}>
//             <MyFlex
//                 p={0}
//                 gap={4}
//                 direction={'row'}
//                 flexWrap={'wrap'}
//                 justifyContent={'center'}
//                 align={'center'}
//                 width={'100%'}
//                 mx={'auto'}
//             >
//                 <DivGroupTitle title="Por Página">
//                     <MySelect
//                         width="100px"
//                         showItem={['label']}
//                         defaultValue={[`${selectedPage}`]}
//                         items={Array.from(
//                             { length: howManyPages },
//                             (_, i) => i + 1
//                         ).map((pageNum) => ({
//                             value: pageNum,
//                             label: `Page ${pageNum}`
//                         }))}
//                         onChange={(value) => {
//                             const pageNum = Number(value[0]);
//                             setSelectedPage(pageNum);
//                         }}
//                     />
//                     <MyButton
//                         leftIcon={'DOC'}
//                         colorPalette={'blue'}
//                         onClick={handleDownloadSelectedPage}
//                         loading={isLoading.isLoadingSelectedPage}
//                     >
//                         {`${selectedPage} p`}
//                     </MyButton>
//                 </DivGroupTitle>

//                 <DivGroupTitle title="Por Rango">
//                     <GetPageRange
//                         isLoading={isLoading.isLoadingRangePage}
//                         callBackSubmit={handleDownloadRange}
//                     />
//                 </DivGroupTitle>

//                 <DivGroupTitle title="Personalizado">
//                     <MyInputText
//                         placeholder="1,2,3,4,5"
//                         width={'150px'}
//                         textAlign={'center'}
//                         value={customPages}
//                         onChange={(e) => setCustomPages(e.target.value)}
//                     />
//                     <MyButton
//                         aria-label="Personalizado"
//                         icon={'DOCS'}
//                         colorPalette={'blue'}
//                         onClick={handleCustomPages}
//                         loading={isLoading.isLoadingCustomPages}
//                     />
//                 </DivGroupTitle>

//                 <DivGroupTitle title="Documento">
//                     <MyButton
//                         leftIcon={'DOCS'}
//                         colorPalette={'blue'}
//                         loading={isLoading.isLoadingAllPage}
//                         onClick={handleDownloadAll}
//                     >
//                         Todo
//                     </MyButton>
//                 </DivGroupTitle>

//                 {isTranslate && (
//                     <DivGroupTitle title="Traducción">
//                         <MySelect
//                             width="130px"
//                             showItem={['label']}
//                             defaultValue={[`${language}`]}
//                             items={languageOptions}
//                             onChange={(value) => {
//                                 const lang = value[0];
//                                 setLanguage(lang);
//                             }}
//                         />
//                         <MyButton
//                             leftIcon={'DOCS'}
//                             colorPalette={'blue'}
//                             onClick={handleTranslateAndDownload}
//                             loading={isLoading.isLoadingTranslate}
//                         >
//                             Generar PDF {language}
//                         </MyButton>
//                     </DivGroupTitle>
//                 )}
//             </MyFlex>

//             <MyAspectRatio ratio={{ base: 1, md: 16 / 7 }}>
//                 <PDFViewer>
//                     <Document>{arrayOfPages as ReactElement}</Document>
//                 </PDFViewer>
//             </MyAspectRatio>
//         </MyFlex>
//     );
// };
