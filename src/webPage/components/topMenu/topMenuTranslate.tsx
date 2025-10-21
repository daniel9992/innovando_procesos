export interface InterfaceLinkTranslate {
    label: string;
    subLabel?: string;
    href?: string;
}

export interface InterfaceTopMenuTranslate {
    btLogin: string;
    link1: {
        label: string;
        href: string;
        children: Array<InterfaceLinkTranslate>;
    };
    link2: {
        label: string;
        href: string;
        children: Array<InterfaceLinkTranslate>;
    };
    link3: {
        label: string;
        href: string;
        children: Array<InterfaceLinkTranslate>;
    };
}

export const TopMenuEs: InterfaceTopMenuTranslate = {
    btLogin: 'Entrar',

    link1: {
        label: 'Información',
        href: '/info',
        children: [
            {
                label: 'ADN',
                subLabel: 'La capacidad de lograr sus metas empresariales.',
                href: '/info#adn'
            },
            {
                label: 'Asesoría profesional.',
                subLabel: 'Soluciones personalizadas para mejorar su negocio.',
                href: '/info#profesional-advice'
            },
            {
                label: 'Reinspección procesos.',
                subLabel:
                    'En bases a la experiencia, los procesos empresariales son los que más se adaptan a las necesidades de cada empresa.',
                href: '/info#process-refinement'
            },
            {
                label: 'Administración del riesgo',
                subLabel: 'Conoce cómo gestionar el riesgo de su empresa.',
                href: '/info#risk-management'
            }
        ]
    },
    link2: {
        label: 'Acerca de nosotros',
        href: '/about',
        children: [
            {
                label: 'Nuestro equipo',
                subLabel: 'Conoce a nuestro equipo de expertos.',
                href: '/about#our-team'
            },
            {
                label: 'Nuestros servicios',
                subLabel:
                    'Conoce nuestros servicios de asesoramiento empresarial.',
                href: '/about#our-services'
            },
            {
                label: 'Nuestra experiencia',
                subLabel: 'Conoce nuestra experiencia y compromiso.',
                href: '/about#our-experience'
            }
        ]
    },
    link3: {
        label: 'SENTIO',
        href: '/sentio-app',
        children: [
            {
                label: 'Idiomas',
                subLabel: 'Conoce los idiomas que ofrecemos.',
                href: '/sentio-app'
            },
            {
                label: 'Tecnología',
                subLabel: 'Los temás de tecnología que puedes aprender.',
                href: '/sentio-app'
            },
            {
                label: 'Excel',
                subLabel: 'Lleva tus conocimeintos a la próxima etapa.',
                href: '/sentio-app#excel'
            },
            {
                label: 'Más',
                subLabel: 'Conozca más cursos.',
                href: '/sentio-app'
            }
        ]
    }
};

export const TopMenuEn: InterfaceTopMenuTranslate = {
    btLogin: 'Login',
    link1: {
        label: 'Information',
        href: '/info',
        children: [
            {
                label: 'ADN',
                subLabel: 'The ability to achieve your business goals.',
                href: '/info#adn'
            },
            {
                label: 'Professional Advice.',
                subLabel: 'Custom solutions to improve your business.',
                href: '/info#profesional-advice'
            },
            {
                label: 'Process Refinement.',
                subLabel:
                    'Based on experience, business processes are the ones that most adapt to the needs of each company.',
                href: '/info#process-refinement'
            },
            {
                label: 'Risk Management.',
                subLabel: "Learn how to manage your company's risks.",
                href: '/info#risk-management'
            }
        ]
    },
    link2: {
        label: 'About Us',
        href: '/about',
        children: [
            {
                label: 'Our Team',
                subLabel: 'Discover our team of experts.',
                href: '/about#our-team'
            },
            {
                label: 'Our Services',
                subLabel: 'Discover our professional advice services.',
                href: '/about#our-services'
            },
            {
                label: 'Our Experience',
                subLabel: 'Discover our experience and commitment.',
                href: '/about#our-experience'
            }
        ]
    },
    link3: {
        label: 'SENTIO',
        href: '/sentio-app',
        children: [
            {
                label: 'Languages',
                subLabel: 'Know the languages we offer.',
                href: '/sentio-app'
            },
            {
                label: 'Technology',
                subLabel: 'The technology topics you can learn.',
                href: '/sentio-app'
            },
            {
                label: 'Excel',
                subLabel: 'Take your knowledge to the next stage.',
                href: '/sentio-app'
            },
            {
                label: 'More',
                subLabel: 'Learn more courses.',
                href: '/sentio-app'
            }
        ]
    }
};
