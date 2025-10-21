import type { FC, ReactNode } from 'react';
import { MyFlex, MyText } from '../ui';
import type { FlexParams } from '../ui/myFlex';

interface IProps extends FlexParams {
    title: string;
    children?: ReactNode;
    minWidth?: string;
}

const DivGroupTitle: FC<IProps> = ({ title, children, ...props }) => {
    return (
        <MyFlex
            direction="column"
            mt={2}
            borderRadius={'md'}
            p={2}
            py={3}
            border={'1px dashed #ccc'}
            position={'relative'}
            {...props}
        >
            <MyText
                m={0}
                p={0}
                px={2}
                position={'absolute'}
                bg={'bg.muted'}
                top={-3}
                left={0}
                border={'1px solid #ccc'}
                borderRadius={'md'}
                fontWeight={'semibold'}
                fontSize={'sm'}
            >
                {title}
            </MyText>
            <MyFlex
                //direction="row"
                gap={2}
                alignItems="center"
                p={0}
            >
                {children}
            </MyFlex>
        </MyFlex>
    );
};

export default DivGroupTitle;
