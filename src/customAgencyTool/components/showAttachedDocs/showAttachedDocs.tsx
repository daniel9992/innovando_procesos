import {
    MyButton,
    MyFlex,
    MyHeading,
    MyImage,
    MyText
} from '@src/customAgencyTool/components/ui';
import type { FileMetadataLight } from '@src/customAgencyTool/features/storageFiles/domain/fileUploadState';
import { DayToDayFormat } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { toFixedNumber } from '@src/customAgencyTool/utils/numberOperator/toFixNumber';
import axios from 'axios';
import type { CellHyperlinkValue, CellRichTextValue, CellValue } from 'exceljs';
import ExcelJS from 'exceljs';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type FC,
    type ReactNode
} from 'react';
import Spreadsheet, { type CellBase, type Matrix } from 'react-spreadsheet';
// import type { InterfaceDocData } from '../../../domain/attachedDocs/attachedDocs';

interface Props {
    selectedItem?: FileMetadataLight;
}

const ShowAttachedDocs: FC<Props> = ({ selectedItem }) => {
    if (!selectedItem)
        return (
            <MyFlex
                //
                flex={2}
                direction={'column'}
                bento
                minH={'80vh'}
                justifyContent={'center'}
                align={'center'}
            >
                <SelectedIcons iconName="File" size={'40px'} />
                <p>Seleccione un archivo para ver su contenido.</p>
            </MyFlex>
        );

    //https://github.com/Alcumus/react-doc-viewer#readme

    return (
        <MyFlex
            //
            direction={'column'}
            p={0}
            height={'80vh'}
            overflow={'auto'}
            position={'relative'}
        >
            <MyText
                position={'absolute'}
                bottom={4}
                right={3}
                color={'gray'}
                fontSize={'0.8rem'}
            >
                Selected Item: {selectedItem?.name}
            </MyText>

            {['png', 'jpg', 'jpeg', 'gif'].includes(
                selectedItem.name.split('.')[1]
            ) && <ShowImage selectedItem={selectedItem} />}

            {['pdf'].includes(selectedItem.name.split('.')[1]) && (
                <PDFViewer url={selectedItem.url} name={selectedItem.name} />
            )}

            {['mp4', 'mov', 'avi', 'webm'].includes(
                selectedItem.name.split('.')[1]
            ) && (
                <VideoViewer url={selectedItem.url} name={selectedItem.name} />
            )}

            {['mp3', 'wav', 'ogg'].includes(
                selectedItem.name.split('.')[1]
            ) && (
                <AudioViewer url={selectedItem.url} name={selectedItem.name} />
            )}

            {['txt', 'md', 'html'].includes(
                selectedItem.name.split('.')[1]
            ) && <TextViewer url={selectedItem.url} name={selectedItem.name} />}

            {['xlsx', 'xls'].includes(selectedItem.name.split('.')[1]) && (
                <ShowWorkSheet
                    url={selectedItem.url}
                    name={selectedItem.name}
                />
            )}
        </MyFlex>
    );
};

export default ShowAttachedDocs;

/**
 *  ? -----------------------------
 *  * Image
 *  ? -----------------------------
 */
interface ImageProps {
    selectedItem: FileMetadataLight;
}

const ShowImage: FC<ImageProps> = ({ selectedItem }) => {
    return (
        <MyImage
            src={selectedItem.url}
            alt={selectedItem.name}
            width={'100%'}
            height={'100%'}
            objectFit={'contain'}
        />
    );
};

/**
 *  ? -----------------------------
 *  * PDFViewer
 *  ? -----------------------------
 */
const PDFViewer: FC<{ url: string; name: string }> = ({ url, name }) => (
    <iframe
        src={url}
        style={{ width: '100%', height: '100%' }}
        title={`pdf-${name}`}
    ></iframe>
);

/**
 *  ? -----------------------------
 *  * VideoViewer
 *  ? -----------------------------
 */
const VideoViewer: FC<{ url: string; name: string }> = ({ url, name }) => (
    <video
        key={name}
        autoPlay
        controls
        style={{ width: '100%', height: '100%' }}
    >
        <source src={url} type="video/mp4" />
        Sorry, your browser doesn't support embedded videos.
    </video>
);

/**
 *  ? -----------------------------
 *  * AudioViewer
 *  ? -----------------------------
 */
const AudioViewer: React.FC<{ url: string; name: string }> = ({
    url,
    name
}) => (
    <audio key={name} controls style={{ width: '100%' }}>
        <source src={url} type="audio/mpeg" />
        Sorry, your browser doesn't support embedded audios.
    </audio>
);

/**
 *  ? -----------------------------
 *  * TextViewer
 *  ? -----------------------------
 */
const TextViewer: FC<{ url: string; name: string }> = ({ url, name }) => {
    const [textContent, setTextContent] = useState<string>('');

    useEffect(() => {
        const fetchText = async () => {
            try {
                const response = await fetch(url);
                const text = await response.text();
                setTextContent(text);
            } catch (error) {
                console.error('Error loading text content:', error);
            }
        };

        fetchText();
    }, [url]);

    return (
        <pre
            key={name}
            style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                height: '100%',
                overflow: 'auto'
            }}
        >
            {textContent}
        </pre>
    );
};

/**
 *  ? -----------------------------
 *  * Show work sheet
 *  ? -----------------------------
 */
const ShowWorkSheet: FC<{ url: string; name: string }> = ({ url, name }) => {
    const flexRef = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState(true);

    const [worksheets, setWorksheets] = useState<Array<ExcelJS.Worksheet>>([]);

    const [selectedWorksheetIndex, setSelectedWorksheetIndex] = useState(0);

    const [selectedWorkSheetNode, setSelectedWorkSheetNode] =
        useState<ReactNode>(<></>);

    useEffect(() => {
        if (!url) {
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                    headers: {
                        'Content-Type':
                            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                });

                const workbook = new ExcelJS.Workbook();
                await workbook.xlsx.load(response.data);
                setWorksheets(workbook.worksheets);
            } catch (error) {
                console.error('Error reading Excel file:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [url]);

    interface CellErrorValue {
        error:
            | '#N/A'
            | '#REF!'
            | '#NAME?'
            | '#DIV/0!'
            | '#NULL!'
            | '#VALUE!'
            | '#NUM!';
    }
    interface CellSharedFormulaValue {
        sharedFormula: string;
        readonly formula?: string;
        result?: number | string | boolean | Date | CellErrorValue;
        date1904?: boolean;
    }

    const parseCellValue = useCallback((item: CellValue | string): CellBase => {
        console.log(item);
        if (item === null || item === undefined) {
            return { value: '' };
        }
        if (typeof item === 'string') {
            return { value: item.trim() };
        }
        if (typeof item === 'number') {
            return { value: `${item}` };
        }
        if (typeof item === 'boolean') {
            return { value: item ? 'Sí' : 'No' };
        }
        if (item instanceof Date) {
            return { value: DayToDayFormat(item).toUTCString() };
        }
        if ('hyperlink' in item) {
            const hyperlinkValue = item as CellHyperlinkValue;
            return { value: hyperlinkValue.text.trim() };
        }
        if ('formula' in item) {
            const sharedFormulaValue = item as CellSharedFormulaValue;

            let result = sharedFormulaValue.result
                ? sharedFormulaValue.result
                : '';

            if (typeof result === 'number') {
                result = toFixedNumber(result, 2);
            }

            return {
                value: result
            };
        }
        //{"richText":[{"font":{"size":10,"name":"Arial"},"text":"jQfflBMEM"}]}
        if ('richText' in item) {
            const richTextValue = item as CellRichTextValue;
            return {
                value: richTextValue.richText
                    .map((richTextItem) => {
                        return richTextItem.text;
                    })
                    .join(' ')
            };
        }

        return {
            value: JSON.stringify(item)
        };
    }, []);

    useEffect(() => {
        if (
            selectedWorksheetIndex < 0 ||
            selectedWorksheetIndex >= worksheets.length
        ) {
            return;
        }

        const worksheet = worksheets[selectedWorksheetIndex];

        const matrix: Matrix<CellBase> = [];

        worksheet.eachRow((row) => {
            if (!row.values) return;

            if (!Array.isArray(row.values)) return;

            // header

            // body
            const arrayRow: Array<CellBase> = row.values
                .filter((cell) => cell !== undefined)
                .map(parseCellValue);

            matrix.push(arrayRow);
        });

        setSelectedWorkSheetNode(<Spreadsheet data={matrix} />);
    }, [selectedWorksheetIndex, worksheets, parseCellValue]);

    if (isLoading) {
        return (
            <div>
                <p>Loading ...</p>
            </div>
        );
    }

    return (
        <MyFlex ref={flexRef} direction={'column'} gap={2}>
            <MyHeading size={'sm'} fontWeight={'semibold'} color={'gray.600'}>
                {name}
            </MyHeading>
            <div
                style={{
                    height: '65vh',
                    border: '1px solid #ccc',
                    overflow: 'auto'
                }}
                // style={{
                // 	width: '100%',
                // 	height: '100%',
                // 	maxWidth: '50vw',
                // 	maxHeight: '80vh',
                // 	overflow: 'auto',
                // 	border: '1px solid #ccc',
                // }}
            >
                {selectedWorkSheetNode}
            </div>

            <MyFlex direction={'row'}>
                {worksheets.map((worksheet, index) => (
                    <MyButton
                        key={index}
                        onClick={() => setSelectedWorksheetIndex(index)}
                        size={'xs'}
                        variant={'ghost'}
                    >
                        {worksheet.name}
                    </MyButton>
                ))}
            </MyFlex>
        </MyFlex>
    );
};
