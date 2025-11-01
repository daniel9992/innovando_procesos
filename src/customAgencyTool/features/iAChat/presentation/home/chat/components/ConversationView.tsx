import { MyButton, MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import type {
    ICustomChatConversation,
    ICustomChatSession
} from '@src/customAgencyTool/features/iAChat/domain/customChat.model';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import ShowResponseMarkDown from '../../components/showResponseMarkDown/showResponseMarkDown';
import ShorFileParts from './shorFileParts';
import ShowActiveSession from './showActiveSession';
import ShowMyQuestion from './showMyQuestion';

interface ConversationViewProps {
    conversations: ICustomChatConversation[];
    activeSession?: ICustomChatSession;
    isLoadingFilePart: boolean;
    loadMoreRef: (node?: Element | null | undefined) => void;
    handledRetryConversation: (conversation: ICustomChatConversation) => void;
    hanledDeleteConversation: (conversation: ICustomChatConversation) => void;
    handledOnselectFilePart: (
        inlineParts: any | undefined,
        fileParts: any | undefined
    ) => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
    conversations,
    activeSession,
    isLoadingFilePart,
    loadMoreRef,
    handledRetryConversation,
    hanledDeleteConversation,
    handledOnselectFilePart
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [conversations]);

    return (
        <MyFlex
            ref={scrollRef}
            direction={'column'}
            p={0}
            justifyContent={'flex-start'}
            display={conversations.length === 0 ? 'none' : 'flex'}
            overflow={'auto'}
            maxWidth={{
                base: '100%',
                md: '85vw',
                lg: '75vw'
            }}
            width={'100%'}
            mx={'auto'}
        >
            <ShowActiveSession activeSession={activeSession} />

            <MyFlex direction={'column'} gap={2} px={3}>
                {conversations.map((conv) => (
                    <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MyFlex direction={'column'} gap={2} px={3}>
                            <MyFlex
                                direction={'row'}
                                justify={'space-between'}
                                align={'center'}
                                p={0}
                            >
                                <MyFlex p={0}></MyFlex>
                                <MyFlex
                                    direction={'row'}
                                    gap={2}
                                    align={'center'}
                                >
                                    {conv.isReplyConversation && (
                                        <MyText
                                            fontSize={'0.8rem'}
                                            color={'gray'}
                                        >
                                            Respuesta Reintentada.
                                        </MyText>
                                    )}
                                    <MyButton
                                        aria-label={'Reintentar conversación'}
                                        variant={'plain'}
                                        colorPalette={'blue'}
                                        icon={'REFRESH'}
                                        size={'xs'}
                                        onClick={() => {
                                            handledRetryConversation(conv);
                                        }}
                                    />
                                    <MyButton
                                        aria-label={'Eliminar conversación'}
                                        variant={'plain'}
                                        colorPalette={'red'}
                                        icon={'TRASH'}
                                        size={'xs'}
                                        onClick={() => {
                                            hanledDeleteConversation(conv);
                                        }}
                                    />
                                </MyFlex>
                            </MyFlex>

                            <ShorFileParts
                                inlineParts={conv.inlineParts}
                                filesParts={conv.fileDataParts}
                                isLoading={isLoadingFilePart}
                                onSelectFile={handledOnselectFilePart}
                            />

                            <ShowMyQuestion question={conv.question} />

                            <ShowResponseMarkDown response={conv.response} />
                        </MyFlex>
                    </motion.div>
                ))}
                {/* Load more trigger */}
                <div ref={loadMoreRef} className="h-10" />
            </MyFlex>
        </MyFlex>
    );
};

export default ConversationView;
