import { Dayjs } from 'dayjs';
import { EnumActionDateManagement } from './dayjsEnum';
import {
    DateManagement,
    type IDaysHoursMinutsSeconds,
    type InterfaceDateManagementProps
} from './dayjsManagment';

/**
 *
 * @returns {Date} - Devuelve la fecha actual en formato Date
 */

export const GetToday = () => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.TODAY,
        value1: ''
    };

    const result = DateManagement(configDate);

    return result as Date;
};

/**
 *
 * @param value1 {Date} - La fecha a la que se sumará el número de días
 * @param value2 {number} - El número de días a sumar
 * @returns {Date} - Devuelve la fecha resultante en formato Date
 */
export const SumDaysToDate = (value1: Date, value2: number) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.SUM,
        value1: value1,
        value2: value2
    };

    const result = DateManagement(configDate);

    return result as Date;
};

/**
 *
 * @param value1 {Date} - La fecha desde la cual se restará el número de días
 * @param value2 {number} - El número de días a restar
 * @returns {Date} - Devuelve la fecha resultante en formato Date
 */
export const SubtractDaysToDate = (value1: Date, value2: number) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.LEST,
        value1: value1,
        value2: value2
    };

    const result = DateManagement(configDate);

    return result as Date;
};

/**
 *
 * @param value1 {Date} - La fecha desde la cual se obtendrá el inicio del día
 * @returns {Date} - Devuelve la fecha resultante en formato Date
 */
export const StartOfDay = (value1: Date) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.STARTOFDAY,
        value1: value1
    };

    const result = DateManagement(configDate);

    return result as Date;
};
/***
 *
 * @param value1 {Date} - La fecha desde la cual se obtendrá el final del día
 * @returns {Date} - Devuelve la fecha resultante en formato Date
 */
export const EndOfDay = (value1: Date) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.END,
        value1: value1
    };

    const result = DateManagement(configDate);

    return result as Date;
};

/**
 *
 * @param value1 {Date} - La fecha que se combertirá en un número
 * @returns {number} - Devuelve la fecha en formato número iso 8061
 */
export const DateNumber = (value1: Date) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.NUMBER,
        value1: value1
    };

    const result = DateManagement(configDate);

    return result as number;
};

/**
 *
 * @param value1 {number} - El número a convertir en fecha
 * @returns {Date} - Devuelve la fecha resultado
 */
export const NumberToDate = (value1: number) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.STRING,
        value1: value1
    };

    const result = DateManagement(configDate);

    return result as Date;
};

/**
 *
 * @param value1 {Date} - La fecha string que la convertirá en formato Date
 * @returns {Date} - Devuelve la fecha en formato Date
 */
export const StringDate = (value1: string) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.STRING,
        value1: value1
    };

    const result = DateManagement(configDate);

    return result as Date;
};

/**
 *  Show Date
 * @param value1 {Date} - La fecha que se mostrará en formato string
 * @param value2 {string} - El formato de la fecha que se mostrará
 * @param value2 Eje: 'D [-] MMMM [-] YYYY', 'es' / 'D [-] MMMM [-] YYYY hh:mm:ss', 'en'
 * @param language {'es' | 'en'} - El idioma de la fecha que se mostrará
 * @returns {string} - Devuelve la fecha en formato string
 */
//es-ES
export const ShowDate = (
    value1: Date,
    value2: string,
    language: 'es' | 'en' = 'es'
) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.SHOW,
        value1: value1,
        value2: value2,
        language: language
    };

    const result = DateManagement(configDate);

    if (result === undefined) {
        return '-/-/--';
    }

    return result as string;
};

/**
 *
 * @param value1 {IObjectDate} - La fecha en formato object que se convertirá en formato Date
 * @returns {Date} - Devuelve la fecha resultante en formato Date
 */
export interface IObjectDate {
    seconds: number;
    nanoseconds: number;
}
export const ObjectDate = (value1: IObjectDate) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.OBJECT,
        value1: '',
        dateObj: value1
    };

    const result = DateManagement(configDate);

    return result as Date;
};

/**
 *
 * @param value1 {Date} - Verifica si la fecha actual es igual a la fecha de hoy
 * @returns 0 - La fecha es hoy, 1 - La fecha es pasada, 2 - La fecha es futura
 */
export const SelectedDateIsToday = (value1: Date) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.SELECTEDDATEISTODAY,
        value1: value1
    };

    const result = DateManagement(configDate);

    return result as number;
};

/**
 *
 * @param value1 {Date} - La fecha base de la comparación
 * @param value2 {Date} - La fecha a comparar con la fecha base
 * @param value3 {milliseconds | day} - La fecha a comparar con la fecha base
 * @returns -1 - La fecha anterior a la fecha de comparación
 * @returns 0 - La fecha es igual a la fecha de comparación
 * @returns 1 - La fecha es posterior a la fecha de comparación
 *
 * Eje:
 * 		11 = -1
 * 		12 = Base = 0
 * 		13 = 1
 */
export const CompareDates = (
    value1: Date,
    value2: Date,
    value3?: 'millisecond' | 'day'
) => {
    const compareTime = value3 !== undefined ? value3 : 'millisecond';

    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.COMPAREDATES,
        value1: value1,
        value2: value2,
        value3: compareTime
    };

    const result = DateManagement(configDate);

    return result as number;
};

/**
 *
 * @param value1 {Date} - La fecha desde la cual se obtendrá el número de días
 * @returns {number} - Devuelve el número de días desde la fecha
 */
export const DaysToDate = (value1: Date) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.DAYSTODATE,
        value1: value1
    };

    const result = DateManagement(configDate);

    return result as number;
};

/**
 *
 * @param value1 {Date} - La fecha desde la cual se obtendrá el número de días
 * @returns {number} - Devuelve el número de días desde la fecha
 */
export const DaysToEnd = (value1: Date) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.DAYSTOEND,
        value1: value1
    };

    const result = DateManagement(configDate);

    return result as number;
};

/**
 *
 * @param value1 {Date} - La fecha a la que se obtiene el formato de fecha correcto
 * @returns {Date} - Devuelve la fecha resultado
 */
export const DayToDayFormat = (value1: Date) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.DAYTODAYFORMAT,
        value1: value1
    };

    const result = DateManagement(configDate);

    return result as Date;
};

/**
 *
 * @param value1 {Date} - La fecha a la que se obtiene el formato de fecha correcto
 * @returns {number} - Devuelve la cantidad de dias entre la fecha inicio y la fecha fin
 */
export const HowManyDaysBetween = (value1: Date, value2: Date) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.DAYSTODATE,
        value1: value1,
        value2: value2
    };

    const result = DateManagement(configDate);

    return result as number;
};

/**
 *
 * @param value1 {Date} - Se compara la fecha actual con la fecha de inicio
 * @param value2 {Date}
 * @returns {IDaysHoursMinutsSeconds} - devuelve la cantidad de días, horas, minutos y segundos entre la fecha actual y la fecha de inicio
 */
export const HowManyDaysHoursMinutsSeconds = (value1: Date, value2: Date) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.DAYSTODATE_ON_DETAILS,
        value1: value1,
        value2: value2
    };

    const result = DateManagement(configDate);

    return result as IDaysHoursMinutsSeconds;
};

/**
 *
 * @param value1 {Date} - La fecha a la que se obtiene el fin del día
 * @param value2 {number} - El número de a utilizar
 * @param operator {string} - El operador a usar 'plus' | 'minus',
 * @param type {string} - El tipo de operador a usar
 * @returns {Date} - Devuelve la fecha resultado 'month' | 'day' | 'hour' | 'minute' | 'second'
 */
export const HandledDateWithOperators = (
    value: Date,
    value2: number,
    operator: 'plus' | 'minus',
    type: 'month' | 'day' | 'hour' | 'minute' | 'second'
) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.HANDLEDDATEWITHOPERATORS,
        value1: value as Date,
        value2: value2,
        operator: operator,
        type: type
    };

    const result = DateManagement(configDate);

    return result as Date;
};

/**
 *
 * @param value1 {Date} - La fecha a la que se obtiene el numero de 52 semanas del año
 * @returns {Date} - Devuelve el numero de la semana de la fecha indicada
 */
export const GetNumberOfWeekOfTheYear = (value: Date): number => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.WEEKOFYEAR,
        value1: value as Date
    };

    const result = DateManagement(configDate);

    return result as number;
};

export const GetWeekOftheYearPerNumber = (
    year: number,
    numberWeek: number
): Dayjs[] => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.WEEKOFPERNUMBER,
        value1: year,
        value2: numberWeek
    };

    const result = DateManagement(configDate);

    return result as Dayjs[];
};

/**
 *
 * @param monthIndex {number} - The index of the month to return the days of
 * @returns {Dayjs[]} - An array of Dayjs objects representing the days of the month
 */
export const GetMonthDaysByIndex = (monthIndex: number): Dayjs[] => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.MONTHBYINDEX,
        value1: monthIndex
    };

    const result = DateManagement(configDate);

    return result as Dayjs[];
};

/**
 *
 * @param monthIndex {number} - The index of the month to return the days of
 * @returns {Array<Dayjs[]>} - An array of arrays of Dayjs objects representing the days of the month by year
 */
export const GetMonthDays2DByIndexByYear = (
    monthIndex: number
): Array<Dayjs[]> => {
    const monthDays = GetMonthDaysByIndex(monthIndex);

    const monthDaysByYear: Array<Dayjs[]> = [];

    monthDays.forEach((day) => {
        const weekIndex = GetNumberOfWeekOfTheYear(day.toDate());
        const week = GetWeekOftheYearPerNumber(
            GetToday().getFullYear(),
            weekIndex
        );

        monthDaysByYear.push(week);
    });

    return monthDaysByYear;
};

export const GetStartAndEndOfMonth = (monthIndex: number): Dayjs[] => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.MONTHBYINDEX,
        value1: monthIndex
    };

    const result = DateManagement(configDate);

    return result as Dayjs[];
};

export const GetStartAndEndOfMonthByDate = (date: Date) => {
    const configDate: InterfaceDateManagementProps = {
        action: EnumActionDateManagement.START_END_OF_MONTH,
        value1: date
    };

    const result = DateManagement(configDate);

    if (Array.isArray(result)) {
        return {
            startDate: result[0].toDate(),
            endDate: result[1].toDate()
        };
    }
    return null;
};
