import 'quill/dist/quill.snow.css';
import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Definir los tamaños de fuente
// const fontSizeArr = [
//     '8',
//     '9',
//     '10',
//     '11',
//     '12',
//     '14',
//     '16',
//     '18',
//     '20',
//     '24',
//     '30',
//     '36'
// ];

// Custom Fonts Size Class
// const CustomSize: any = ReactQuill.Quill.import('attributors/class/size');
// CustomSize.whitelist = fontSizeArr;
// ReactQuill.Quill.register(CustomSize, true);

// Definir colores
const colors = [
    '#000000',
    '#e60000',
    '#ff9900',
    '#ffff00',
    '#008a00',
    '#0066cc',
    '#9933ff',
    '#ffffff',
    '#facccc',
    '#ffebcc',
    '#ffffcc',
    '#cce8cc'
];

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote'],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ color: colors }],
    ['clean']

    // ['bold', 'italic', 'underline', 'strike'],
    // ['blockquote'],
    // [{ align: [] }],
    // [{ list: 'ordered' }, { list: 'bullet' }],
    // [{ script: 'sub' }, { script: 'super' }],
    // [{ indent: '-1' }, { indent: '+1' }],
    // [{ size: fontSizeArr }],
    // [{ color: colors }],
    // ['clean']
];

interface TextEditorProps {
    text: string;
    setText: (text: string) => void;
    height?: string;
    placeholder?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
    text,
    setText,
    height = '60vh',
    placeholder = 'Escriba aquí su texto'
}) => {
    const modules = {
        toolbar: toolbarOptions
    };

    // const formats = [
    //     'bold',
    //     'italic',
    //     'underline',
    //     'strike',
    //     'blockquote',
    //     'align',
    //     'list',
    //     //'bullet',
    //     'script',
    //     'indent',
    //     'size',
    //     'color'
    // ];

    const handleContenidoChange = (value: string) => {
        setText(value);
    };

    return (
        <div
            style={{
                height,
                width: '100%',
                zIndex: 10,
                marginBottom: '2rem'
            }}
        >
            <ReactQuill
                theme="snow"
                value={text}
                placeholder={placeholder}
                modules={modules}
                // formats={formats} // -> cambia el formato del texto de entrada
                onChange={handleContenidoChange}
                style={{
                    height: height,
                    marginBottom: '40px'
                }}
            />
        </div>
    );
};

//  <style>
//      {`
//                     /* Estilos para los tamaños de fuente */
//                     ${fontSizeArr
//                         .map(
//                             (size) => `
//                         .ql-snow .ql-size.ql-picker .ql-picker-item[data-value="${size}"]::before,
//                         .ql-snow .ql-size.ql-picker .ql-picker-label[data-value="${size}"]::before {
//                             content: "${size}px" !important;

//                         }
//                     `
//                         )
//                         .join('\n')}

//                     /* Estilos para el texto en el editor */
//                     ${fontSizeArr
//                         .map(
//                             (size) => `
//                         .ql-snow .ql-size-${size} {
//                             font-size: ${size}px !important;
//                         }
//                     `
//                         )
//                         .join('\n')}

//                 `}
//  </style>;

export default TextEditor;

// import 'quill/dist/quill.snow.css';
// import React from 'react';
// import ReactQuill from 'react-quill-new';
// import 'react-quill-new/dist/quill.snow.css'; // Importante: importa los estilos CSS

// const toolbarOptions = [
// ['bold', 'italic', 'underline', 'strike'],
// ['blockquote'],
// [{ align: [] }],
// [{ list: 'ordered' }, { list: 'bullet' }],
// [{ script: 'sub' }, { script: 'super' }],
// [{ indent: '-1' }, { indent: '+1' }],
// [{ size: ['small', false, 'large', 'huge'] }],
// ['clean']
// ];

// interface TextEditorProps {
//     text: string;
//     setText: (text: string) => void;

//     height?: string;
//     placeholder?: string;
// }

// const TextEditor: React.FC<TextEditorProps> = ({
//     text,
//     setText,
//     height = '60vh',
//     placeholder = 'Escriba aquí su texto'
// }) => {
//     const modules = {
//         toolbar: toolbarOptions
//     };

//     const handleContenidoChange = (value: string) => {
//         setText(value);
//     };

//     return (
//         <div
//             style={{
//                 height,
//                 width: '100%',
//                 zIndex: 10,
//                 marginBottom: '2rem'
//             }}
//         >
//             <ReactQuill
//                 theme="snow" // 'snow' es uno de los temas más populares.
//                 value={text} // 3. El valor del editor está enlazado al estado 'contenido'.
//                 placeholder={placeholder}
//                 modules={modules}
//                 onChange={handleContenidoChange} // 4. Cada cambio llama a handleContenidoChange, que actualiza el estado.
//                 style={{ height: height, marginBottom: '40px' }}
//             />
//         </div>
//     );
// };

// export default TextEditor;
