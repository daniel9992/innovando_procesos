import type { TextareaProps as ChakraTextareaProps } from '@chakra-ui/react';
import { Textarea as ChakraTextarea } from '@chakra-ui/react';
import { forwardRef } from 'react';

interface InputCustomProps {
    isDisabled?: boolean;
}

export interface InputTextAreaProps
    extends ChakraTextareaProps,
        InputCustomProps {}

export const MyTextArea = forwardRef<HTMLTextAreaElement, InputTextAreaProps>(
    function TextArea(props, ref) {
        const { isDisabled, ...rest } = props;

        const styleInput: ChakraTextareaProps = {
            size: 'sm',
            variant: 'subtle',
            resize: 'vertical',
            minHeight: '100px',
            transition: 'all 0.2s'
        };

        return (
            <ChakraTextarea
                ref={ref}
                disabled={isDisabled}
                {...styleInput}
                {...rest}
            />
        );
    }
);
