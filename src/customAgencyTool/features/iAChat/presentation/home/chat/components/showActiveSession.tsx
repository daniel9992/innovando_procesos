import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import type { ICustomChatSession } from '@src/customAgencyTool/features/iAChat/domain/customChat.model';
import { ShowDate } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';

interface IProps {
    activeSession?: ICustomChatSession;
}

const ShowActiveSession = ({ activeSession }: IProps) => {
    if (!activeSession) {
        return <></>;
    }

    return (
        <MyFlex
            direction={'row'}
            justifyContent={'space-between'}
            align={'center'}
            p={0}
            px={4}
        >
            <MyText fontWeight={'semibold'}>{activeSession.title}</MyText>
            <MyText color={'gray'} fontSize={'0.8rem'}>
                {ShowDate(
                    activeSession.createdAt,
                    'D [-] MMMM [-] YYYY hh:mm:ss A',
                    'es'
                )}
            </MyText>
        </MyFlex>
    );
};

export default ShowActiveSession;
