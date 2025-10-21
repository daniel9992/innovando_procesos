import {
    MyButton,
    MyFlex,
    MyHeading
} from '@src/customAgencyTool/components/ui';
import { lazy, useState } from 'react';

const ConfigCompany = lazy(() => import('./configCompany/configCompany'));

const ConfigElectronicInvoice = lazy(
    () => import('./configElectronicInvoice/configElectronicInvoice')
);

const ConfigDocList = lazy(() => import('./configDocList/configDocList'));

const ConfigListOfRates = lazy(
    () => import('./configListOfRates/configListOfRates')
);

const ConfigAboutApp = lazy(() => import('./configAboutApp/configAboutApp'));

const SettingsPage = () => {
    const [selectedConfig, setSelectedConfig] = useState<string>(
        'ConfigAboutApp'
        // 'ConfigListOfRates'
        // 'ConfigDocList'
        // 'ConfigCompany'
    );

    return (
        <MyFlex
            direction={{
                base: 'column-reverse',
                md: 'row'
            }}
            gap={5}
            width={'100%'}
        >
            <MyFlex style={{ flex: '1.3' }}>
                {selectedConfig === 'ConfigCompany' && <ConfigCompany />}
                {selectedConfig === 'ConfigElectronicInvoice' && (
                    <ConfigElectronicInvoice />
                )}
                {selectedConfig === 'ConfigDocList' && <ConfigDocList />}
                {selectedConfig === 'ConfigListOfRates' && (
                    <ConfigListOfRates />
                )}
                {selectedConfig === 'ConfigAboutApp' && <ConfigAboutApp />}
            </MyFlex>

            <MyFlex
                bento
                direction={'column'}
                style={{
                    flex: '0.5',
                    gap: '1rem'
                }}
                height="50vh"
                p={4}
            >
                <MyHeading size={'md'}>Opciones</MyHeading>
                <MyButton
                    onClick={() => setSelectedConfig('ConfigAboutApp')}
                    leftIcon={'APP'}
                    size={'sm'}
                    justifyContent={'start'}
                    colorPalette={
                        selectedConfig === 'ConfigAboutApp'
                            ? 'selected'
                            : 'unselected'
                    }
                >
                    Acerca de
                </MyButton>

                <MyButton
                    onClick={() => setSelectedConfig('ConfigListOfRates')}
                    leftIcon={'LISTOFRATES'}
                    size={'sm'}
                    justifyContent={'start'}
                    colorPalette={
                        selectedConfig === 'ConfigListOfRates'
                            ? 'selected'
                            : 'unselected'
                    }
                >
                    Lista de Rubros
                </MyButton>
                <MyButton
                    onClick={() => setSelectedConfig('ConfigDocList')}
                    leftIcon={'DOCS'}
                    size={'sm'}
                    justifyContent={'start'}
                    colorPalette={
                        selectedConfig === 'ConfigDocList'
                            ? 'selected'
                            : 'unselected'
                    }
                >
                    Lista de Documentos
                </MyButton>

                <MyFlex direction={'column'} gap={5} p={0}>
                    <MyHeading size={'md'}>Opciones de la aplicación</MyHeading>

                    <MyFlex direction={'column'} gap={5}>
                        <MyButton
                            onClick={() => setSelectedConfig('ConfigCompany')}
                            leftIcon={'TOOLS'}
                            size={'sm'}
                            justifyContent={'start'}
                            colorPalette={
                                selectedConfig === 'ConfigCompany'
                                    ? 'selected'
                                    : 'unselected'
                            }
                        >
                            General
                        </MyButton>

                        <MyButton
                            onClick={() =>
                                setSelectedConfig('ConfigElectronicInvoice')
                            }
                            leftIcon={'ELECTRONICINVOICE'}
                            size={'sm'}
                            justifyContent={'start'}
                            colorPalette={
                                selectedConfig === 'ConfigElectronicInvoice'
                                    ? 'selected'
                                    : 'unselected'
                            }
                        >
                            Factura Electrónica
                        </MyButton>
                    </MyFlex>
                </MyFlex>
            </MyFlex>
        </MyFlex>
    );
};

export default SettingsPage;
