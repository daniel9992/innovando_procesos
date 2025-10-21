import { FormatNumber, Text, type TextProps } from '@chakra-ui/react';
import type { FC } from 'react';

interface InputCustomProps extends TextProps {
    isNumeric?: boolean;
}

export const MyText: FC<InputCustomProps> = ({
    children,
    isNumeric,
    ...props
}) => {
    if (isNumeric) {
        return (
            <Text m={0} p={0} as="span" {...props}>
                <FormatNumber value={children as number} />
            </Text>
        );
    }

    return (
        <Text m={0} p={0} {...props}>
            {children}
        </Text>
    );
};
