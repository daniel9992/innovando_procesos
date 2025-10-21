import {
    Flex,
    Menu,
    Portal,
    useCheckboxGroup,
    type UseMenuProps
} from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { useState, type FC, type ReactNode } from 'react';
import { Link } from 'react-router';

type Placement = 'right-start' | 'right-end' | 'left-start' | 'left-end';

export interface MenuItemButon {
    id: string;
    leftIcon?: string;
    rightIcon?: string;
    icon?: string;
    label: string;
    command?: string;
    onClick?: () => void;
    url?: string;
    type?:
        | 'item'
        | 'CheckboxItem'
        | 'RadioItem'
        | 'link'
        | 'group'
        | 'separator'
        | 'children'
        | 'iconButton';
    color?: string;
    size?: string;
    hoverColor?: string;
    isActive: boolean;
    allowRoles: string[];
    subMenus?: MenuItemButon[];
    children?: ReactNode;
}

type WithoutTypeToHorizontal = 'leftIcon' | 'rightIcon' | 'subMenus';

export interface MenuItemHorizontal
    extends Omit<MenuItemButon, WithoutTypeToHorizontal> {
    color?: string;
}

interface MyMenuProps {
    triggerAsChild?: ReactNode;
    placement?: string;
    horizontalMenuItems?: MenuItemHorizontal[];
    verticalMenuItems?: MenuItemButon[];

    setInitialValueRadio?: string;
    withOutPortal?: boolean;
}

export const MyMenu: FC<MyMenuProps & UseMenuProps> = ({
    triggerAsChild,
    horizontalMenuItems = [],
    verticalMenuItems = [],
    placement = 'right-start',
    setInitialValueRadio = '',
    withOutPortal = false,
    ...props
}) => {
    const group = useCheckboxGroup({ defaultValue: ['autosave'] });

    const [valueRadio, setValueRadio] = useState(setInitialValueRadio);

    interface RenderMenuItemProps extends Menu.ItemProps {
        item: MenuItemButon;
    }

    const RenderMenuItem: FC<RenderMenuItemProps> = ({ item, ...props }) => {
        if (item.type === 'group') {
            return (
                <Menu.ItemGroup>
                    <Menu.ItemGroupLabel>{item.label}</Menu.ItemGroupLabel>

                    {item.subMenus?.map((item, index) => (
                        <RenderMenuItem
                            key={`index-${index}-` + item.label}
                            item={item}
                            value={item.label}
                        />
                    ))}
                </Menu.ItemGroup>
            );
        }

        if (item.subMenus && item.subMenus.length > 0 && item.type === 'item') {
            return (
                <Menu.Root
                    positioning={{ placement: 'right-start', gutter: 2 }}
                >
                    <Menu.TriggerItem>
                        {item.icon}
                        {item.icon && <SelectedIcons iconName={item.icon} />}
                        {item.leftIcon && (
                            <SelectedIcons iconName={item.leftIcon} />
                        )}
                        {item.label}
                        {item.command && (
                            <Menu.ItemCommand>{item.command}</Menu.ItemCommand>
                        )}
                        {item.rightIcon && (
                            <SelectedIcons iconName={item.rightIcon} />
                        )}
                        <SelectedIcons iconName={'ChevronRight'} />
                    </Menu.TriggerItem>

                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                {item.subMenus.map((subItem, index) => (
                                    <RenderMenuItem
                                        key={`index-${index}-` + subItem.label}
                                        item={subItem}
                                        value={subItem.label}
                                    />
                                ))}
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            );
        }

        if (item.type === 'item') {
            if (item.url) {
                return (
                    <Menu.Item
                        {...props}
                        id={item.id}
                        value={item.label}
                        color={item.color}
                        fontSize={item.size}
                        onClick={() => item.onClick?.()}
                        key={item.url}
                        asChild
                    >
                        <Link to={item.url}>
                            {item.icon}
                            {item.icon && (
                                <SelectedIcons iconName={item.icon} />
                            )}
                            {item.leftIcon && (
                                <SelectedIcons iconName={item.leftIcon} />
                            )}
                            {item.label}
                            {item.command && (
                                <Menu.ItemCommand>
                                    {item.command}
                                </Menu.ItemCommand>
                            )}
                            {item.rightIcon && (
                                <SelectedIcons iconName={item.rightIcon} />
                            )}
                        </Link>
                    </Menu.Item>
                );
            }
            return (
                <Menu.Item
                    {...props}
                    id={item.id}
                    value={item.label}
                    color={item.color}
                    fontSize={item.size}
                    onClick={() => item.onClick?.()}
                >
                    {item.icon}
                    {item.icon && <SelectedIcons iconName={item.icon} />}
                    {item.leftIcon && (
                        <SelectedIcons iconName={item.leftIcon} />
                    )}
                    {item.label}
                    {item.command && (
                        <Menu.ItemCommand>{item.command}</Menu.ItemCommand>
                    )}
                    {item.rightIcon && (
                        <SelectedIcons iconName={item.rightIcon} />
                    )}
                </Menu.Item>
            );
        }

        if (item.type === 'CheckboxItem') {
            const items = [
                { title: 'Autosave', value: 'autosave' },
                { title: 'Detect Language', value: 'detect-language' },
                { title: 'Spellcheck', value: 'spellcheck' }
            ];
            return (
                <Menu.ItemGroup>
                    <Menu.ItemGroupLabel>CheckboxItem</Menu.ItemGroupLabel>
                    {items.map(({ title, value }) => (
                        <Menu.CheckboxItem
                            key={value}
                            value={value}
                            checked={group.isChecked(value)}
                            onCheckedChange={() => group.toggleValue(value)}
                        >
                            {title}
                            <Menu.ItemIndicator />
                        </Menu.CheckboxItem>
                    ))}
                </Menu.ItemGroup>
            );
        }
        if (item.type === 'RadioItem') {
            return (
                <Menu.ItemGroup>
                    <Menu.ItemGroupLabel>{item.label}</Menu.ItemGroupLabel>
                    <Menu.RadioItemGroup
                        value={valueRadio}
                        onValueChange={(e) => setValueRadio(e.value)}
                    >
                        {item.subMenus?.map((item, index) => (
                            <Menu.RadioItem
                                key={`index-${index}-` + item.label}
                                value={item.label}
                                onClick={() => {
                                    item.onClick?.();
                                }}
                            >
                                {item.label}
                                <Menu.ItemIndicator />
                            </Menu.RadioItem>
                        ))}
                    </Menu.RadioItemGroup>
                </Menu.ItemGroup>
            );

            // const items = [
            //     { label: 'Ascending', value: 'asc' },
            //     { label: 'Descending', value: 'desc' }
            // ];

            // return (
            //     <Menu.ItemGroup>
            //         <Menu.ItemGroupLabel>RadioItem</Menu.ItemGroupLabel>
            //         <Menu.RadioItemGroup
            //             value={valueRadio}
            //             onValueChange={(e) => setValueRadio(e.value)}
            //         >
            //             {items.map((item) => (
            //                 <Menu.RadioItem
            //                     key={item.value}
            //                     value={item.value}
            //                 >
            //                     {item.label}
            //                     <Menu.ItemIndicator />
            //                 </Menu.RadioItem>
            //             ))}
            //         </Menu.RadioItemGroup>
            //     </Menu.ItemGroup>
            // );
        }
        if (item.type === 'link') {
            return (
                <Menu.Item
                    key={item.url}
                    asChild
                    id={item.id}
                    {...props}
                    value={item.label}
                >
                    {item.leftIcon && (
                        <SelectedIcons iconName={item.leftIcon} />
                    )}
                    <a href={item.url} target="_blank" rel="noreferrer">
                        {item.label}
                    </a>
                    {item.command && (
                        <Menu.ItemCommand>{item.command}</Menu.ItemCommand>
                    )}
                    {item.rightIcon && (
                        <SelectedIcons iconName={item.rightIcon} />
                    )}
                </Menu.Item>
            );
        }
        if (item.type === 'separator') {
            return (
                <Menu.Separator
                    key={'separator-' + Math.random()}
                    id={item.id}
                    {...props}
                />
            );
        }
        if (item.type === 'children') {
            return (
                <Menu.Item
                    key={`menu-item-children-${item.id}`}
                    id={item.id}
                    value={item.label}
                    color={item.color}
                    fontSize={item.size}
                >
                    {item.children}
                </Menu.Item>
            );
        }
    };

    const PortalWrapper = ({ children }: { children: ReactNode }) => {
        if (withOutPortal) {
            return <>{children}</>;
        }

        return <Portal>{children}</Portal>;
    };

    return (
        <Menu.Root
            positioning={{
                placement: placement as Placement
            }}
            {...props}
        >
            <Menu.Trigger asChild>{triggerAsChild}</Menu.Trigger>
            <PortalWrapper>
                <Menu.Positioner>
                    <Menu.Content>
                        <Flex
                            direction={'row'}
                            gap={2}
                            justifyContent={'space-between'}
                        >
                            {horizontalMenuItems.map((item, index) => (
                                <RenderMenuItem
                                    key={`index-${index}-` + item.label}
                                    item={item}
                                    value={item.label}
                                />
                            ))}
                        </Flex>
                        {verticalMenuItems.map((item, index) => (
                            <RenderMenuItem
                                key={`index-${index}-` + item.label}
                                item={item}
                                value={item.label}
                            />
                        ))}
                    </Menu.Content>
                </Menu.Positioner>
            </PortalWrapper>
        </Menu.Root>
    );
};
