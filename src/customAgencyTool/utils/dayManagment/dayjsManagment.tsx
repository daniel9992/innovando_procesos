import dayjs from 'dayjs';
import 'dayjs/locale/es';

import isoWeek from 'dayjs/plugin/isoWeek';
import { EnumActionDateManagement } from './dayjsEnum';
import type { IObjectDate } from './dayjsUtils';

dayjs.extend(isoWeek);

export interface IDaysHoursMinutsSeconds {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
export interface InterfaceDateManagementProps {
    action: EnumActionDateManagement;
    value1: Date | string | number;
    value2?: Date | string | number;
    value3?: Date | string | number;
    dateObj?: IObjectDate;
    language?: 'es' | 'en';

    operator?: 'plus' | 'minus';
    type?: 'month' | 'day' | 'hour' | 'minute' | 'second';
}
/**
 *
 * @param action {EnumActionDateManagement}
 * @param value1 {Date | string | number}
 * @param value2 {Date | string | number}
 *
 * Actions & Behavior
 *  -  SUM: The value 1 is required as the date and the value 2 as the number to sum the days to return a date
 *  -  LEST: The value 1 is required as the date and the value 2 as the number to subtract the days to return a date
 *  -  MIDDLE: The value 1 is required as the date to return a date timed at 23:59:59
 *  -  NUMBER: The value 1 is required as the date to return a number
 *  -  STRING: The value 1 is required as a number to return a date
 *  -  FROMSTRING: The value 1 is required as a string to return a date
 *  -  SHOW: The value 1 is required as the date and the value 2 as the sentence to return a sentence formatted value 2
 * @returns {string|number|boolean} - Depending on the category provided, it returns a formatted date string, a long date number
 *
 */

export const DateManagement = ({
    action,
    value1,
    value2,
    value3,
    dateObj,
    language,
    operator,
    type
}: InterfaceDateManagementProps) => {
    try {
        switch (action) {
            case EnumActionDateManagement.TODAY: {
                const a0 = dayjs(new Date());

                return a0.toDate();
            }
            case EnumActionDateManagement.SUM: {
                const a = dayjs(value1);
                const b = a.add(value2 as number, 'day');
                return b.toDate();
            }
            case EnumActionDateManagement.LEST: {
                const c = dayjs(value1);
                const d = c.subtract(value2 as number, 'day');
                return d.toDate();
            }
            case EnumActionDateManagement.STARTOFDAY: {
                const e = dayjs(value1);
                const f = e.startOf('day');
                return f.toDate();
            }
            case EnumActionDateManagement.END: {
                const e = dayjs(value1);
                const f = e.endOf('day');
                return f.toDate();
            }
            case EnumActionDateManagement.NUMBER: {
                const g = dayjs(value1);
                const h = g.valueOf();
                return h as number;
            }
            case EnumActionDateManagement.STRING: {
                const i = dayjs(value1);
                const j = i.toDate();
                return j as Date;
            }
            case EnumActionDateManagement.SHOW: {
                if (!language) {
                    language = 'es';
                }
                const k = dayjs(value1);
                const l = k.locale(language).format(value2 as string);
                return l ? (l as string) : '-/-/--';
            }
            case EnumActionDateManagement.OBJECT: {
                if (!dateObj) {
                    return '';
                }
                // Convierte los segundos a milisegundos
                const milliseconds = dateObj.seconds * 1000;
                // Usa dayjs para convertir los milisegundos en un objeto de fecha
                const date = dayjs(milliseconds);
                return date.toDate();
            }
            case EnumActionDateManagement.SELECTEDDATEISTODAY: {
                const hoy = dayjs();
                const fechaX = dayjs(value1);

                if (fechaX.isSame(hoy, 'day')) {
                    return 0;
                } else if (fechaX.isAfter(hoy, 'day')) {
                    // antes
                    return 1;
                } else {
                    return -1;
                }
            }

            case EnumActionDateManagement.COMPAREDATES: {
                // Usage Examples:
                // 10:00:00 es 09:00:00 = 1
                // 10:00:00 es 10:00:00 = 0
                // 10:00:00 es 11:00:00 = -1

                let compareTime = true;

                if (value3 !== undefined) {
                    if (typeof value3 === 'string') {
                        if (value3.includes('millisecond')) {
                            compareTime = true;
                        }
                        if (value3.includes('day')) {
                            compareTime = false;
                        }
                    }
                }

                const dateA = dayjs(value1);
                const dateB = dayjs(value2);

                const unit = compareTime ? 'millisecond' : 'day';

                if (dateA.isBefore(dateB, unit)) {
                    return -1;
                } else if (dateA.isAfter(dateB, unit)) {
                    return 1;
                } else {
                    return 0;
                }
            }
            case EnumActionDateManagement.DAYSTODATE: {
                const hoy1 = dayjs(value1);
                const fechaObjetivo = dayjs(value2);

                return fechaObjetivo.diff(hoy1, 'day');
            }

            case EnumActionDateManagement.DAYSTODATE_ON_DETAILS: {
                let dateA = dayjs(value1);
                let dateB = dayjs(value2);

                // Ensure dateA is after dateB for consistent positive differences
                if (dateA.isBefore(dateB)) {
                    [dateA, dateB] = [dateB, dateA];
                }

                // Calculate the total seconds difference between the two dates
                const diffInSeconds = dateA.diff(dateB, 'second');
                const absDiffInSeconds = Math.abs(diffInSeconds);

                const days = Math.floor(absDiffInSeconds / 86400);
                const hours = Math.floor(
                    (absDiffInSeconds % 86400) / 3600
                );
                const minutes = Math.floor((absDiffInSeconds % 3600) / 60);
                const seconds = absDiffInSeconds % 60;

                const result: IDaysHoursMinutsSeconds = {
                    days: diffInSeconds < 0 ? -days : days,
                    hours: diffInSeconds < 0 ? -hours : hours,
                    minutes: diffInSeconds < 0 ? -minutes : minutes,
                    seconds: diffInSeconds < 0 ? -seconds : seconds
                };

                return result;
            }

            case EnumActionDateManagement.ENDOFDAY: {
                const endday = dayjs(value1).endOf('day');
                return endday.toDate();
            }
            case EnumActionDateManagement.DAYSTOEND: {
                const toDay = dayjs(value1);
                const diasEnEsteMes = toDay.daysInMonth();
                const diaActual = toDay.date();

                // Calcula los días restantes
                const diasHastaElFinalDelMes = diasEnEsteMes - diaActual;

                return diasHastaElFinalDelMes;
            }
            case EnumActionDateManagement.DAYTODAYFORMAT: {
                const toDay = dayjs(value1);
                return toDay.toDate();
            }
            case EnumActionDateManagement.HANDLEDDATEWITHOPERATORS: {
                // validar que value1 es Date
                if (!(value1 instanceof Date)) {
                    throw new Error('Date error');
                }

                // validar que value2 es number
                if (typeof value2 !== 'number') {
                    throw new Error('Variant dosent exsit');
                }

                const date = dayjs(value1);

                if (type === 'month') {
                    if (operator === 'plus') {
                        return date.add(value2, 'month').toDate();
                    } else {
                        return date.subtract(value2, 'month').toDate();
                    }
                } else if (type === 'day') {
                    if (operator === 'plus') {
                        return date.add(value2, 'day').toDate();
                    } else {
                        return date.subtract(value2, 'day').toDate();
                    }
                } else if (type === 'hour') {
                    if (operator === 'plus') {
                        return date.add(value2, 'hour').toDate();
                    } else {
                        return date.subtract(value2, 'hour').toDate();
                    }
                } else if (type === 'minute') {
                    if (operator === 'plus') {
                        return date.add(value2, 'minute').toDate();
                    } else {
                        return date.subtract(value2, 'minute').toDate();
                    }
                } else if (type === 'second') {
                    if (operator === 'plus') {
                        return date.add(value2, 'second').toDate();
                    } else {
                        return date.subtract(value2, 'second').toDate();
                    }
                }
                return value1;
            }
            case EnumActionDateManagement.WEEKOFYEAR: {
                const week = dayjs(value1).isoWeek();
                return week;
            }
            case EnumActionDateManagement.WEEKOFPERNUMBER: {
                if (
                    typeof value1 !== 'number' ||
                    typeof value2 !== 'number'
                ) {
                    throw new Error('Variant dosent exsit');
                }
                const year = value1 as number;
                const weekNumber = value2 as number;

                const startOfWeek = dayjs()
                    .year(year)
                    .isoWeek(weekNumber)
                    .startOf('isoWeek'); // Inicio de la semana ISO

                const dates: dayjs.Dayjs[] = [];
                for (let i = 0; i < 7; i++) {
                    dates.push(startOfWeek.add(i, 'day')); // Agregar cada día de la semana
                }

                return dates;
            }
            case EnumActionDateManagement.MONTHBYINDEX: {
                const month = dayjs().month(value1 as number);

                const monthDays: dayjs.Dayjs[] = [];
                for (let i = 1; i <= month.daysInMonth(); i++) {
                    monthDays.push(month.date(i));
                }

                return monthDays;
            }
            case EnumActionDateManagement.START_END_OF_MONTH: {
                const date = dayjs(value1 as Date);

                const currentDate = dayjs(date);

                // Obtener el primer día del mes
                const startDate = currentDate.startOf('month');

                // Obtener el último día del mes
                const endDate = currentDate.endOf('month');

                return [startDate, endDate];
            }
        }
    } catch (error) {
        console.error(error);

        throw error;
    }
};
