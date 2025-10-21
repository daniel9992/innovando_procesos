import { Separator, type SeparatorProps } from '@chakra-ui/react';
import { type FC } from 'react';
import { useColorModeValue } from './color-mode';

type Props = SeparatorProps;

export const MyDivider: FC<Props> = (props) => {
    const colorMode = useColorModeValue('gray.300', 'gray.200');

    return (
        <Separator
            color={colorMode}
            size="md"
            bg={colorMode}
            flex="1"
            {...props}
        />
    );
};
