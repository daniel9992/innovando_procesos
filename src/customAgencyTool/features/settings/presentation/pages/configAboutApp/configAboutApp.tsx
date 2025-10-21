import {
    MyFlex,
    MyHeading,
    MyText
} from '@src/customAgencyTool/components/ui';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';

const ConfigAboutApp = () => {
    return (
        <MyFlex
            direction={'column'}
            p={5}
            width={'100%'}
            height={'100%'}
            justifyContent={'center'}
        >
            <MyFlex
                direction={'column'}
                justifyContent={'center'}
                alignItems={'center'}
            >
                <SelectedIcons iconName={'APP'} size={'5rem'} />
                <MyHeading size={'md'}>Acerca de</MyHeading>
                <MyText
                    color={'gray'}
                    fontSize={'sm'}
                    fontWeight={'medium'}
                >
                    Version: 3.0.0
                </MyText>
            </MyFlex>
            <MyFlex direction={'column'} gap={2}>
                <MyText fontSize={'sm'} textAlign={'justify'}>
                    Una herramienta de gestión de aduanas para el trabajo
                    en equipo es una plataforma digital diseñada para
                    facilitar, coordinar y automatizar los procesos
                    relacionados con importaciones, exportaciones y
                    cumplimiento normativo aduanero.
                </MyText>
                <MyText fontSize={'sm'} textAlign={'justify'}>
                    Permite que distintos miembros del equipo (agentes
                    aduanales, transportistas, personal de logística, y
                    representantes legales) colaboren en tiempo real en
                    tareas como la gestión de documentos, el seguimiento de
                    mercancías, la declaración de impuestos y el control de
                    tiempos de despacho.
                </MyText>
                <MyText fontSize={'sm'} textAlign={'justify'}>
                    Mejora la trazabilidad, reduce errores y agiliza la
                    toma de decisiones en entornos comerciales
                    internacionales.
                </MyText>
                <MyText fontSize={'sm'} textAlign={'justify'}>
                    Para soporte de la plataforma, puedes contactar con
                    nosotros a través de nuestro teléfono de soporte:{' '}
                    <br />
                    +506 8764-5402
                </MyText>
            </MyFlex>
        </MyFlex>
    );
};

export default ConfigAboutApp;
