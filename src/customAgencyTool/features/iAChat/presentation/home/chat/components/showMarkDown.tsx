import { MyFlex, MyText } from '@src/customAgencyTool/components/ui';
import Markdown from 'react-markdown';

interface IProps {
    response: string;
}

const ShowMarkDown = ({ response }: IProps) => {
    return (
        <div>
            <MyText fontSize={'0.8rem'} color={'gray'} fontWeight={'semibold'}>
                Response:
            </MyText>
            <MyFlex bg={'bg.muted'} p={3} bento>
                <Markdown>{response}</Markdown>
            </MyFlex>
        </div>
    );
};

export default ShowMarkDown;
