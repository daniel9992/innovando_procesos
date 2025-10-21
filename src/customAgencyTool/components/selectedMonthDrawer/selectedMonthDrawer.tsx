import { ShowDate } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import dayjs from 'dayjs';
import { useMemo, useState, type FC } from 'react';
import { MyButton, MyDrawer, MyFlex, MyText } from '../ui';

interface Props {
    buttonSize?: 'xs' | 'sm' | 'md';
    selectedMonthIndex?: number; // El índice del mes (0-11) ya seleccionado
    selectedYear?: number; // El año ya seleccionado
    hanledonSubmit: (monthIndex: number, year: number, month: string) => void;
}

const SelectedMonthDrawer: FC<Props> = ({
    selectedMonthIndex,
    selectedYear,
    hanledonSubmit,
    buttonSize = 'xs'
}) => {
    const [isDrawerShow, setIsDrawerShow] = useState(false);

    // Determina la fecha de inicio para el selector.
    const startValue = useMemo(() => {
        if (selectedMonthIndex !== undefined && selectedYear !== undefined) {
            return dayjs().year(selectedYear).month(selectedMonthIndex);
        }
        return dayjs();
    }, [selectedMonthIndex, selectedYear]);

    const [currentYear, setCurrentYear] = useState(startValue.year());

    interface InterfaceMonth {
        month: string;
        year: number;
        isCurrent: boolean; // Si es el mes actual del mundo real
        isSelected: boolean; // Si es el mes que viene de las props
    }

    // Genera la lista de meses para el año que se está viendo
    const months = useMemo(() => {
        const monthList: Array<InterfaceMonth> = [];
        const today = dayjs();
        for (let i = 0; i < 12; i++) {
            monthList.push({
                month: ShowDate(new Date(currentYear, i, 1), 'MMMM', 'es'),
                year: currentYear,
                // ✅ Lógica para saber si es el mes ACTUAL (hoy)
                isCurrent:
                    today.get('month') === i &&
                    today.get('year') === currentYear,
                // ✅ Lógica para saber si es el mes SELECCIONADO (props)
                isSelected:
                    selectedMonthIndex === i && selectedYear === currentYear
            });
        }
        return monthList;
    }, [currentYear, selectedMonthIndex, selectedYear]);

    const handledOnClose = () => {
        setCurrentYear(startValue.year());
        setIsDrawerShow(false);
    };

    const handleMonthClick = (
        monthIndex: number,
        monthData: InterfaceMonth
    ) => {
        hanledonSubmit(monthIndex, monthData.year, monthData.month);
        handledOnClose();
    };

    return (
        <MyDrawer
            isOpen={isDrawerShow}
            onOpenChange={(isOpen) => !isOpen && handledOnClose()}
            placement={'end'}
            header={'Seleccionar Mes'}
            trigger={
                <MyButton
                    leftIcon="CALENDAR"
                    colorPalette="calendar"
                    size={buttonSize}
                    onClick={() => setIsDrawerShow(true)}
                >
                    Seleccionar Mes
                </MyButton>
            }
        >
            <p>selectedMonthIndex: {selectedMonthIndex}</p>
            {/* Navegador de Año */}
            <MyFlex
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                gap={3}
                width="100%"
            >
                <MyButton
                    aria-label="Previous-Year"
                    icon="ArrowLeft"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentYear(currentYear - 1)}
                />
                <MyText fontWeight="bold">{currentYear}</MyText>
                <MyButton
                    aria-label="Next-Year"
                    icon="ArrowRight"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentYear(currentYear + 1)}
                />
            </MyFlex>

            {/* Selector de Meses */}
            <MyFlex direction="column" gap={5} mt={5}>
                <small
                    style={{
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        color: 'gray'
                    }}
                >
                    Seleccione el mes del año
                </small>
                <MyFlex gap={5} direction="row" flexWrap="wrap" align="center">
                    {months.map((item, index) => {
                        // 🎨 Lógica de estilos mejorada para claridad
                        let variant: 'solid' | 'outline' | 'ghost' = 'ghost';
                        let colorScheme = '';

                        if (item.isSelected) {
                            variant = 'solid';
                            colorScheme = 'blue'; // Color distintivo para lo seleccionado
                        } else if (item.isCurrent) {
                            variant = 'solid';
                            colorScheme = 'purple'; // Color para el mes actual
                        }

                        return (
                            <MyButton
                                key={`${item.year}-${item.month}`}
                                variant={variant}
                                colorPalette={colorScheme}
                                size="xs"
                                onClick={() => handleMonthClick(index, item)}
                            >
                                {item.month}
                            </MyButton>
                        );
                    })}
                </MyFlex>
            </MyFlex>
        </MyDrawer>
    );
};

export default SelectedMonthDrawer;
