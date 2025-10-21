import { MyButton } from '@src/customAgencyTool/components/ui';
import type { FC } from 'react';

const ShowCalendarBtn: FC<{
    typeBtn?: 'IconButton' | 'Button' | 'none';
    onClick?: () => void;
}> = ({ typeBtn = 'IconButton', onClick = () => {} }) => {
    if (typeBtn === 'none') {
        return null;
    }

    return (
        <>
            {typeBtn === 'IconButton' ? (
                <MyButton
                    icon="Calendar"
                    colorPalette="calendar"
                    size={'xs'}
                    onClick={onClick}
                />
            ) : (
                <MyButton
                    leftIcon="Calendar"
                    colorPalette="calendar"
                    size={'xs'}
                    onClick={onClick}
                >
                    Calendario
                </MyButton>
            )}
        </>
    );
};

export default ShowCalendarBtn;
