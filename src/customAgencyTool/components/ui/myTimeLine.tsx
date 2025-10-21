import { Timeline } from '@chakra-ui/react';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import type { CSSProperties, FC, ReactNode } from 'react';
import { memo } from 'react'; // 1. Importar memo para optimización
import { LuCheck, LuPackage, LuShip } from 'react-icons/lu';
import { MyText } from './myText';

// --- TIPOS ---
export interface TimeLineItem {
    id: string | number; // 2. Usar un ID único para la key en lugar del index
    icon?: ReactNode | string;
    title: string;
    children: ReactNode;
}

interface TimeLineProps {
    items?: TimeLineItem[];
    style?: CSSProperties;
    alignItems?: 'start' | 'center' | 'end';
}

// --- SUB-COMPONENTES PARA MAYOR CLARIDAD ---

/**
 * 3. Componente para renderizar el contenido del item (título y children).
 * Evita la duplicación de este bloque de JSX.
 */
const TimelineItemContent: FC<Pick<TimeLineItem, 'title' | 'children'>> = ({
    title,
    children
}) => (
    <>
        <Timeline.Title>{title}</Timeline.Title>
        {children}
    </>
);

/**
 * 4. Componente para renderizar el ícono.
 * Abstrae la lógica de si el ícono es un string o un ReactNode.
 */
const TimelineIcon: FC<{ icon: TimeLineItem['icon'] }> = ({ icon }) => {
    if (typeof icon === 'string') {
        return <SelectedIcons iconName={icon} />;
    }
    return <>{icon}</>;
};

/**
 * 5. Componente principal del item, memoizado para optimizar el rendimiento.
 * Contiene toda la lógica de renderizado para un solo item del timeline.
 */
const MemoizedTimelineItem: FC<{
    item: TimeLineItem;
    index: number;
    alignItems: TimeLineProps['alignItems'];
}> = memo(({ item, index, alignItems }) => {
    // El conector es visualmente igual en todos los casos, solo cambia su posición.
    const Connector = (
        <Timeline.Connector>
            <Timeline.Separator />
            <Timeline.Indicator>
                <TimelineIcon icon={item.icon} />
            </Timeline.Indicator>
        </Timeline.Connector>
    );

    // Lógica para la alineación 'center'
    if (alignItems === 'center') {
        const isEven = index % 2 === 0;
        const content = (
            <TimelineItemContent title={item.title} children={item.children} />
        );

        return (
            <Timeline.Item>
                <Timeline.Content flex="1" alignItems="flex-end">
                    {isEven && content}
                </Timeline.Content>
                {Connector}
                <Timeline.Content flex="1" alignItems="flex-start">
                    {!isEven && content}
                </Timeline.Content>
            </Timeline.Item>
        );
    }

    // Lógica para las alineaciones 'start' y 'end'
    const content = (
        <Timeline.Content
            flex={alignItems === 'end' ? '1' : undefined}
            alignItems={alignItems === 'end' ? 'flex-end' : undefined}
        >
            <TimelineItemContent title={item.title} children={item.children} />
        </Timeline.Content>
    );

    return (
        <Timeline.Item>
            {alignItems === 'end' ? content : Connector}
            {alignItems === 'end' ? Connector : content}
        </Timeline.Item>
    );
});

// --- COMPONENTE PRINCIPAL ---

export const MyTimeLine: FC<TimeLineProps> = ({
    items = MockData,
    alignItems = 'start',
    style
}) => {
    return (
        // 6. Se pasa el prop `style` al elemento raíz.
        <Timeline.Root style={style}>
            {/* 7. Un único .map() que delega la lógica de renderizado al sub-componente */}
            {items.map((item, index) => (
                <MemoizedTimelineItem
                    key={item.id} // Se usa el ID único como key
                    item={item}
                    index={index}
                    alignItems={alignItems}
                />
            ))}
        </Timeline.Root>
    );
};

// --- DATOS DE EJEMPLO ---

const MockData: TimeLineItem[] = [
    {
        id: 1, // Se añade un ID
        icon: <LuShip />,
        title: 'Product Shipped',
        children: (
            <MyText textStyle="sm">
                We shipped your product via <strong>FedEx</strong> and it should
                arrive within 3-5 business days.
            </MyText>
        )
    },
    {
        id: 2, // Se añade un ID
        icon: <LuCheck />,
        title: 'Order Confirmed',
        children: (
            <MyText textStyle="sm">
                We have received your order and will process it shortly.
            </MyText>
        )
    },
    {
        id: 3, // Se añade un ID
        icon: <LuPackage />,
        title: 'Order Delivered',
        children: (
            <MyText textStyle="sm">
                We have delivered your order and will process it shortly.
            </MyText>
        )
    }
];
