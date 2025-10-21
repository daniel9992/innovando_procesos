import {
    Box,
    Flex,
    Popover,
    Stack,
    Text,
    type BoxProps
} from '@chakra-ui/react';
import { PortalWrapper } from '@src/customAgencyTool/components/ui/portalWrapperProps';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { AnimatePresence, motion } from 'motion/react';
import { useRef, useState, type FC } from 'react';

// Tipos
export interface IComboboxDynItem {
    icon?: string;
    label: string;
    subLabel?: string;
    tooltip?: string;
    onClick?: () => void;
}

interface ComboboxProps {
    baseIcon?: string;
    baseLabel: string;
    baseOnClick?: () => void;
    comboboxItems: Array<IComboboxDynItem>;
    selectedItem?: IComboboxDynItem;
    onChange?: (item: IComboboxDynItem) => void;
    withOutPortal?: boolean;
}

// Componentes de animación
const MotionBox = motion<BoxProps>(Box);

// Constantes
const ANIMATION_DURATION = 0.2;
const ANIMATION_DELAY_MULTIPLIER = 0.1;

const ComboboxDynamic: FC<ComboboxProps> = ({
    baseIcon,
    baseLabel,
    baseOnClick = () => {},
    comboboxItems,
    selectedItem,
    onChange = () => {},
    withOutPortal = false
}) => {
    // Estado
    const [popoverState, setPopoverState] = useState({
        isOpen: false,
        name: ''
    });

    // Hooks
    const triggerRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Handlers
    const handlePopoverOpen = () => {
        setPopoverState({
            isOpen: true,
            name: baseLabel
        });
    };

    const handlePopoverCloseWithEvent = (event: React.MouseEvent) => {
        try {
            // Es buena práctica tipar el relatedTarget como Node, que es más genérico que HTMLElement
            const target = event.relatedTarget as Node;
            const popoverContent = popoverRef.current;

            // Si el target existe (no es null) Y el popoverRef existe Y el contenido del popover contiene el target,
            // significa que el mouse se está moviendo hacia adentro del popover. En ese caso, no hacemos nada.
            if (target && popoverContent?.contains(target)) {
                return;
            }

            // En cualquier otro caso (el mouse salió a un elemento fuera del popover o fuera de la ventana), cerramos el popover.
            setPopoverState({
                isOpen: false,
                name: ''
            });
        } catch (error) {
            console.error('error', error);

            // En cualquier otro caso (el mouse salió a un elemento fuera del popover o fuera de la ventana), cerramos el popover.
            setPopoverState({
                isOpen: false,
                name: ''
            });
        }
    };
    const handledPopoverClose = () => {
        // En cualquier otro caso (el mouse salió a un elemento fuera del popover o fuera de la ventana), cerramos el popover.
        setPopoverState({
            isOpen: false,
            name: ''
        });
    };

    const handleItemClick = (item: IComboboxDynItem) => {
        onChange(item);
        setPopoverState({
            isOpen: false,
            name: ''
        });
        item?.onClick?.();
    };

    // Render helpers
    const renderTrigger = () => (
        <Flex
            direction={'row'}
            align={'center'}
            gap={3}
            px={3}
            justify={'space-between'}
            ref={triggerRef}
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverCloseWithEvent}
            onClick={() => {
                baseOnClick();
                handlePopoverOpen();
            }}
        >
            {baseIcon && <SelectedIcons iconName={baseIcon} />}
            <Text>{baseLabel}</Text>
        </Flex>
    );

    const renderComboboxItem = (item: IComboboxDynItem, index: number) => (
        <MotionBox
            key={`combobox-${baseLabel}-item-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{
                duration: ANIMATION_DURATION,
                delay: index * ANIMATION_DELAY_MULTIPLIER
            }}
        >
            <Flex
                direction="row"
                py={2}
                px={4}
                gap={3}
                cursor="pointer"
                _hover={{
                    backgroundColor: 'bg.muted'
                }}
                border={
                    selectedItem?.label === item.label
                        ? '1px solid gray'
                        : 'none'
                }
                onClick={() => handleItemClick(item)}
            >
                <Flex>
                    <Flex my={'auto'}>
                        {item.icon && (
                            <SelectedIcons iconName={item.icon} size={'25px'} />
                        )}
                    </Flex>
                </Flex>
                <Flex direction="column">
                    <Flex
                        direction="row"
                        align="center"
                        gap={3}
                        // justify="space-between"
                    >
                        <Text fontWeight="medium" letterSpacing="wide">
                            {item.label}
                        </Text>
                    </Flex>
                    {item.subLabel && (
                        <Text fontSize="xs" color="gray.500">
                            {item.subLabel}
                        </Text>
                    )}
                </Flex>
            </Flex>
        </MotionBox>
    );

    return (
        <Flex>
            <Popover.Root
                open={popoverState.isOpen}
                onOpenChange={(e) => {
                    setPopoverState({
                        isOpen: e.open,
                        name: e.open ? baseLabel : ''
                    });
                }}
                positioning={{ offset: { crossAxis: 0, mainAxis: 0 } }}
            >
                <Popover.Trigger asChild>
                    <Flex
                        p={2}
                        px={4}
                        cursor="pointer"
                        _hover={{
                            backgroundColor: 'bg.muted'
                        }}
                    >
                        {renderTrigger()}
                    </Flex>
                </Popover.Trigger>

                <PortalWrapper withOutPortal={withOutPortal}>
                    <Popover.Positioner>
                        <Popover.Content
                            ref={popoverRef}
                            onMouseEnter={handlePopoverOpen}
                            onMouseLeave={() => {
                                handledPopoverClose();
                            }}
                        >
                            <Popover.Body px={4}>
                                <Popover.Title>{renderTrigger()}</Popover.Title>

                                <Flex direction={'column'} mt={2} gap={0}>
                                    <AnimatePresence>
                                        {popoverState.isOpen && (
                                            <MotionBox>
                                                <Stack gap={0}>
                                                    {comboboxItems.map(
                                                        renderComboboxItem
                                                    )}
                                                </Stack>
                                            </MotionBox>
                                        )}
                                    </AnimatePresence>
                                </Flex>
                            </Popover.Body>
                        </Popover.Content>
                    </Popover.Positioner>
                </PortalWrapper>
            </Popover.Root>
        </Flex>
    );
};

export default ComboboxDynamic;
