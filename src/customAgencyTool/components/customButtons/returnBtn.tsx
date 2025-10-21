import type { FC } from 'react';
import { useNavigate } from 'react-router';
import { MyButton, MyFlex } from '../ui';

interface ReturnBtnProps {
    path?: string;
    position?: string;
    top?: string;
    left?: string;
    right?: string;
    size?: 'xs' | 'sm' | 'md';
    onClick?: () => void;
}
const ReturnBtn: FC<ReturnBtnProps> = ({
    path,
    position,
    top,
    left,
    right,
    size = 'xs',
    onClick
}) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (onClick) {
            onClick();
            return;
        }
        if (path) {
            navigate(path);
        } else {
            navigate(-1);
        }
    };
    return (
        <MyFlex position={position} top={top} left={left} right={right}>
            <MyButton
                leftIcon={'ARROW_LEFT'}
                colorPalette={'blue'}
                onClick={handleClick}
                size={size}
            >
                Regresar
            </MyButton>
        </MyFlex>
    );
};

export default ReturnBtn;
