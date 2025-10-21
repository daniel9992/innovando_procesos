import type { InputProps as ChakraInputProps } from '@chakra-ui/react';
import { Input as ChakraInput, IconButton, InputGroup } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { forwardRef, useState } from 'react';

interface InputCustomProps {
    isDisabled?: boolean;
}

export interface InputProps extends ChakraInputProps, InputCustomProps {}

export const MyInputPassword = forwardRef<HTMLInputElement, InputProps>(
    function InputPassword(props, ref) {
        const { isDisabled, ...rest } = props;

        const [isVisible, setIsVisible] = useState(false);

        const styleInput: ChakraInputProps = {
            size: 'sm',
            variant: 'subtle'
        };

        return (
            <InputGroup
                endElement={
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setIsVisible(!isVisible)}
                        size={'xs'}
                        right={'0px'}
                        variant={'ghost'}
                        _hover={{
                            bg: 'rgba(0, 0, 0, 0.05)'
                        }}
                    >
                        {isVisible ? (
                            <SelectedIcons iconName={'Unlock'} />
                        ) : (
                            <SelectedIcons iconName={'Lock'} />
                        )}
                    </IconButton>
                }
            >
                <ChakraInput
                    ref={ref}
                    disabled={isDisabled}
                    type={isVisible ? 'text' : 'password'}
                    //ps={'0.8rem'}
                    //pe={'3rem'}
                    {...styleInput}
                    {...rest}
                />
            </InputGroup>
        );
    }
);
