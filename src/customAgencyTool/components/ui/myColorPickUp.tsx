import {
    ColorPicker,
    HStack,
    parseColor,
    type Color
} from '@chakra-ui/react';

import { useRef, useState, type FC } from 'react';
import { LuCheck } from 'react-icons/lu';

interface MyColorPickUpProps {
    color?: string;
    onChange?: (color: string) => void;
    size?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    defaultSwatches?: string[];
    clickBehavior?: 'toggle' | 'select';
}

const swatches = [
    '#000000',
    '#4A5568',
    '#F56565',
    '#ED64A6',
    '#9F7AEA',
    '#6B46C1',
    '#4299E1',
    '#0BC5EA',
    '#00B5D8',
    '#38B2AC',
    '#48BB78',
    '#68D391',
    '#ECC94B',
    '#DD6B20'
];

export const MyColorPickUp: FC<MyColorPickUpProps> = ({
    color = '#4299E1',
    onChange = () => {},
    size = 'sm',
    defaultSwatches = swatches,
    clickBehavior = 'toggle'
}) => {
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const [localColor, setLocalColor] = useState<Color>(parseColor(color));

    const handledOnColorChange = (color: Color) => {
        setLocalColor(color);

        const hexColor = localColor.toString('hex');

        onChange(hexColor);
    };

    const handledOnSelectedDefaultSwatches = (color: string) => {
        const colorFormatted = parseColor(color);
        setLocalColor(colorFormatted);

        onChange(color);
    };

    const handleClick = () => {
        if (!colorPickerRef.current) return;
    };

    return (
        <ColorPicker.Root
            size={size}
            value={localColor}
            onValueChange={(e) => handledOnColorChange(e.value)}
            closeOnSelect={clickBehavior === 'toggle'}
        >
            <ColorPicker.HiddenInput />
            {/* {label && <ColorPicker.Label>{label}</ColorPicker.Label>} */}
            <ColorPicker.Control>
                {/* <ColorPicker.Input /> */}
                <ColorPicker.Trigger />
            </ColorPicker.Control>

            <ColorPicker.Positioner>
                <ColorPicker.Content>
                    <ColorPicker.Area onClick={handleClick} />
                    <HStack>
                        <ColorPicker.EyeDropper
                            size="xs"
                            variant="outline"
                        />
                        <ColorPicker.Sliders />
                    </HStack>
                    <ColorPicker.SwatchGroup>
                        {defaultSwatches.map((item) => (
                            <ColorPicker.SwatchTrigger
                                key={item}
                                value={item}
                                onClick={() =>
                                    handledOnSelectedDefaultSwatches(item)
                                }
                            >
                                <ColorPicker.Swatch
                                    boxSize="4.5"
                                    value={item}
                                >
                                    <ColorPicker.SwatchIndicator>
                                        <LuCheck />
                                    </ColorPicker.SwatchIndicator>
                                </ColorPicker.Swatch>
                            </ColorPicker.SwatchTrigger>
                        ))}
                    </ColorPicker.SwatchGroup>
                </ColorPicker.Content>
            </ColorPicker.Positioner>
        </ColorPicker.Root>
    );
};
