// import { Text as TextPDF } from '@react-pdf/renderer';
// import React, { type JSX, type ReactNode } from 'react';
// import { Html } from 'react-pdf-html';

// type TextExtractorConfig = {
//     validTypes: Array<string | React.ComponentType<any>>;
//     shouldExtractText?: (element: React.ReactElement) => boolean;
// };

// const defaultConfig: TextExtractorConfig = {
//     validTypes: [TextPDF, Html],
//     shouldExtractText: (element) =>
//         defaultConfig.validTypes.includes(element.type as any)
// };

// /**
//  * createTextExtractor
//  * @param config let user define the validTypes and the shouldExtractText
//  * @returns extractText and setText
//  * @returns setText
//  */
// export const createTextExtractor = (
//     config: TextExtractorConfig = defaultConfig
// ) => {
//     const extractText = (jsxElement: JSX.Element): string[] => {
//         const texts: string[] = [];

//         const processNode = (node: ReactNode): void => {
//             if (!React.isValidElement(node)) {
//                 if (typeof node === 'string') texts.push(node);
//                 return;
//             }

//             const element = node as React.ReactElement;

//             if (config.shouldExtractText?.(element)) {
//                 const content = element.props.children;

//                 if (typeof content === 'string') {
//                     texts.push(content);
//                 } else if (content) {
//                     React.Children.forEach(content, processNode);
//                 }
//             } else if (element.props?.children) {
//                 React.Children.forEach(element.props.children, processNode);
//             }
//         };

//         processNode(jsxElement);
//         return texts;
//     };

//     const setText = (jsxElement: ReactNode, texts: string[]): ReactNode => {
//         const iterator = texts[Symbol.iterator]();

//         const processNode = (node: ReactNode): ReactNode => {
//             if (!React.isValidElement(node)) return node;

//             const element = node as React.ReactElement;

//             if (config.shouldExtractText?.(element)) {
//                 const content = element.props.children;

//                 if (typeof content === 'string') {
//                     const { value, done } = iterator.next();
//                     return done
//                         ? element
//                         : React.cloneElement(element, {}, value);
//                 }
//             }

//             if (element.props?.children) {
//                 return React.cloneElement(element, {
//                     children: React.Children.map(
//                         element.props.children,
//                         processNode
//                     )
//                 });
//             }

//             return element;
//         };

//         return processNode(jsxElement);
//     };

//     return {
//         extractText,
//         setText
//     };
// };

// // Funciones de utilidad con la configuración por defecto
// export const GetArrayTextFromJSXElement = (
//     jsxElement: JSX.Element
// ): string[] => {
//     const { extractText } = createTextExtractor();
//     return extractText(jsxElement);
// };

// export const SetArrayTextFromJSXElement = (
//     jsxElement: ReactNode,
//     texts: string[]
// ): ReactNode => {
//     const { setText } = createTextExtractor();
//     return setText(jsxElement, texts);
// };

// // Ejemplo de uso con configuración personalizada
// export const createCustomTextExtractor = (
//     validTypes: Array<string | React.ComponentType<any>>,
//     customCheck?: (element: React.ReactElement) => boolean
// ) => {
//     return createTextExtractor({
//         validTypes,
//         shouldExtractText: (element) => {
//             const isValidType = validTypes.includes(element.type as any);
//             return customCheck
//                 ? customCheck(element) && isValidType
//                 : isValidType;
//         }
//     });
// };

import { Text as TextPDF } from '@react-pdf/renderer';
import React, { type JSX, type ReactNode } from 'react';

import { Html } from 'react-pdf-html';

/**
 * GetArrayTextFromJSXElement
 * @param jsxElement - The JSX element to extract the text from.
 * @returns - An array of strings containing the text from the JSX element.
 */
export const GetArrayTextFromJSXElement = (
    jsxElement: JSX.Element
): string[] => {
    const arrayTexts: string[] = [];

    const extractTextFromElement = (element: ReactNode): void => {
        if (!React.isValidElement(element)) return;

        const elementNode = element as React.ReactElement<{
            children: ReactNode;
        }>;

        if (elementNode.type === TextPDF || elementNode.type === Html) {
            const text = elementNode.props.children;

            if (typeof text === 'string') {
                arrayTexts.push(text);
            } else {
                React.Children.forEach(
                    elementNode.props.children,
                    extractTextFromElement
                );
            }
        } else if (elementNode.props && elementNode.props.children) {
            React.Children.forEach(
                elementNode.props.children,
                extractTextFromElement
            );
        }
    };

    extractTextFromElement(jsxElement);

    return arrayTexts;
};

/**
 * SetArrayTextFromJSXElement
 * @param jsxElement - The JSX element to set the text on.
 * @param texts - An array of strings containing the text to set.
 * @returns - A new JSX element with the text set.
 */
export const SetArrayTextFromJSXElement = (
    jsxElement: ReactNode,
    texts: string[]
): ReactNode => {
    const textsIterator = texts[Symbol.iterator]();

    const replaceTextInElement = (
        element: React.ReactNode
    ): React.ReactNode => {
        if (!React.isValidElement(element)) return element;

        const elementNode = element as React.ReactElement<{
            children: React.ReactNode;
        }>;

        if (elementNode.type === TextPDF || elementNode.type === Html) {
            const text = elementNode.props.children;

            if (typeof text === 'string') {
                const { value } = textsIterator.next();
                return React.cloneElement(elementNode, {}, value);
            } else if (elementNode.props.children) {
                return React.cloneElement(elementNode, {
                    children: React.Children.map(
                        elementNode.props.children,
                        replaceTextInElement
                    )
                });
            }
        } else if (elementNode.props && elementNode.props.children) {
            return React.cloneElement(elementNode, {
                children: React.Children.map(
                    elementNode.props.children,
                    replaceTextInElement
                )
            });
        }

        return element;
    };

    return replaceTextInElement(jsxElement);
};
