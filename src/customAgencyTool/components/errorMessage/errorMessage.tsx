import { type FC } from 'react';
import { MyFlex, MyHeading, MyText } from '../ui';

interface ErrorMessageProps {
    title?: string;
    error: string;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ title = 'Error', error }) => {
    return (
        <MyFlex
            direction={'column'}
            align={'center'}
            justifyContent={'center'}
            height={'90vh'}
        >
            <MyHeading fontWeight={'semibold'} color={'gray'}>
                {title}
            </MyHeading>
            <MyFlex
                direction={'row'}
                align={'center'}
                justifyContent={'center'}
                gap={4}
            >
                <MyText fontWeight={'semibold'} fontSize={'2rem'} color={'red'}>
                    Error :
                </MyText>
                <MyText
                    fontWeight={'semibold'}
                    maxWidth={{
                        base: '100%',
                        md: '70%'
                    }}
                >
                    {error}
                </MyText>
            </MyFlex>
        </MyFlex>
    );
};

export default ErrorMessage;
