import { type FC } from 'react';
import { MyButton } from '../ui';

interface AddNewLineProps {
    label?: string;
    leftIcon?: string;
    rightIcon?: string;
    onClick?: () => void;
    isDisabled?: boolean;
}

const AddNewLine: FC<AddNewLineProps> = ({
    label,
    leftIcon = 'Plus',
    rightIcon,
    onClick,
    isDisabled = false
}) => {
    return (
        <MyButton
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            variant={'outline'}
            border={'2px dashed #333333'}
            isDisabled={isDisabled}
            onClick={() => {
                onClick?.();
            }}
        >
            {label}
        </MyButton>
    );
};

export default AddNewLine;
