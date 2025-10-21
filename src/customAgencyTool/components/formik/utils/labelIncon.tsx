import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { type FC } from 'react';

interface LabelInconProps {
    htmlFor?: string;
    label?: string;
    icon?: string;
}

export const LabelIncon: FC<LabelInconProps> = ({
    htmlFor,
    label,
    icon
}) => {
    return (
        <label
            htmlFor={htmlFor}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}
        >
            {icon && <SelectedIcons iconName={icon} size="1.3rem" />}
            {label}
        </label>
    );
};
