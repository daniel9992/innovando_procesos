import { Document, pdf } from '@react-pdf/renderer';
import { translateText } from '@src/customAgencyTool/services/translateText/translateSomeText';
import {
    GetArrayTextFromJSXElement,
    SetArrayTextFromJSXElement
} from '@src/customAgencyTool/utils/jsxElement/jsxElementTool';
import { saveAs } from 'file-saver';
import React, { memo, useState, type FC, type ReactElement } from 'react';

import DivGroupTitle from '../../divContainer/divGroupTitle';
import { MyButton } from '../../ui';
import { MySelect, type InterfaceItem } from '../../ui/mySelect';
import type { PdfProps } from './props';

const TranslationToMemo: FC<PdfProps> = ({
    arrayOfPages,
    pdfName,
    isTranslate = false
}) => {
    const [isLoading, setIsLoading] = useState(false);

    /**
     *  ? -----------------------------
     *  * Handle Translation
     *  ? -----------------------------
     */
    const [language, setLanguage] = useState<string>('en');

    const languageOptions: Array<InterfaceItem> = [
        {
            label: 'English',
            value: 'en'
        },
        // {
        //     label: 'Arabic',
        //     value: 'ar'
        // },
        {
            label: 'Francés',
            value: 'fr'
        },
        {
            label: 'Portugués',
            value: 'pt'
        },
        {
            label: 'German',
            value: 'de'
        },
        {
            label: 'Italian',
            value: 'it'
        }
    ];

    const handleTranslateAndDownload = async () => {
        if (!arrayOfPages || !pdfName) {
            return;
        }

        // console.log('handleTranslateAndDownload');

        // console.log('arrayOfPages', arrayOfPages);

        const jsxElement = arrayOfPages as ReactElement;
        if (!jsxElement) {
            console.log('No JSX element found');

            return;
        }

        const pagesJSXElements = React.Children.toArray(
            (jsxElement as { props: { children: ReactElement[] } }).props
                .children
        ) as ReactElement[];

        // console.log('pagesJSXElements', pagesJSXElements);

        try {
            setIsLoading(true);
            const textByPages: Array<Array<string>> = [];

            // 1. Get all text from pages
            pagesJSXElements.map(async (pageJSXElement) => {
                const arrayTexts = GetArrayTextFromJSXElement(pageJSXElement);
                textByPages.push(arrayTexts);
            });

            // console.log('textByPages', textByPages);

            // setIsLoading((prev) => ({ ...prev, isLoadingTranslate: false }));
            // return;

            // 2. Translate all text
            const translatedTexts: Array<Array<string>> = await Promise.all(
                textByPages.map(async (arrayTexts) => {
                    try {
                        const resultTranslate = await translateText({
                            text: arrayTexts,
                            targetLanguage: language
                        });

                        const payload = resultTranslate.result;

                        if (!payload) {
                            throw new Error('Error al traducir');
                        }

                        const translatedTexts = payload as Array<string>;

                        // console.log(translatedTexts);

                        return translatedTexts;
                    } catch (error) {
                        console.log(error);
                        throw error;
                    }
                })
            );

            // console.log(translatedTexts);

            // setIsLoading((prev) => ({ ...prev, isLoadingTranslate: false }));
            // return;

            // 3. Set text to pages
            const updatedPagesPromises = pagesJSXElements.map(
                async (pageJSXElement, index) => {
                    const pageTranslated = translatedTexts[index];
                    return SetArrayTextFromJSXElement(
                        pageJSXElement,
                        pageTranslated
                    );
                }
            );

            // console.log(updatedPagesPromises);

            // 4. Generate PDF after processing all pages
            const updatedPages = await Promise.all(updatedPagesPromises);

            // UFT-8 - todo bien
            // console.log(updatedPages);

            // 5. Generate PDF
            const blob = await pdf(
                <Document language={language}>{updatedPages}</Document>
            ).toBlob();

            // console.log(blob);

            const url = URL.createObjectURL(blob);

            saveAs(url, `${pdfName}.pdf`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isTranslate) {
        return null;
    }

    return (
        <DivGroupTitle title="Traducción">
            <MySelect
                width="130px"
                showItem={['label']}
                defaultValue={[`${language}`]}
                items={languageOptions}
                onChange={(value) => {
                    const lang = value[0];
                    setLanguage(lang);
                }}
            />
            <MyButton
                leftIcon={'DOCS'}
                colorPalette={'blue'}
                onClick={handleTranslateAndDownload}
                loading={isLoading}
            >
                Generar PDF {language}
            </MyButton>
        </DivGroupTitle>
    );
};

const Translation = memo(TranslationToMemo);

export default Translation;
