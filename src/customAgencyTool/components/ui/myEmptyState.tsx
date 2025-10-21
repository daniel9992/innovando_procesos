import { EmptyState, VStack } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { FC } from 'react';

interface Props {
    icon?: string;
    title?: string;
    description?: string;
}

export const MyEmptyState: FC<Props> = ({
    icon = 'CART',
    title,
    description
}) => {
    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <SelectedIcons iconName={icon} size="5rem" />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>{title}</EmptyState.Title>
                    <EmptyState.Description>
                        {description}
                    </EmptyState.Description>
                </VStack>
            </EmptyState.Content>
        </EmptyState.Root>
    );
};
