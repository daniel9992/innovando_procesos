import {
    MyButton,
    MyDrawer,
    MyFlex,
    MyHeading,
    MyInputText,
    MyText
} from '@src/customAgencyTool/components/ui';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import moment from 'moment-timezone';
import { type FC, useCallback, useMemo, useState } from 'react';

interface InterfaceSelectedTimeZoneDrawerProps {
    showModal: boolean;
    onClose: () => void;
    timeZone: string;
    onChangeTimeZone: (timeZone: string) => void;
}

interface TimeZoneGroup {
    region: string;
    zones: {
        name: string;
        offset: number;
        formattedOffset: string;
    }[];
}

const SelectedTimeZoneDrawer: FC<InterfaceSelectedTimeZoneDrawerProps> = ({
    showModal,
    timeZone,
    onClose,
    onChangeTimeZone
}) => {
    // Estado para el filtro de búsqueda
    const [searchQuery, setSearchQuery] = useState('');

    // Organizar y memorizar las zonas horarias
    const groupedTimeZones = useMemo(() => {
        const zones = moment.tz.names().map((name) => ({
            name,
            offset: moment.tz(name).utcOffset(),
            formattedOffset: formatOffset(moment.tz(name).utcOffset())
        }));

        // Agrupar por regiones
        const groups: Record<string, TimeZoneGroup['zones']> = {};
        zones.forEach((zone) => {
            const region = zone.name.split('/')[0];
            if (!groups[region]) {
                groups[region] = [];
            }
            groups[region].push(zone);
        });

        // Ordenar por offset
        return Object.entries(groups).map(([region, zones]) => ({
            region,
            zones: zones.sort((a, b) => a.offset - b.offset)
        }));
    }, []);

    // Filtrar zonas horarias
    const filteredTimeZones = useMemo(() => {
        if (!searchQuery) return groupedTimeZones;

        const query = searchQuery.toLowerCase();
        return groupedTimeZones
            .map((group) => ({
                region: group.region,
                zones: group.zones.filter(
                    (zone) =>
                        zone.name.toLowerCase().includes(query) ||
                        zone.formattedOffset.includes(query)
                )
            }))
            .filter((group) => group.zones.length > 0);
    }, [groupedTimeZones, searchQuery]);

    // Manejador de cambio de zona horaria memorizado
    const handleTimeZoneChange = useCallback(
        (newTimeZone: string) => {
            onChangeTimeZone(newTimeZone);
            onClose();
        },
        [onChangeTimeZone, onClose]
    );

    return (
        <MyDrawer
            isOpen={showModal}
            onOpenChange={onClose}
            header="Time Zone Selection"
            placement="end"
        >
            <MyFlex
                px={3}
                my={2}
                p={0}
                py={2}
                direction={'row'}
                align={'center'}
            >
                <MyInputText
                    placeholder="Buscar zona horaria..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startAddon={<SelectedIcons iconName="Search" />}
                />
                <MyButton
                    aria-label="Clear"
                    icon={'TRASH'}
                    colorPalette={'red'}
                    variant="plain"
                    size="xs"
                    display={searchQuery ? 'flex' : 'none'}
                    onClick={() => {
                        setSearchQuery('');
                    }}
                />
            </MyFlex>

            {/* Zona horaria actual */}
            <MyFlex direction="column" px={3} mb={4} bento>
                <MyText color="gray.500">Current Time Zone</MyText>
                <MyHeading size="md" color="gray.700">
                    {timeZone}
                    <MyText as="span" fontSize="sm" color="gray.500" ml={2}>
                        ({moment.tz(timeZone).format('Z')})
                    </MyText>
                </MyHeading>
            </MyFlex>

            {/* Lista de zonas horarias */}
            <MyFlex
                direction="column"
                overflowY="auto"
                overflowX="hidden"
                maxHeight="70vh"
            >
                {filteredTimeZones.map((group) => (
                    <MyFlex direction={'column'} key={group.region} p={0}>
                        <MyHeading size="sm" px={3} py={2} bg="gray.50">
                            {group.region}
                        </MyHeading>
                        {group.zones.map((zone) => (
                            <MyButton
                                key={zone.name}
                                variant="ghost"
                                width="100%"
                                justifyContent="space-between"
                                px={3}
                                py={2}
                                height={'40px'}
                                onClick={() => handleTimeZoneChange(zone.name)}
                            >
                                <MyFlex
                                    direction="column"
                                    align="start"
                                    gap={0}
                                >
                                    <MyText>{zone.name}</MyText>
                                    <MyText fontSize="sm" color="gray.500">
                                        {zone.formattedOffset}
                                    </MyText>
                                </MyFlex>
                                {zone.name === timeZone && (
                                    <SelectedIcons iconName="Check" />
                                )}
                            </MyButton>
                        ))}
                    </MyFlex>
                ))}
            </MyFlex>
        </MyDrawer>
    );
};

// Función auxiliar para formatear el offset
const formatOffset = (offset: number): string => {
    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? '+' : '-';
    return `GMT${sign}${String(hours).padStart(2, '0')}:${String(
        minutes
    ).padStart(2, '0')}`;
};

export default SelectedTimeZoneDrawer;
