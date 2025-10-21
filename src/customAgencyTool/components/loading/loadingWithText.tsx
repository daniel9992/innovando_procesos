import { type FC } from 'react';
import { MyFlex, MySpinner, MyText } from '../ui';

interface LoadingWithTextProps {
    text: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

const LoadingWithText: FC<LoadingWithTextProps> = ({ text, size = 'md' }) => {
    return (
        <MyFlex gap={3} align={'center'}>
            <MySpinner size={size} />{' '}
            {text && <MyText fontSize={size}>{text}</MyText>}
        </MyFlex>
    );
};

export default LoadingWithText;
