import Fallback from '@src/customAgencyTool/pages/fallbacks/loading/fallback';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { lazy, Suspense } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { type RouteObject } from 'react-router';

const Layout = lazy(() => import('../layout/layoutWebPage'));

const Home = lazy(() => import('../pages/home/home.page'));
const About = lazy(() => import('../pages/about/about.page'));
const Info = lazy(() => import('../pages/info/info.page'));
const Sentio = lazy(() => import('../pages/sentio/sentio.page'));

import translationsEn from '../translate/en/translationEn';
import translationsEs from '../translate/es/translationEs';

const languages = ['en', 'es'];

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        detection: { order: ['path', 'navigator'] },
        resources: {
            en: { translation: translationsEn },
            es: { translation: translationsEs }
        },
        fallbackLng: 'en',
        supportedLngs: languages,
        interpolation: { escapeValue: false }
    });

export const PageRoutes = {
    home: '/',
    about: '/about',
    info: '/info',
    login: '/login',
    sentio: '/sentio-app'
};

export const routeManagementWebPage: RouteObject[] = [
    {
        path: PageRoutes.home,
        element: (
            <I18nextProvider i18n={i18n}>
                <Suspense fallback={<Fallback />}>
                    <Layout />
                </Suspense>
            </I18nextProvider>
        ),
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: PageRoutes.about,
                element: <About />
            },
            {
                path: PageRoutes.info,
                element: <Info />
            },
            {
                path: PageRoutes.sentio,
                element: <Sentio />
            }
        ]
    }
];
