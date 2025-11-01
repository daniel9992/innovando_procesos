import { MyButton, MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import { useState, type FC } from 'react';

interface ShowMyQuestionProps {
    question: string;
}
const ShowMyQuestion: FC<ShowMyQuestionProps> = ({ question }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <MyFlex
            p={0}
            direction={'row'}
            justifyContent={isExpanded ? 'space-between' : 'flex-end'}
        >
            <MyFlex
                direction={'column'}
                p={3}
                width={isExpanded ? '100%' : '50%'}
                boxShadow={'md'}
                position={'relative'}
                bg={isExpanded ? 'bg.muted' : 'bg.panel'}
            >
                <MyText
                    fontSize={'0.8rem'}
                    color={'gray'}
                    fontWeight={'semibold'}
                >
                    Tú:
                </MyText>
                <MyText
                    lineHeight={'1.8'}
                    truncate={isExpanded}
                    lineClamp={isExpanded ? '' : 2}
                >
                    {question}
                </MyText>

                <MyButton
                    position={'absolute'}
                    right={0}
                    top={0}
                    size={'xs'}
                    variant={'plain'}
                    aria-label={'Leer más'}
                    leftIcon={isExpanded ? 'ARROW_UP' : 'ARROW_DOWN'}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Leer menos' : 'Leer más'}
                </MyButton>
            </MyFlex>
        </MyFlex>
    );
};

export default ShowMyQuestion;
