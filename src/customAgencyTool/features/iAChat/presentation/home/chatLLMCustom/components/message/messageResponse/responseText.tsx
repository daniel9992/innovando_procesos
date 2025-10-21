// // components/message/MessageResponse/ResponseText.tsx
// import DOMPurify from 'dompurify';
// import parse, { Element, domToReact } from 'html-react-parser';
// import { type FC, useEffect, useState } from 'react';
// import { twMerge } from 'tailwind-merge';
// import { tableStyles } from './tableStyles';

// export interface StyleConfig {
//     tag: string;
//     classes: string;
// }

// const defaultStyleConfig: StyleConfig[] = [
//     {
//         tag: 'div',
//         classes: 'rounded-lg shadow-sm p-4'
//     },
//     {
//         tag: 'p',
//         classes: 'text-gray-800 leading-relaxed mb-4'
//     },
//     {
//         tag: 'h1',
//         classes: 'text-3xl font-bold text-gray-900 mb-6'
//     },
//     {
//         tag: 'h2',
//         classes: 'text-2xl font-semibold text-gray-900 mb-4'
//     },
//     {
//         tag: 'h3',
//         classes: 'text-xl font-semibold text-gray-900 mb-3'
//     },
//     {
//         tag: 'ul',
//         classes: 'list-disc list-inside mb-4 space-y-2'
//     },
//     {
//         tag: 'ol',
//         classes: 'list-decimal list-inside mb-4 space-y-2'
//     },
//     {
//         tag: 'li',
//         classes: 'text-gray-700'
//     },
//     {
//         tag: 'a',
//         classes: 'text-blue-600 hover:text-blue-800 underline'
//     },
//     {
//         tag: 'strong',
//         classes: 'font-bold text-gray-900'
//     },
//     {
//         tag: 'em',
//         classes: 'italic text-gray-800'
//     },
//     {
//         tag: 'code',
//         classes:
//             'bg-gray-100 rounded px-1 py-0.5 font-mono text-sm text-gray-800'
//     },
//     {
//         tag: 'pre',
//         classes: 'bg-gray-100 rounded-lg p-4 overflow-x-auto mb-4'
//     },
//     {
//         tag: 'table',
//         classes: 'min-w-full divide-y divide-gray-200 mb-4'
//     },
//     {
//         tag: 'thead',
//         classes: 'bg-gray-50'
//     },
//     {
//         tag: 'th',
//         classes:
//             'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
//     },
//     {
//         tag: 'td',
//         classes: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500'
//     },
//     {
//         tag: 'blockquote',
//         classes: 'border-l-4 border-gray-200 pl-4 italic text-gray-600 mb-4'
//     }
// ];

// interface ResponseTextProps {
//     prefix: string;
//     response: string;
//     htmlRenderMethod?: 'parser' | 'sanitized';
//     styleConfig?: StyleConfig[];
//     customClasses?: {
//         container?: string;
//         prefix?: string;
//         content?: string;
//     };
//     tableStyle?: keyof typeof tableStyles;
// }

// export const ResponseText: FC<ResponseTextProps> = ({
//     prefix,
//     response,
//     htmlRenderMethod = 'sanitized',
//     styleConfig = defaultStyleConfig,
//     customClasses = {},
//     tableStyle = 'bordered'
// }) => {
//     // Crear un mapa de estilos para búsqueda rápida
//     const styleMap = new Map(
//         styleConfig.map((config) => [config.tag, config.classes])
//     );

//     // Estilos para tablas personalizadas
//     const currentTableStyle = tableStyles[tableStyle];

//     const wrapTable = (tableHtml: string) => `
//         <div class="${currentTableStyle.container}">
//             ${tableHtml}
//         </div>
//     `;

//     // Función para aplicar clases de Tailwind a un elemento
//     const applyTailwindClasses = (element: Element): Element => {
//         const tag = element.name || '';
//         const defaultClasses = styleMap.get(tag) || '';

//         // Obtener clases existentes del elemento
//         const existingClasses = element.attribs?.class || '';

//         // Combinar clases usando tailwind-merge
//         const mergedClasses = twMerge(defaultClasses, existingClasses);

//         // Aplicar estilos a tablas
//         if (tag === 'table') {
//             return {
//                 ...element,
//                 attribs: {
//                     ...element.attribs,
//                     class: twMerge(
//                         currentTableStyle.container,
//                         currentTableStyle.table,
//                         element.attribs?.class
//                     )
//                 }
//             };
//         }
//         if (tag === 'thead') {
//             return {
//                 ...element,
//                 attribs: {
//                     ...element.attribs,
//                     class: twMerge(
//                         currentTableStyle.thead,
//                         element.attribs?.class
//                     )
//                 }
//             };
//         }
//         if (tag === 'tbody') {
//             return {
//                 ...element,
//                 attribs: {
//                     ...element.attribs,
//                     class: twMerge(
//                         currentTableStyle.tbody,
//                         element.attribs?.class
//                     )
//                 }
//             };
//         }
//         if (tag === 'tr') {
//             return {
//                 ...element,
//                 attribs: {
//                     ...element.attribs,
//                     class: twMerge(currentTableStyle.tr, element.attribs?.class)
//                 }
//             };
//         }
//         if (tag === 'th') {
//             return {
//                 ...element,
//                 attribs: {
//                     ...element.attribs,
//                     class: twMerge(currentTableStyle.th, element.attribs?.class)
//                 }
//             };
//         }
//         if (tag === 'td') {
//             return {
//                 ...element,
//                 attribs: {
//                     ...element.attribs,
//                     class: twMerge(currentTableStyle.td, element.attribs?.class)
//                 }
//             };
//         }
//         if (tag === 'caption') {
//             return {
//                 ...element,
//                 attribs: {
//                     ...element.attribs,
//                     class: twMerge(
//                         currentTableStyle.caption,
//                         element.attribs?.class
//                     )
//                 }
//             };
//         }

//         return {
//             ...element,
//             attribs: {
//                 ...element.attribs,
//                 class: mergedClasses
//             }
//         };
//     };

//     // Opciones para el parser
//     const parserOptions = {
//         replace: (domNode: any) => {
//             if (domNode instanceof Element) {
//                 if (domNode.name === 'table') {
//                     return wrapTable(
//                         domToReact([applyTailwindClasses(domNode)]) as string
//                     );
//                 }
//                 return applyTailwindClasses(domNode);
//                 // const modifiedElement = applyTailwindClasses(domNode);
//                 // return <>{domToReact([modifiedElement], parserOptions)}</>;
//             }
//         }
//     };

//     // Configuración para DOMPurify
//     const sanitizeConfig = {
//         ALLOWED_TAGS: styleConfig.map((config) => config.tag),
//         ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
//         ADD_CLASS: styleMap
//     };

//     const renderContent = () => {
//         console.log('response', response);
//         if (htmlRenderMethod === 'parser') {
//             return parse(response, parserOptions);
//         } else {
//             const sanitizedHtml = DOMPurify.sanitize(response, sanitizeConfig);
//             return parse(sanitizedHtml, parserOptions);
//         }
//     };

//     return (
//         <div className={twMerge('response-container', customClasses.container)}>
//             <span
//                 className={twMerge(
//                     'text-blue-600 font-medium',
//                     customClasses.prefix
//                 )}
//             >
//                 {prefix}
//             </span>
//             <div
//                 className={twMerge(
//                     'response-content mt-2',
//                     customClasses.content
//                 )}
//             >
//                 {renderContent()}
//             </div>
//         </div>
//     );
// };

// // Hook personalizado para manejar el contenido HTML con Tailwind
// export const useStyledHtmlContent = (
//     initialContent: string = '',
//     styleConfig: StyleConfig[] = defaultStyleConfig
// ) => {
//     const [content, setContent] = useState(initialContent);
//     const [styledContent, setStyledContent] = useState('');

//     useEffect(() => {
//         // Aplicar estilos al contenido
//         const styleMap = new Map(
//             styleConfig.map((config) => [config.tag, config.classes])
//         );

//         const parser = new DOMParser();
//         const doc = parser.parseFromString(content, 'text/html');

//         styleConfig.forEach(({ tag, classes }) => {
//             doc.querySelectorAll(tag).forEach((element) => {
//                 const existingClasses = element.getAttribute('class') || '';
//                 element.setAttribute(
//                     'class',
//                     twMerge(classes, existingClasses)
//                 );
//             });
//         });

//         setStyledContent(doc.body.innerHTML);
//     }, [content, styleConfig]);

//     return {
//         content,
//         styledContent,
//         setContent
//     };
// };
