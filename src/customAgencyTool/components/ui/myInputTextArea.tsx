import type { TextareaProps } from '@chakra-ui/react';
import { InputGroup, Textarea } from '@chakra-ui/react';
import { forwardRef, useMemo, type ReactNode } from 'react';

const DEFAULT_PADDING = '0.8rem'; // 1rem
const ELEMENT_PADDING = '0';

const BASE_STYLE: TextareaProps = {
    size: 'sm',
    variant: 'subtle'
};

interface InputCustomProps {
    isDisabled?: boolean;
    startElement?: ReactNode;
    endElement?: ReactNode;
    startAddon?: ReactNode;
    endAddon?: ReactNode;
}

export type InputTextAreaProps = TextareaProps & InputCustomProps;

const validateProps = (props: InputTextAreaProps) => {
    if (props.startElement && props.startAddon) {
        console.warn(
            'MyInputTextArea: Using both startElement and startAddon might cause layout issues'
        );
    }
    if (props.endElement && props.endAddon) {
        console.warn(
            'MyInputTextArea: Using both endElement and endAddon might cause layout issues'
        );
    }
};

export const MyInputTextArea = forwardRef<
    HTMLTextAreaElement,
    InputTextAreaProps
>(function MyInputTextArea(
    {
        isDisabled,
        startElement,
        endElement,
        startAddon,
        endAddon,
        ...rest
    },
    ref
) {
    validateProps({
        startElement,
        endElement,
        startAddon,
        endAddon,
        ...rest
    });

    const { paddingStart, paddingEnd } = useMemo(
        () => ({
            paddingStart: startElement ? ELEMENT_PADDING : DEFAULT_PADDING,
            paddingEnd: endElement ? ELEMENT_PADDING : DEFAULT_PADDING
        }),
        [startElement, endElement]
    );

    const shouldWrapInGroup =
        startElement || endElement || startAddon || endAddon;

    const textarea = (
        <Textarea
            ref={ref}
            disabled={isDisabled}
            ps={paddingStart}
            pe={paddingEnd}
            {...BASE_STYLE}
            {...rest}
        />
    );

    if (!shouldWrapInGroup) {
        return textarea;
    }

    return (
        <InputGroup
            startElement={startElement}
            endElement={endElement}
            startAddon={startAddon}
            endAddon={endAddon}
        >
            {textarea}
        </InputGroup>
    );
});

MyInputTextArea.displayName = 'MyInputTextArea';
