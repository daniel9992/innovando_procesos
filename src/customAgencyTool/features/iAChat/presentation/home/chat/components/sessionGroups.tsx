import { Box, useBreakpointValue } from '@chakra-ui/react';
import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import { AnimatePresence, motion } from 'framer-motion';
import {
    MyButton,
    MyDialog,
    MyFlex,
    MyHeading,
    MyMenu,
    MyText
} from '@src/customAgencyTool/components/ui';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { useCallback, useMemo, useState, type FC, type ReactNode } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import type { ICustomChatSession } from '../../../../domain/customChat.model';
import { groupSessionsByDate } from '../../../utils/grouping';

interface SessionGroupsProps {
    isEnableSessions: boolean;
    activeSessionId?: string;
    sessions: ICustomChatSession[];
    isLoadingSessions: boolean;
    hasMoreSessions: boolean;
    onSelectSession: (session: ICustomChatSession) => void;
    onMenuSession: (session: ICustomChatSession, action: string) => void;
    loadMoreSessions: () => void;
    onNewSession: () => void;
}

interface ItemData {
    groupedSessions: Array<{
        heading: string;
        sessions: ICustomChatSession[];
    }>;
    isEnableSessions: boolean;
    activeSessionId: string;
    onSelectSession: (session: ICustomChatSession) => void;
    onMenuSession: (session: ICustomChatSession, action: string) => void;
}

const ITEM_HEIGHT = 50;
// const GROUP_HEADER_HEIGHT = 40;

const SessionItem = ({
    index,
    style,
    data
}: ListChildComponentProps<ItemData>) => {
    const {
        groupedSessions,
        isEnableSessions,
        activeSessionId,
        onSelectSession,
        onMenuSession
    } = data;
    let currentIndex = 0;
    let groupIndex = 0;

    // Encontrar el grupo y sesión correctos basados en el índice
    while (groupIndex < groupedSessions.length) {
        const groupSize = groupedSessions[groupIndex].sessions.length + 1; // +1 para el encabezado
        if (currentIndex + groupSize > index) {
            const isHeader = currentIndex === index;
            const sessionIndex = index - currentIndex - 1;

            if (isHeader) {
                return (
                    <MyFlex style={style}>
                        <MyHeading color={'gray'} fontWeight={'semibold'}>
                            {groupedSessions[groupIndex].heading}
                        </MyHeading>
                    </MyFlex>
                );
            }

            const session = groupedSessions[groupIndex].sessions[sessionIndex];

            const isActive = session.id === activeSessionId;

            return (
                <MyFlex
                    style={style}
                    direction={'row'}
                    justifyContent={'space-between'}
                    align={'center'}
                    ps={2}
                    _hover={{
                        backgroundColor: isEnableSessions ? '' : 'bg.panel',
                        border: isEnableSessions ? '' : '1px solid #e7eaf675'
                    }}
                    border={isActive ? '1px solid #e7eaf675' : ''}
                    bg={isActive ? 'bg.panel' : ''}
                >
                    <MyText
                        truncate={true}
                        cursor={isEnableSessions ? 'not-allowed' : 'pointer'}
                        onClick={() => {
                            if (isEnableSessions) return;
                            onSelectSession(session);
                        }}
                    >
                        {session.title}
                    </MyText>

                    <MyMenu
                        triggerAsChild={
                            <MyButton
                                size={'xs'}
                                leftIcon={'MENU_DOTS'}
                                variant={'plain'}
                                disabled={isEnableSessions}
                                aria-label={'Menu ' + session.title}
                            />
                        }
                        verticalMenuItems={[
                            {
                                id: 'rename',
                                leftIcon: 'EDIT',
                                label: 'Rename',
                                type: 'item',
                                isActive: true,
                                allowRoles: [],
                                onClick: () => onMenuSession(session, 'rename')
                            },
                            {
                                id: 'delete',
                                leftIcon: 'TRASH',
                                label: 'Delete',
                                type: 'item',
                                isActive: true,
                                color: 'red',
                                allowRoles: [],
                                onClick: () => onMenuSession(session, 'delete')
                            }
                        ]}
                    />
                </MyFlex>
            );
        }
        currentIndex += groupSize;
        groupIndex++;
    }
    return null;
};

const SessionGroups: FC<SessionGroupsProps> = ({
    isEnableSessions,
    sessions,
    activeSessionId = '',
    isLoadingSessions,
    hasMoreSessions,
    onSelectSession,
    onMenuSession,
    loadMoreSessions,
    onNewSession
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    const wrapperBreakpoint = useBreakpointValue({
        base: true,
        md: false
    });
    const groupedSessions = useMemo(() => {
        return groupSessionsByDate(sessions);
    }, [sessions]);

    const itemCount = useMemo(() => {
        return groupedSessions.reduce(
            (acc, group) => acc + group.sessions.length + 1, // +1 para cada encabezado
            0
        );
    }, [groupedSessions]);

    const handledOnSelectSession = useCallback(
        (session: ICustomChatSession) => {
            onSelectSession(session);
            setIsDialogOpen(false);
        },
        [onSelectSession]
    );

    const itemData = useMemo(
        () => ({
            groupedSessions,
            isEnableSessions,
            activeSessionId,
            onSelectSession: handledOnSelectSession,
            onMenuSession
        }),
        [
            groupedSessions,
            isEnableSessions,
            handledOnSelectSession,
            onMenuSession,
            activeSessionId
        ]
    );

    const isItemLoaded = (index: number) =>
        !hasMoreSessions || index < itemCount;

    const SessionWrap = ({ children }: { children: ReactNode }) => {
        if (wrapperBreakpoint) {
            return (
                <>
                    <MyFlex
                        direction={'row'}
                        p={0}
                        justifyContent={'space-between'}
                        align={'center'}
                    >
                        <MyText>Control de sesión</MyText>
                        <MyButton
                            icon={'MENU'}
                            size={'xs'}
                            // variant={'plain'}
                            onClick={() => setIsDialogOpen(true)}
                        />
                    </MyFlex>
                    <MyDialog
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        isScreenLoading={isLoadingSessions}
                        header={'Control de sesión'}
                        maxHeight="90vh"
                        body={
                            <MyFlex
                                direction={'column'}
                                overflow={'hidden'}
                                minHeight={'85vh'}
                                // minHeight={'680px'}
                                position={'relative'}
                                opacity={isLoadingSessions ? 0.5 : 1}
                            >
                                {children}
                            </MyFlex>
                        }
                    />
                </>
            );
        }
        return (
            <MyFlex
                direction={'column'}
                h={'100%'}
                overflow={'hidden'}
                position={'relative'}
                opacity={isLoadingSessions ? 0.5 : 1}
                minHeight={'350px'}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </MyFlex>
        );
    };

    if (sessions.length === 0) {
        return (
            <SessionWrap>
                <MyFlex
                    direction={'column'}
                    justifyContent={'center'}
                    align={'center'}
                    height={'100%'}
                    bg={'bg.muted'}
                    p={4}
                >
                    <SelectedIcons iconName="Hubot" size={'45px'} />
                    <MyText color={'gray'} textAlign={'center'}>
                        No hay sesiones
                    </MyText>
                    <MyText
                        color={'gray'}
                        fontSize={'0.8rem'}
                        fontWeight={'semibold'}
                        textAlign={'center'}
                    >
                        Crea una sesión para empezar a chatear
                    </MyText>
                </MyFlex>
            </SessionWrap>
        );
    }

    return (
        <SessionWrap>
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <MyFlex justifyContent={'center'} align={'center'}>
                            <MyButton
                                leftIcon={'ADD'}
                                onClick={onNewSession}
                                width={'100%'}
                                colorPalette={'submit'}
                                disabled={isEnableSessions}
                            >
                                Crea una sesión nueva
                            </MyButton>
                        </MyFlex>
                    </motion.div>
                )}
            </AnimatePresence>

            {isLoadingSessions && (
                <MyFlex
                    position={'absolute'}
                    top={0}
                    left={0}
                    bottom={0}
                    right={0}
                    justifyContent={'center'}
                    align={'center'}
                    p={4}
                    bg={'bg.muted'}
                >
                    <LoadingWithText text={'Cargando...'} />
                </MyFlex>
            )}
            <AutoSizer>
                {({ height, width }) => (
                    <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={hasMoreSessions ? itemCount + 1 : itemCount}
                        loadMoreItems={loadMoreSessions}
                    >
                        {({ onItemsRendered, ref }) => (
                            <FixedSizeList
                                height={height}
                                width={width}
                                itemCount={itemCount}
                                itemSize={ITEM_HEIGHT}
                                itemData={itemData}
                                onItemsRendered={onItemsRendered}
                                ref={ref}
                            >
                                {SessionItem}
                            </FixedSizeList>
                        )}
                    </InfiniteLoader>
                )}
            </AutoSizer>
        </SessionWrap>
    );
};

export default SessionGroups;
