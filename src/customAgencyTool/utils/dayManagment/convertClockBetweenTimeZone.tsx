import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Configurar plugins necesarios
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

// Constantes de zonas horarias comunes
export const TIME_ZONES = {
    COSTA_RICA: 'America/Costa_Rica',
    NEW_YORK: 'America/New_York',
    LONDON: 'Europe/London',
    TOKYO: 'Asia/Tokyo',
    UTC: 'UTC'
} as const;

// Tipos
export type TimeZone = keyof typeof TIME_ZONES;
export type DateFormat =
    | 'YYYY-MM-DD HH:mm:ss'
    | 'YYYY-MM-DD'
    | 'HH:mm:ss'
    | string;

// Clase convertidor de fechas
export class DateConverter {
    private defaultFormat: DateFormat = 'YYYY-MM-DD HH:mm:ss';

    // Convertir entre zonas horarias
    convertTimezone(
        date: Date | string,
        fromZone: string,
        toZone: string,
        format?: DateFormat
    ): string {
        return dayjs(date)
            .tz(fromZone)
            .tz(toZone)
            .format(format || this.defaultFormat);
    }

    // Obtener fecha actual en una zona horaria específica
    getCurrentTime(timezone: string, format?: DateFormat): string {
        return dayjs()
            .tz(timezone)
            .format(format || this.defaultFormat);
    }

    // Convertir a UTC
    toUTC(date: Date | string, fromZone: string): string {
        return dayjs.tz(date, fromZone).utc().format();
    }

    // Convertir desde UTC
    fromUTC(date: Date | string, toZone: string, format?: DateFormat): string {
        return dayjs
            .utc(date)
            .tz(toZone)
            .format(format || this.defaultFormat);
    }

    // Obtener diferencia horaria entre zonas
    getTimezoneOffset(zone1: string, zone2: string): number {
        const now = dayjs();
        const zone1Offset = now.tz(zone1).utcOffset();
        const zone2Offset = now.tz(zone2).utcOffset();
        return zone1Offset - zone2Offset;
    }
}

// Hook personalizado para React
export const useDateConverter = () => {
    const converter = new DateConverter();

    return {
        convertTimezone: converter.convertTimezone,
        getCurrentTime: converter.getCurrentTime,
        toUTC: converter.toUTC,
        fromUTC: converter.fromUTC,
        getTimezoneOffset: converter.getTimezoneOffset
    };
};
