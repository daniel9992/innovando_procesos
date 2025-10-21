import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import type { FileDataPart, InlineDataPart } from 'firebase/ai';
import { memo, useCallback, type FC } from 'react';
import ShowIconByMINEType from './showIconByMINEType';

interface ShorFilePartsProps {
    inlineParts?: InlineDataPart[];
    filesParts?: FileDataPart[];
    isLoading?: boolean;
    onSelectFile?: (
        inlineParts: InlineDataPart | undefined,
        filesParts: FileDataPart | undefined
    ) => void;
}

const ShorFilePartsToMemo: FC<ShorFilePartsProps> = ({
    inlineParts = [],
    filesParts = [],
    isLoading = false,
    onSelectFile = () => {}
}) => {
    const handledOnClick = useCallback(
        (
            inlineParts: InlineDataPart | undefined,
            filesParts: FileDataPart | undefined
        ) => {
            onSelectFile(inlineParts, filesParts);
        },
        [onSelectFile]
    );

    const ExtractFileName = useCallback((fileUri: string) => {
        const fileName = fileUri.split('/').pop();
        return fileName;
    }, []);

    return (
        <MyFlex direction={'row'} flexWrap={'wrap'} gap={2} p={0}>
            <MyFlex width={'114.1px'} p={0} align={'center'}>
                {isLoading ? (
                    <>
                        <LoadingWithText text={'Generando...'} size={'xs'} />
                    </>
                ) : (
                    <MyText
                        fontSize={'0.8rem'}
                        color={'gray'}
                        fontWeight={'semibold'}
                    >
                        Archivos adjuntos:
                    </MyText>
                )}
            </MyFlex>

            <MyFlex flexWrap={'wrap'} gap={2} p={0} align={'center'}>
                {inlineParts.map((inlinePart, index) => (
                    <MyFlex
                        key={`key-file-${index}`}
                        direction={'row'}
                        gap={2}
                        align={'center'}
                        p={0}
                    >
                        <MyText
                            fontSize={'0.8rem'}
                            color={'gray'}
                            cursor={'pointer'}
                            onClick={() => {
                                handledOnClick(inlinePart, undefined);
                            }}
                            _hover={{
                                textDecoration: 'underline'
                            }}
                            borderRadius={'10px'}
                            bg={'gray.100'}
                            px={2}
                        >
                            {ExtractFileName(inlinePart.inlineData.data)}
                        </MyText>
                    </MyFlex>
                ))}
                {filesParts.map((filePart, index) => (
                    <MyFlex
                        key={`key-file-${index}`}
                        direction={'row'}
                        gap={2}
                        align={'center'}
                        p={0}
                        px={2}
                        bg={'bg.muted'}
                        cursor={'pointer'}
                        onClick={() => {
                            handledOnClick(undefined, filePart);
                        }}
                        _hover={{
                            textDecoration: 'underline'
                        }}
                    >
                        <ShowIconByMINEType
                            mineType={filePart.fileData.mimeType}
                            size={'0.8rem'}
                        />
                        <MyText
                            maxWidth={'130px'}
                            fontSize={'0.8rem'}
                            truncate={true}
                        >
                            {ExtractFileName(filePart.fileData.fileUri)}
                        </MyText>
                    </MyFlex>
                ))}
            </MyFlex>
        </MyFlex>
    );
};

const ShorFileParts = memo(ShorFilePartsToMemo);

export default ShorFileParts;
