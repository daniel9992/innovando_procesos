import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@src/customAgencyTool/components/ui/theme';
import { ColorModeProvider } from './color-mode';

// import "@fontsource-variable/montserrat"; // Defaults to wght axis
import '@fontsource-variable/montserrat/wght-italic.css'; // Specify axis and style
import '@fontsource-variable/montserrat/wght.css'; // Specify axis

// import "@fontsource-variable/open-sans"; // Defaults to wght axis
import '@fontsource-variable/open-sans/wght-italic.css';
import '@fontsource-variable/open-sans/wght.css'; // Specify axis

export function Provider(props: React.PropsWithChildren) {
    return (
        <ChakraProvider value={theme}>
            <ColorModeProvider>{props.children}</ColorModeProvider>
        </ChakraProvider>
    );
}
