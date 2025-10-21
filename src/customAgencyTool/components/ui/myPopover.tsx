import { Popover, Portal } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { FC, ReactNode } from 'react';
import { MyButton } from './myButton';

interface Props {
    icon?: string;
    btnLabel?: string;
    btnVariant?:
        | 'solid'
        | 'outline'
        | 'ghost'
        | 'subtle'
        | 'surface'
        | 'plain';
    header: ReactNode;
    body: ReactNode;
    triggerAsChiled?: ReactNode;
}

export const MyPopover: FC<Props> = ({
    icon,
    btnLabel,
    btnVariant = 'outline',
    header,
    body,
    triggerAsChiled
}) => {
    return (
        <Popover.Root>
            {triggerAsChiled && (
                <Popover.Trigger asChild>
                    {triggerAsChiled}
                </Popover.Trigger>
            )}
            {!triggerAsChiled && (
                <Popover.Trigger asChild>
                    <MyButton variant={btnVariant} leftIcon={icon}>
                        {btnLabel}
                    </MyButton>
                </Popover.Trigger>
            )}
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Arrow />
                        <Popover.Body>
                            <Popover.Title
                                display="flex"
                                alignItems="center"
                                direction="row"
                                gap={3}
                                fontWeight="medium"
                                mb={2}
                            >
                                {icon && (
                                    <SelectedIcons
                                        iconName={icon}
                                        size={'1.5rem'}
                                    />
                                )}
                                {header}
                            </Popover.Title>
                            {body}
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
