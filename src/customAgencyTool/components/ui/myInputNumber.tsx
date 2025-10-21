import {
    NumberInput as ChakraNumberInput,
    type NumberInputRootProps as ChakraNumberInputProps
} from '@chakra-ui/react';
import { forwardRef } from 'react';

interface InputCustomProps {
    isDisabled?: boolean;
}

export interface InputNumberProps
    extends ChakraNumberInputProps,
        InputCustomProps {}

export const MyInputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
    function InputNumber(props, ref) {
        const { isDisabled, textAlign, ...rest } = props;

        const styleInput: ChakraNumberInputProps = {
            size: 'sm',
            variant: 'subtle'
        };

        return (
            <ChakraNumberInput.Root
                {...styleInput}
                ref={ref}
                disabled={isDisabled}
                {...rest}
            >
                <ChakraNumberInput.Control />
                <ChakraNumberInput.Input textAlign={textAlign} />
            </ChakraNumberInput.Root>
        );
    }
);
