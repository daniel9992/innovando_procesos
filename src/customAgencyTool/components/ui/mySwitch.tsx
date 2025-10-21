import { Switch } from '@chakra-ui/react';
import { useState, type FC } from 'react';

interface MySwitchProps {
    label?: string;
    checked: boolean;
    onCheckedChange: (check: boolean) => void;
    size?: 'sm' | 'md' | 'lg';
    isDisabled?: boolean;
}

export const MySwitch: FC<MySwitchProps> = ({
    label = '',
    size = 'md',
    checked = false,
    isDisabled = false,
    onCheckedChange = () => {}
}) => {
    const [localChecked, setLocalChecked] = useState(checked);
    return (
        <Switch.Root
            size={size}
            colorPalette={'blue'}
            disabled={isDisabled}
            onCheckedChange={(e) => {
                setLocalChecked(e.checked);
                onCheckedChange(e.checked);
            }}
            checked={localChecked}
        >
            <Switch.HiddenInput />
            <Switch.Control>
                {/* <Switch.Thumb>
                    <Switch.ThumbIndicator
                        fallback={
                            <SelectedIcons
                                iconName={'UNCHECK'}
                                color="gray.500"
                            />
                        }
                    >
                        <SelectedIcons
                            iconName={'CHECK'}
                            color="gray.500"
                        />
                    </Switch.ThumbIndicator>
                </Switch.Thumb> */}
            </Switch.Control>
            <Switch.Label>{label}</Switch.Label>
        </Switch.Root>
    );
};
