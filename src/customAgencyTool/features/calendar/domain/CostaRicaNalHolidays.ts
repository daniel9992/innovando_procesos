const ColorNationalHolidays = '#9fe9c2';
const BorderColorNationalHoliday = '#fa0000';
const TextColorNationalHoliday = '#ffffff';

const GetDateSTRToday = (dateString: string) => {
    const date = new Date(dateString);
    const currentYear = new Date().getFullYear();
    date.setFullYear(currentYear);
    return date;
};

export const CostaRicanatioNalHolidays = [
    {
        id: 'CostaRicanatioNalHolidays-0',
        start: GetDateSTRToday('2025-01-01T00:00:00'),
        end: GetDateSTRToday('2025-01-01T23:59:59'),
        title: 'Año Nuevo',
        classNames: ['text-light-emphasis'],
        isAllDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    },
    {
        id: 'CostaRicanatioNalHolidays-1',
        start: GetDateSTRToday('2025-04-11T00:00:00'),
        end: GetDateSTRToday('2025-04-11T23:59:59'),
        title: 'Día de Juan Santamaría',
        classNames: ['text-light-emphasis'],
        allDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    },
    {
        id: 'CostaRicanatioNalHolidays-2',
        start: GetDateSTRToday('2025-04-17T00:00:00'),
        end: GetDateSTRToday('2025-04-17T23:59:59'),
        title: 'Jueves Santo',
        classNames: ['text-light-emphasis'],
        allDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    },
    {
        id: 'CostaRicanatioNalHolidays-3',
        start: GetDateSTRToday('2025-04-18T00:00:00'),
        end: GetDateSTRToday('2025-04-18T23:59:59'),
        title: 'Viernes Santo',
        classNames: ['text-light-emphasis'],
        allDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    },
    {
        id: 'CostaRicanatioNalHolidays-4',
        start: GetDateSTRToday('2025-05-01T00:00:00'),
        end: GetDateSTRToday('2025-05-01T23:59:59'),
        title: 'Día del Trabajador',
        classNames: ['text-light-emphasis'],
        allDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    },
    {
        id: 'CostaRicanatioNalHolidays-5',
        start: GetDateSTRToday('2025-07-25T00:00:00'),
        end: GetDateSTRToday('2025-07-25T23:59:59'),
        title: 'Anexión del Partido de Nicoya',
        classNames: ['text-light-emphasis'],
        allDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    },
    {
        id: 'CostaRicanatioNalHolidays-6',
        start: GetDateSTRToday('2025-08-02T00:00:00'),
        end: GetDateSTRToday('2025-08-02T23:59:59'),
        title: 'Día de la Virgen de los Ángeles',
        classNames: ['text-light-emphasis'],
        allDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    },
    {
        id: 'CostaRicanatioNalHolidays-7',
        start: GetDateSTRToday('2025-08-15T00:00:00'),
        end: GetDateSTRToday('2025-08-15T23:59:59'),
        title: 'Día de la Madre',
        classNames: ['text-light-emphasis'],
        allDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    },
    {
        id: 'CostaRicanatioNalHolidays-8',
        start: GetDateSTRToday('2025-08-31T00:00:00'),
        end: GetDateSTRToday('2025-08-31T23:59:59'),
        title: 'Día de la Persona Negra y la Cultura Afrocostarricense',
        classNames: ['text-light-emphasis'],
        allDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    },
    {
        id: 'CostaRicanatioNalHolidays-9',
        start: GetDateSTRToday('2025-09-15T00:00:00'),
        end: GetDateSTRToday('2025-09-15T23:59:59'),
        title: 'Día de la Independencia',
        classNames: ['text-light-emphasis'],
        allDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    },
    {
        id: 'CostaRicanatioNalHolidays-10',
        start: GetDateSTRToday('2025-12-01T00:00:00'),
        end: GetDateSTRToday('2025-12-01T23:59:59'),
        title: 'Abolición del Ejército',
        classNames: ['text-light-emphasis'],
        allDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    },
    {
        id: 'CostaRicanatioNalHolidays-11',
        start: GetDateSTRToday('2025-12-25T00:00:00'),
        end: GetDateSTRToday('2025-12-25T23:59:59'),
        title: 'Navidad',
        classNames: ['text-light-emphasis'],
        allDay: true,
        editable: false,
        display: 'background',
        backgroundColor: ColorNationalHolidays,
        borderColor: BorderColorNationalHoliday,
        textColor: TextColorNationalHoliday
    }
];
