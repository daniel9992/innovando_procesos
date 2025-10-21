import { DivContainer } from '@src/customAgencyTool/components/divContainer/divContainer';
import {
    MyButton,
    MyCenter,
    MyFlex,
    MyHeading,
    MyText
} from '@src/customAgencyTool/components/ui';
import { useRouteError } from 'react-router';

const ErrorBoundary = () => {
    const error = useRouteError() as Error;

    const handledOnReload = () => {
        window.location.href = '/';
    };

    const handledOnReturn = () => {
        window.history.back();
    };

    return (
        <DivContainer>
            <MyCenter height={'100vh'}>
                <MyFlex
                    direction={'row'}
                    gap={3}
                    flexWrap={'wrap'}
                    alignItems={'flex-end'}
                >
                    <MyFlex direction={'column'} gap={3}>
                        <MyHeading as="h1" fontSize={'2xl'}>
                            Uh oh
                        </MyHeading>
                        <MyHeading as="h2" fontSize={'xl'}>
                            Something went terribly wrong !!
                        </MyHeading>

                        <MyText borderTop={'2px solid #ccc'}>
                            {error.message || JSON.stringify(error)}
                        </MyText>
                    </MyFlex>
                    <MyFlex direction={'column'} gap={3}>
                        <MyButton
                            leftIcon={'Sync'}
                            colorPalette={'blue'}
                            onClick={handledOnReload}
                        >
                            Refrescar la página
                        </MyButton>
                        <MyButton
                            leftIcon={'ArrowLeft'}
                            colorPalette={'gray'}
                            onClick={handledOnReturn}
                        >
                            Regresar a la página anterior
                        </MyButton>
                    </MyFlex>
                </MyFlex>
            </MyCenter>
        </DivContainer>
    );
};

export default ErrorBoundary;
