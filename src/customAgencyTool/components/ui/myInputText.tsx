import type { InputProps as ChakraInputProps } from '@chakra-ui/react';
import { Input as ChakraInput, InputGroup } from '@chakra-ui/react';
import { forwardRef, useMemo, type ReactNode } from 'react';

interface InputCustomProps {
    isDisabled?: boolean;
    startElement?: ReactNode;
    endElement?: ReactNode;

    startAddon?: ReactNode;
    endAddon?: ReactNode;
}

export interface InputProps extends ChakraInputProps, InputCustomProps {}

export const MyInputText = forwardRef<HTMLInputElement, InputProps>(
    function Input(props, ref) {
        const {
            isDisabled,
            startElement,
            endElement,
            startAddon,
            endAddon,
            ...rest
        } = props;

        // Memoizar la configuración del input
        const inputConfig = useMemo(() => {
            const hasElements = !!(startElement || endElement);
            const hasAddons = !!(startAddon || endAddon);

            return {
                hasElements,
                hasAddons
            };
        }, [startElement, endElement, startAddon, endAddon]);

        const styleInput: ChakraInputProps = {
            size: 'sm',
            variant: 'subtle'
        };

        if (inputConfig.hasElements) {
            return (
                <InputGroup startElement={startElement} endElement={endElement}>
                    <ChakraInput
                        ref={ref}
                        disabled={isDisabled}
                        {...styleInput}
                        ps={startElement ? '2rem' : '0'}
                        pe={endElement ? '2rem' : '1rem'}
                        {...rest}
                    />
                </InputGroup>
            );
        }

        if (inputConfig.hasAddons) {
            return (
                <InputGroup startAddon={startAddon} endAddon={endAddon}>
                    <ChakraInput
                        ref={ref}
                        disabled={isDisabled}
                        {...styleInput}
                        {...rest}
                    />
                </InputGroup>
            );
        }

        return (
            <ChakraInput
                ref={ref}
                disabled={isDisabled}
                {...styleInput}
                {...rest}
            />
        );
    }
);
