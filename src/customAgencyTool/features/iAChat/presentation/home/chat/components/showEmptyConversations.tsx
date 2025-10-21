import Logo from '@assets/_logo/logo';
import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { FC } from 'react';

interface ShowEmptyConversationsProps {
    enableToShow: boolean;
}

const EmptyStateText = ({
    children,
    ...props
}: { children: React.ReactNode } & React.ComponentProps<typeof MyText>) => (
    <MyText color="gray" textAlign="center" {...props}>
        {children}
    </MyText>
);

const ShowEmptyConversations: FC<ShowEmptyConversationsProps> = ({
    enableToShow
}) => {
    if (!enableToShow) return null;

    return (
        <MyFlex
            direction="column"
            justifyContent="center"
            align="center"
            h="100%"
            p={4}
            gap={6}
            position="relative"
        >
            <MyFlex
                height="100px"
                position="absolute"
                top={0}
                right={0}
                opacity={0.5}
            >
                <Logo />
            </MyFlex>

            <MyFlex direction="column" align="center" gap={3}>
                <SelectedIcons iconName="Text" size="45px" />

                <MyFlex direction="column" align="center" gap={2}>
                    <EmptyStateText>No hay conversaciones</EmptyStateText>

                    <EmptyStateText fontSize="0.8rem" fontWeight="semibold">
                        Inicia una conversación para empezar a chatear
                    </EmptyStateText>
                </MyFlex>
            </MyFlex>
        </MyFlex>
    );
};

export default ShowEmptyConversations;
