import { FileUpload } from '@chakra-ui/react';
import type { FileChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/file-upload/namespace';
import { forwardRef, type ChangeEvent, type FC } from 'react';
import { MyButton, type ButtonProps } from './myButton';

interface Props {
    icon?: string;
    text?: string;
    accept?: string[];
    maxFiles?: number;
    maxFileSize?: number;
    showUploadList?: boolean;
    onChange?: (files: File[]) => void;
    onChangeEvent?: (event: ChangeEvent<HTMLInputElement>) => void;
    buttonStyle?: ButtonProps;
    isDisabled?: boolean;
    loading?: boolean;
}

export const MyFileUpload = forwardRef<HTMLInputElement, Props>(
    function MyFileUpload(props, ref) {
        const {
            icon = 'Upload',
            text = 'Upload file',
            accept = ['image/png'],
            maxFiles = 1,
            showUploadList = false,
            onChange = () => {},
            onChangeEvent = () => {},
            buttonStyle = {
                variant: 'outline',
                size: 'xs'
            },
            isDisabled = false,
            loading = false,
            ...rest
        } = props;

        const handledOnChange = (details: FileChangeDetails) => {
            onChange(details.acceptedFiles);
        };

        if (loading) {
            return (
                <MyButton {...buttonStyle} leftIcon={icon} loading={loading}>
                    {text}
                </MyButton>
            );
        }

        return (
            <FileUpload.Root
                accept={accept}
                maxFiles={maxFiles}
                disabled={isDisabled}
                onFileChange={handledOnChange}
            >
                <FileUpload.HiddenInput
                    ref={ref}
                    onChange={(e) => {
                        onChangeEvent(e);
                    }}
                />
                <FileUpload.Trigger asChild>
                    <MyButton {...buttonStyle} leftIcon={icon} {...rest}>
                        {text}
                    </MyButton>
                </FileUpload.Trigger>
                {showUploadList && <FileUpload.List showSize clearable />}
            </FileUpload.Root>
        );
    }
);

export const MyFileUpload1: FC<Props> = ({
    icon = 'Upload',
    text = 'Upload file',
    accept = ['image/png'],
    maxFiles = 1,
    showUploadList = false,
    onChange = () => {},
    onChangeEvent = () => {},
    buttonStyle = {
        variant: 'outline',
        size: 'xs'
    },
    isDisabled = false,
    loading = false
}) => {
    const handledOnChange = (details: FileChangeDetails) => {
        onChange(details.acceptedFiles);
    };

    if (loading) {
        return (
            <MyButton {...buttonStyle} leftIcon={icon} loading={loading}>
                {text}
            </MyButton>
        );
    }

    return (
        <FileUpload.Root
            accept={accept}
            maxFiles={maxFiles}
            disabled={isDisabled}
            onFileChange={handledOnChange}
        >
            <FileUpload.HiddenInput
                onChange={(e) => {
                    onChangeEvent(e);
                }}
            />
            <FileUpload.Trigger asChild>
                <MyButton {...buttonStyle} leftIcon={icon}>
                    {text}
                </MyButton>
            </FileUpload.Trigger>
            {showUploadList && <FileUpload.List showSize clearable />}
        </FileUpload.Root>
    );
};
