import { type CSSProperties, type FC, type ReactNode } from 'react';
import { MyFlex, MyText } from '../ui';

interface ShowLabelValueProps {
    label: string;
    labelStyle?: CSSProperties;
    value: string | ReactNode;
    valueStyle?: CSSProperties;
    positionValue?: 'top' | 'bottom' | 'row';
    rowJustifyContent?:
        | 'space-between'
        | 'space-around'
        | 'center'
        | 'flex-start'
        | 'flex-end';
}

const ShowLabelValue: FC<ShowLabelValueProps> = ({
    label,
    labelStyle = {
        // fontSize: '0.8rem',
        color: 'gray',
        fontWeight: 'semibold'
    },
    value,
    valueStyle = {
        // fontSize: '0.8rem',
        // color: 'gray.500',
        fontWeight: 'semibold'
    },
    positionValue = 'top',
    rowJustifyContent = 'flex-start'
}) => {
    if (positionValue === 'row') {
        return (
            <MyFlex
                p={0}
                direction={'row'}
                justifyContent={rowJustifyContent}
                align={'center'}
                width={'100%'}
            >
                <MyText style={labelStyle}>{label}</MyText>
                {typeof value === 'string' ? (
                    <MyText style={valueStyle}>{value}</MyText>
                ) : (
                    value
                )}
            </MyFlex>
        );
    }
    return (
        <MyFlex
            p={0}
            direction={positionValue === 'top' ? 'column' : 'column-reverse'}
        >
            <MyText style={labelStyle}>{label}</MyText>
            {typeof value === 'string' ? (
                <MyText style={valueStyle}>{value}</MyText>
            ) : (
                value
            )}
        </MyFlex>
    );
};

export default ShowLabelValue;
