import { MyText } from '@src/customAgencyTool/components/ui';
import { useColorMode } from '@src/customAgencyTool/components/ui/color-mode';
import {
    isNumeric,
    parseNumber
} from '@src/customAgencyTool/utils/csv/utils.csv';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { GetRamdom } from '@src/customAgencyTool/utils/stringUtils/getRamdom';
import DOMPurify from 'dompurify';
import { type FC, type ReactNode, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import vs from 'react-syntax-highlighter/dist/esm/styles/prism/vs';
import vsDarkPlus from 'react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus';

import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import RemarkMathPlugin from 'remark-math';
import './showResponseMarkDown.css';

const HTMLCodeBlock: FC<{ content: string; divKey: string }> = ({
    content,
    divKey
}) => {
    return (
        <div>
            <div className="wrapper-header">
                <p>
                    <strong>HTML:</strong>
                </p>
                <button
                    className="wrapper-header"
                    onClick={() => copyToClipboard(divKey)}
                >
                    <SelectedIcons iconName={'COPY'} size={'16px'} />
                </button>
            </div>
            <div
                id={divKey}
                dangerouslySetInnerHTML={{
                    __html: content
                }}
            />
        </div>
    );
};

const CodeHeader: FC<{ language: string; divKey: string }> = ({
    language,
    divKey
}) => {
    return (
        <div className="wrapper-header">
            <p className="wrapper-header">{language}</p>
            <button
                className="wrapper-header"
                onClick={() => copyToClipboard(divKey)}
            >
                <SelectedIcons iconName={'COPY'} size={'16px'} />
            </button>
        </div>
    );
};

// types.ts
export interface ShowResponseMarkDownProps {
    response: string | undefined;
}

// utils/clipboard.ts
export const copyToClipboard = async (elementID: string): Promise<void> => {
    const element = document.getElementById(elementID);
    if (!element) return;

    try {
        await navigator.clipboard.writeText(element.innerText);
        console.log('Content copied to clipboard');
    } catch (err) {
        console.error('Error copying to clipboard:', err);
    }
};

// components/CodeBlock.tsx
interface CodeBlockProps {
    children: ReactNode;
    className?: string;
    colorMode: string;
}

export const CodeBlock: FC<CodeBlockProps> = ({
    children,
    className,
    colorMode
}) => {
    const divKey = GetRamdom();
    const match = /language-(\w+)/.exec(className || '');

    if (!match) {
        return <code className={className}>{children}</code>;
    }

    const language = match[1];

    if (language === 'html') {
        return <HTMLCodeBlock content={children as string} divKey={divKey} />;
    }

    if (language === 'markdown') {
        return <ShowResponseMarkDown response={children as string} />;
    }

    // Mermaid - no funciona con la configuracion actual
    // if (language === 'mermaid') {
    //     return <MermaidChart code={children as string} />;
    // }

    // return (
    // <MyCodeBlock
    //     title={language}
    //     language={language}
    //     code={children as string}
    // />
    // );

    return (
        <>
            <CodeHeader language={language} divKey={divKey} />
            <SyntaxHighlighter
                style={colorMode === 'dark' ? vsDarkPlus : vs}
                language={language}
                PreTag="div"
                id={divKey}
                showLineNumbers={true}
                wrapLines={true}
            >
                {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
        </>
    );
};

// components/TableCell.tsx
export const TableCell: FC<{ children: ReactNode }> = ({ children }) => {
    const content = useMemo(() => {
        if (typeof children === 'string') {
            return isNumeric(children)
                ? `${parseNumber(children)}`.replace('.', ',')
                : children;
        }

        if (Array.isArray(children)) {
            return children
                .filter((child): child is string => typeof child === 'string')
                .join('\t');
        }

        return '';
    }, [children]);

    return <td className="px-6 py-4 whitespace-pre-line">{content}</td>;
};

// Main component
const ShowResponseMarkDown: FC<ShowResponseMarkDownProps> = ({
    response = ''
}) => {
    const { colorMode } = useColorMode();

    const sanitizedContent = useMemo(() => {
        if (!response) return '';
        return DOMPurify.sanitize(response);
    }, [response]);

    return (
        <div className="markdown-content">
            <MyText fontSize={'0.8rem'} color={'gray'}>
                <strong>IA:</strong>
            </MyText>
            <ReactMarkdown
                skipHtml={true}
                remarkPlugins={[
                    [remarkGfm, { singleTilde: false }],
                    RemarkMathPlugin
                ]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                    a: (props) => (
                        <a href={props.href} target="_blank" rel="noreferrer">
                            {props.children}
                        </a>
                    ),
                    table: (props) => {
                        const tableKey = GetRamdom();
                        return (
                            <div>
                                <CodeHeader language={'-'} divKey={tableKey} />
                                <div className="table-container relative overflow-x-auto my-4">
                                    {/* <button
                                    className="copy-button"
                                    onClick={() => copyToClipboard(tableKey)}
                                >
                                    📋 Copiar
                                </button> */}
                                    <table
                                        {...props}
                                        key={tableKey}
                                        id={tableKey}
                                        className="min-w-full divide-y divide-gray-200"
                                    />
                                </div>
                            </div>
                        );
                    },
                    td: (props) => <TableCell>{props.children}</TableCell>,
                    code: (props) => (
                        <CodeBlock
                            colorMode={colorMode}
                            className={props.className}
                        >
                            {props.children}
                        </CodeBlock>
                    )
                }}
            >
                {sanitizedContent}
            </ReactMarkdown>
        </div>
    );
};

export default ShowResponseMarkDown;

// import { MyText } from '@src/customAgencyTool/components/ui';
// import { useColorMode } from '@src/customAgencyTool/components/ui/color-mode';
// import {
//     isNumeric,
//     parseNumber
// } from '@src/customAgencyTool/utils/csv/utils.csv';
// import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
// import { GetRamdom } from '@src/customAgencyTool/utils/stringUtils/getRamdom';
// import DOMPurify from 'dompurify';
// import { type FC, useMemo } from 'react';
// import ReactMarkdown from 'react-markdown';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';
// import rehypeKatex from 'rehype-katex';
// import rehypeRaw from 'rehype-raw';
// import remarkGfm from 'remark-gfm';
// import RemarkMathPlugin from 'remark-math';
// import './showResponseMarkDown.css';

// interface ShowResponseMarkDownProps {
//     response: string | undefined;
// }

// const ShowResponseMarkDown: FC<ShowResponseMarkDownProps> = ({
//     response = ''
// }) => {
//     const { colorMode } = useColorMode();

//     const handleCopyElementByID = (elementID: string) => {
//         const tableElement = document.getElementById(elementID);
//         if (!tableElement) return;

//         // copiar al portapapeles
//         navigator.clipboard
//             .writeText(tableElement.innerText)
//             .then(() => {
//                 // Opcional: Mostrar feedback al usuario
//                 //alert('Tabla copiada al portapapeles');
//                 console.log('Tabla copiada al portapapeles');
//             })
//             .catch((err) => {
//                 console.error('Error al copiar la tabla:', err);
//             });
//     };
//     // const handleCopyTable = (tableElement: HTMLTableElement) => {
//     //     const rows = tableElement.getElementsByTagName('tr');
//     //     let tableText = '';

//     //     for (let i = 0; i < rows.length; i++) {
//     //         const cells =
//     //             rows[i].getElementsByTagName('td').length > 0
//     //                 ? rows[i].getElementsByTagName('td')
//     //                 : rows[i].getElementsByTagName('th');

//     //         for (let j = 0; j < cells.length; j++) {
//     //             tableText += cells[j].innerText;
//     //             if (j < cells.length - 1) tableText += '\t';
//     //         }
//     //         tableText += '\n';
//     //     }

//     //     navigator.clipboard
//     //         .writeText(tableText)
//     //         .then(() => {
//     //             // Opcional: Mostrar feedback al usuario
//     //             alert('Tabla copiada al portapapeles');
//     //         })
//     //         .catch((err) => {
//     //             console.error('Error al copiar la tabla:', err);
//     //         });
//     // };

//     const sanitizedContent = useMemo(() => {
//         if (!response) return '';

//         const purified = DOMPurify.sanitize(response);

//         return purified;
//     }, [response]);

//     return (
//         <div className="markdown-content">
//             <MyText fontSize={'0.8rem'} color={'gray'}>
//                 <strong>IA:</strong>
//             </MyText>
//             <ReactMarkdown
//                 skipHtml={true}
//                 remarkPlugins={[
//                     [remarkGfm, { singleTilde: false }],
//                     RemarkMathPlugin
//                 ]}
//                 rehypePlugins={[rehypeRaw, rehypeKatex]}
//                 components={{
//                     a: (props) => (
//                         <a href={props.href} target="_blank" rel="noreferrer">
//                             {props.children}
//                         </a>
//                     ),
//                     table: ({ ...props }) => {
//                         const tableKey = GetRamdom();
//                         return (
//                             <div className="table-container relative overflow-x-auto my-4">
//                                 <button
//                                     className="copy-button"
//                                     onClick={() => {
//                                         handleCopyElementByID(tableKey);
//                                     }}
//                                 >
//                                     📋 Copiar
//                                 </button>
//                                 <table
//                                     {...props}
//                                     key={tableKey}
//                                     id={tableKey}
//                                     className="min-w-full divide-y divide-gray-200"
//                                 />
//                             </div>
//                         );
//                     },
//                     td: ({ children }) => {
//                         let toShow = '';

//                         if (typeof children === 'string') {
//                             if (isNumeric(children)) {
//                                 toShow = `${parseNumber(children)}`.replace(
//                                     '.',
//                                     ','
//                                 );
//                             } else {
//                                 toShow = children;
//                             }
//                         }

//                         if (Array.isArray(children)) {
//                             children.map((child) => {
//                                 if (typeof child === 'string') {
//                                     // \n a la hora de exportar a excel no funciona
//                                     toShow += child + '\t';
//                                 }
//                             });
//                         }

//                         return (
//                             <td className="px-6 py-4 whitespace-pre-line">
//                                 {toShow}
//                             </td>
//                         );
//                     },
//                     // code(props) {
//                     //     const { children, className, node, ...rest } = props;
//                     //     const match = /language-(\w+)/.exec(className || '');

//                     //     console.log('className', className); //className language-typescript
//                     //     console.log('match', match); // Array [ "language-typescript", "typescript" ]

//                     //     return match ? (
//                     //         <SyntaxHighlighter
//                     //             {...rest}
//                     //             PreTag="div"
//                     //             children={String(children).replace(/\n$/, '')}
//                     //             language={match[1]}
//                     //             style={colorMode === 'dark' ? dark : prism}
//                     //         />
//                     //     ) : (
//                     //         <code {...rest} className={className}>
//                     //             {children}
//                     //         </code>
//                     //     );
//                     // }
//                     code(props) {
//                         const {
//                             children,
//                             className
//                             //   node, inline, ...rest
//                         } = props;

//                         const divKey = GetRamdom();

//                         const match = /language-(\w+)/.exec(className || '');

//                         // if match = remark-gfm

//                         // if match = html
//                         if (match && match[1] === 'html') {
//                             // if a table not inserted
//                             const isTable = children
//                                 ?.toString()
//                                 .includes('<table');
//                             if (isTable) {
//                                 return (
//                                     <>
//                                         <div className="wrapper-header">
//                                             <p className="wrapper-header">
//                                                 {match[1]}
//                                             </p>
//                                             <button
//                                                 className="wrapper-header"
//                                                 onClick={() => {
//                                                     handleCopyElementByID(
//                                                         divKey
//                                                     );
//                                                 }}
//                                             >
//                                                 <SelectedIcons
//                                                     iconName={'COPY'}
//                                                     size={'16px'}
//                                                 />
//                                             </button>
//                                         </div>
//                                         <div
//                                             dangerouslySetInnerHTML={{
//                                                 __html: children as string
//                                             }}
//                                         />
//                                         ;
//                                     </>
//                                 );
//                             }
//                         }

//                         if (match && match[1] === 'markdown') {
//                             return (
//                                 <>
//                                     <ShowResponseMarkDown
//                                         response={children as string}
//                                     />
//                                 </>
//                             );
//                         }

//                         return match ? (
//                             <>
//                                 <div className="wrapper-header">
//                                     <p className="wrapper-header">{match[1]}</p>
//                                     <button
//                                         className="wrapper-header"
//                                         onClick={() => {
//                                             handleCopyElementByID(divKey);
//                                         }}
//                                     >
//                                         <SelectedIcons
//                                             iconName={'COPY'}
//                                             size={'16px'}
//                                         />
//                                     </button>
//                                 </div>
//                                 <SyntaxHighlighter
//                                     children={String(children).replace(
//                                         /\n$/,
//                                         ''
//                                     )}
//                                     style={colorMode === 'dark' ? dark : prism}
//                                     language={match[1]}
//                                     PreTag="div"
//                                     id={divKey}
//                                     // {...props}
//                                 />
//                             </>
//                         ) : (
//                             <code className={className} {...props}>
//                                 {children}
//                             </code>
//                         );
//                     }
//                     // td: ({ children }) => {
//                     //     return (
//                     //         <td className="px-6 py-4 whitespace-pre-line">
//                     //             {children}
//                     //         </td>
//                     //     );
//                     // },
//                     // th: ({ children }) => (
//                     //     <th className="px-6 py-3 whitespace-pre-line">
//                     //         {children}
//                     //     </th>
//                     // )
//                 }}
//             >
//                 {sanitizedContent}
//             </ReactMarkdown>
//         </div>
//     );
// };

// export default ShowResponseMarkDown;

// /**
// https://github.com/hjslovehr/Compute-Books/blob/master/API%20Design%20Patterns-JJ%20Geewax-Manning.pdf
// https://refactoring.guru/es/design-patterns
// https://www.youtube.com/watch?v=0pL9-R5Pa00
//  *
//  */
