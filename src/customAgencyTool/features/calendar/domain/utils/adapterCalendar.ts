import {
    initialCalendarEvent,
    type InterfaceCalendarEvent,
    type InterfaceCategory
} from '../calendarEvent.entity';

export const adapterCalendar = (event: InterfaceCalendarEvent) => {
    const copyEvent = { ...event };
    const newEvent = { ...initialCalendarEvent };

    newEvent.id = copyEvent.id;

    newEvent.title = copyEvent.title;
    newEvent.description = copyEvent.description;
    newEvent.status = copyEvent.status;
    newEvent.startDate = copyEvent.startDate;
    newEvent.endDate = copyEvent.endDate;
    newEvent.path = copyEvent.path;

    if (Array.isArray(copyEvent.category)) {
        newEvent.category = copyEvent.category.map(adapterCategory);
    } else {
        newEvent.category = [adapterCategory(copyEvent.category)];
    }

    if (copyEvent.isAllDay !== undefined) {
        newEvent.isAllDay = copyEvent.isAllDay;
    } else {
        newEvent.isAllDay = true;
    }

    // delete whoCreated
    if (copyEvent.whoCreated) {
        const findUser = tempUserList.find(
            (item) =>
                item.name.toLowerCase() ===
                `${copyEvent.whoCreated}`.toLowerCase()
        );

        if (findUser) {
            newEvent.sender = {
                uid: findUser.uid,
                name: findUser.name,
                email: findUser.email
            };
        }
    }

    newEvent.receiver = [
        {
            uid: 'todo',
            name: 'Todos',
            email: 'todo@todo.com'
        }
    ];

    // generate searchTerms
    if (copyEvent.searchTerms) {
        newEvent.searchTerms = [newEvent.sender.uid, 'todo'];
    } else {
        newEvent.searchTerms = [newEvent.sender.uid, 'todo'];
    }

    return newEvent;
};

const tempUserList = [
    {
        uid: '0UJvVvivuoNFSRcz5DofzJIP9iK2',
        name: 'STEVEN NÚÑEZ ALFARO',
        email: 'steven.nunez@swlogisticscr.com'
    },
    {
        uid: 'CX4v0TUA4ffqqHYILLNQtJP4Ou42',
        name: 'JOSE GUELL JIMENEZ',
        email: 'ventas@swlogisticscr.com',
        phone: '+506 6292-7870'
    },
    {
        uid: 'IDJr9R6rNPdgSEDOsIl3HStOA9j2',
        name: 'Jorge Fallas',
        email: 'aduanas@swlogisticscr.com',
        phone: '+506 6212-7737'
    },
    {
        uid: 'L1OuiYhHfiVcGprjj4ffSPO1HNA3',
        name: 'ARIEL LOPEZ ESPINOZA',
        email: 'ariel.lopez@swlogisticscr.com',
        phone: '+506 8990-4975'
    },
    {
        uid: 'LQ4YqNWXVKT32yi2PnkLlWMP2js1',
        name: 'Daniel Vargas',
        email: 'daniel.vargas@swlogisticscr.com',
        phone: '+506 8914-2502'
    },
    {
        uid: 'NwvsKsbZ4dWbmvX1NV4Nx2LILTt1',
        name: 'RAYMOND SEGURA F',
        email: 'raymond.segura@swlogisticscr.com',
        phone: '+506 8319-0430'
    },
    {
        uid: 'cFyoWkP1FAUkqCUlnPDbxjT43jk2',
        name: 'Edwin Jiménez',
        email: 'edwin.jimenez@swlogisticscr.com',
        phone: '+506 8706-4185'
    },
    {
        uid: 'kwbm8SBG4JaqsvFrPzyJzyr88lo1',
        name: 'Dereck Mendez',
        email: 'dereck.mendez@swlogisticscr.com',
        phone: '+506 7101-7079'
    },
    {
        uid: 'soyxXbwGOWT1QdGBikW2L1KAoop2',
        name: 'Carlos Perez Fait',
        email: 'cperez@swlogisticscr.com',
        phone: '+506 8335-3080'
    }
];

const adapterCategory = (category: InterfaceCategory): InterfaceCategory => {
    const newCategory = { ...category };

    if (newCategory.label === 'Vacaciones') {
        newCategory.id = 'id-vacaciones';
        newCategory.color = '#48cccd';
    }

    return newCategory;
};
