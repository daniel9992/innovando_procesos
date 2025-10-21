import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { HelmetProvider } from 'react-helmet-async';
import { Provider as ReduxStoreProvider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NotificationsProvider } from 'reapop';
import NotificationByReapop from './customAgencyTool/app/configNotificationReapop';
import { store } from './customAgencyTool/app/store';
import { Provider as ChakraProvider } from './customAgencyTool/components/ui/provider';
import ContextUniversalWrapper from './customAgencyTool/context/contextUniversalWrapper';
import { routeManagementCustomAgencyTool } from './customAgencyTool/routes/routeManagementCustomAgencyTool';
import './customAgencyTool/style/index.css';
import { routeManagementWebPage } from './webPage/routes/routeManagementWebPage';

const router = createBrowserRouter([
    ...routeManagementWebPage,
    ...routeManagementCustomAgencyTool
]);

createRoot(document.getElementById('root')!).render(
    <GoogleReCaptchaProvider
        reCaptchaKey={import.meta.env.VITE_REACT_APP_SIDE_KEY}
        scriptProps={{ async: true, defer: true, appendTo: 'head' }}
        // useRecaptchaNet
    >
        <StrictMode>
            <HelmetProvider>
                <ReduxStoreProvider store={store}>
                    <NotificationsProvider>
                        <ChakraProvider>
                            <NotificationByReapop />

                            <ContextUniversalWrapper>
                                <RouterProvider router={router} />
                            </ContextUniversalWrapper>
                        </ChakraProvider>
                    </NotificationsProvider>
                </ReduxStoreProvider>
            </HelmetProvider>
        </StrictMode>
    </GoogleReCaptchaProvider>
);
