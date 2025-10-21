import {
    Editable,
    IconButton,
    type EditableRootProps as ChakraEditableProps
} from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { forwardRef } from 'react';

interface InputCustomProps {
    isDisabled?: boolean;
    type?: 'text' | 'textarea';
    withButton?: boolean;
}

export interface InputProps
    extends ChakraEditableProps,
        InputCustomProps {}

export const MyInputTextEdit = forwardRef<HTMLInputElement, InputProps>(
    function InputTextEdit(props, ref) {
        const {
            isDisabled,
            type = 'text',
            withButton = false,
            ...rest
        } = props;

        const styleInput: ChakraEditableProps = {
            size: 'sm'
        };

        if (withButton) {
            return (
                <Editable.Root
                    ref={ref}
                    disabled={isDisabled}
                    {...styleInput}
                    {...rest}
                >
                    <Editable.Preview />
                    {type === 'text' && <Editable.Input />}
                    {type === 'textarea' && <Editable.Textarea />}
                    <Editable.Control>
                        <Editable.EditTrigger asChild>
                            <IconButton variant="ghost" size="xs">
                                <SelectedIcons iconName={'Pencil'} />
                            </IconButton>
                        </Editable.EditTrigger>
                        <Editable.SubmitTrigger asChild>
                            <IconButton variant="outline" size="xs">
                                <SelectedIcons iconName={'Check'} />
                            </IconButton>
                        </Editable.SubmitTrigger>
                    </Editable.Control>
                </Editable.Root>
            );
        }

        return (
            <Editable.Root
                ref={ref}
                disabled={isDisabled}
                {...styleInput}
                {...rest}
            >
                <Editable.Preview />
                {type === 'text' && <Editable.Input />}
                {type === 'textarea' && <Editable.Textarea />}
            </Editable.Root>
        );
    }
);
