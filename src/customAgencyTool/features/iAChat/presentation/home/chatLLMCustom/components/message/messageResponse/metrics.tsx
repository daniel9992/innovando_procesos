import { MyFlex, MyText, MyTooltip } from '@src/customAgencyTool/components/ui';
import type { FC } from 'react';

export interface ResponseMetrics {
    characters: number;
    words: number;
    responseTime: number;
    codeBlocks: number;
    tables: number;
    images: number;
    timestamp: Date;
}

interface MetricsDisplayProps {
    metrics: ResponseMetrics;
    showDetailed?: boolean;
}

export const MetricsDisplay: FC<MetricsDisplayProps> = ({
    metrics,
    showDetailed = false
}) => {
    const formattedTime = new Intl.DateTimeFormat('es', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(metrics.timestamp);

    return (
        <MyFlex
            direction="row"
            gap={2}
            className="metrics-container"
            p={2}
            borderRadius="md"
            bg="gray.50"
        >
            <MetricItem
                label="Tiempo"
                value={`${metrics.responseTime}ms`}
                tooltip="Tiempo de respuesta"
            />
            <MetricItem
                label="Caracteres"
                value={metrics.characters}
                tooltip="Número total de caracteres"
            />
            <MetricItem
                label="Palabras"
                value={metrics.words}
                tooltip="Número total de palabras"
            />
            {showDetailed && (
                <>
                    <MetricItem
                        label="Código"
                        value={metrics.codeBlocks}
                        tooltip="Bloques de código"
                    />
                    <MetricItem
                        label="Tablas"
                        value={metrics.tables}
                        tooltip="Número de tablas"
                    />
                    <MetricItem
                        label="Imágenes"
                        value={metrics.images}
                        tooltip="Número de imágenes"
                    />
                    <MetricItem
                        label="Hora"
                        value={formattedTime}
                        tooltip="Hora de la respuesta"
                    />
                </>
            )}
        </MyFlex>
    );
};

interface MetricItemProps {
    label: string;
    value: string | number;
    tooltip: string;
}

const MetricItem: FC<MetricItemProps> = ({ label, value, tooltip }) => (
    <MyTooltip content={tooltip}>
        <MyFlex direction="column" align="center" className="metric-item">
            <MyText fontSize="xs" color="gray.500">
                {label}
            </MyText>
            <MyText fontSize="sm" fontWeight="bold">
                {value}
            </MyText>
        </MyFlex>
    </MyTooltip>
);
