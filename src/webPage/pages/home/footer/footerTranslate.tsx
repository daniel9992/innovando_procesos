export interface IColumn {
    label: string;
    href: string;
}

export interface IFooterTranslate {
    rights: string;
    column1: {
        title: string;
        list: Array<IColumn>;
    };
    column2: {
        title: string;
        list: Array<IColumn>;
    };
    subscription: {
        title: string;
        placeHolder: string;

        toastTitle: string;
        toastDescription: string;
    };
}

export const FooterTranslateEs: IFooterTranslate = {
    rights: 'Todos los derechos reservados.',
    column1: {
        title: 'Empresa',
        list: [
            {
                label: 'Información',
                href: '/info'
            },
            {
                label: 'Quiénes somos',
                href: '/about'
            }
        ]
    },
    column2: {
        title: 'Cursos Técnicos',
        list: [
            {
                label: 'Idiomas',
                href: '/sentio-app'
            },
            {
                label: 'Tecnología',
                href: '/sentio-app'
            },
            {
                label: 'Excel',
                href: '/sentio-app'
            },
            {
                label: 'Más',
                href: '/sentio-app'
            }
        ]
    },
    subscription: {
        title: 'Mantente al día',
        placeHolder: 'Tu dirección de correo electrónico',

        toastTitle: 'Gracias por suscribirte.',
        toastDescription: 'Te estaremos notificando de cualquier actualización.'
    }
};

export const FooterTranslateEn: IFooterTranslate = {
    rights: 'All rights reserved.',
    column1: {
        title: 'Company',
        list: [
            {
                label: 'About us',
                href: '/about'
            },
            {
                label: 'Information',
                href: '/info'
            }
        ]
    },
    column2: {
        title: 'Technical Courses',
        list: [
            {
                label: 'Languages',
                href: '/sentio-app'
            },
            {
                label: 'Technology',
                href: '/sentio-app'
            },
            {
                label: 'Excel',
                href: '/sentio-app'
            },
            {
                label: 'More',
                href: '/sentio-app'
            }
        ]
    },
    subscription: {
        title: 'Stay up to date',
        placeHolder: 'Your email address',

        toastTitle: 'Thanks for subscribing.',
        toastDescription: "We'll let you know about any updates."
    }
};
