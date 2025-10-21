import { Checkbox } from '@chakra-ui/react';
import type { FC, ReactNode } from 'react';

interface CheckboxProps {
    defaultChecked?: boolean;
    isChecked: boolean;
    onChange: (check: boolean) => void;
    variant?: 'subtle' | 'outline' | 'solid';
    children: ReactNode;
    colorPalette?: string;
    size?: 'sm' | 'md' | 'lg';
    isDisabled?: boolean;
}

export const MyCheckBox: FC<CheckboxProps> = ({
    defaultChecked = false,
    isChecked,
    onChange,
    variant = 'subtle',
    size = 'md',
    children,
    colorPalette,
    isDisabled = false
}) => {
    return (
        <Checkbox.Root
            defaultChecked={defaultChecked}
            colorPalette={colorPalette}
            variant={variant}
            checked={isChecked}
            onCheckedChange={(e) => onChange(!!e.checked)}
            size={size}
            disabled={isDisabled}
        >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>{children}</Checkbox.Label>
        </Checkbox.Root>
    );
};
