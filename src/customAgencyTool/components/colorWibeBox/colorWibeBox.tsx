import { Box } from '@chakra-ui/react';
import {
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction
} from 'react';

interface ColorWipeBoxProps {
    isToggled?: boolean;
    setIsToggled?: Dispatch<SetStateAction<boolean>>;
    handleClick?: () => void;
    children: ReactNode;
}

export const ColorWipeBox: React.FC<ColorWipeBoxProps> = ({
    isToggled = false,
    setIsToggled = () => {},
    handleClick = () => {},
    children
}) => {
    // 1. Estado para controlar si se ha hecho clic o no
    const [isToggledLocal, setIsToggledLocal] = useState(isToggled);

    // 2. Función para alternar el estado al hacer clic
    const handleClickLocal = () => {
        setIsToggledLocal(!isToggledLocal);
        setIsToggled(isToggledLocal);
        handleClick();
    };

    return (
        <Box
            as="div"
            onClick={handleClickLocal}
            p={10} // Padding interno
            borderRadius="md" // Bordes redondeados
            cursor="pointer"
            backgroundColor="gray.200" // Color de fondo inicial
            color="black"
            fontWeight="bold"
            position="relative" // Necesario para posicionar el pseudo-elemento
            overflow="hidden" // Oculta el pseudo-elemento cuando está fuera del div
            userSelect="none" // Evita que el texto se seleccione al hacer clic
            // El prop 'sx' nos permite usar selectores avanzados como ::before
            css={{
                // Estilos para el pseudo-elemento que creará el efecto de barrido
                '&::before': {
                    content: '""', // Requerido para que el pseudo-elemento se muestre
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: isToggledLocal ? '100%' : '0%', // Ancho condicional basado en el estado
                    height: '100%',
                    backgroundColor: 'teal.400', // El color que aparecerá
                    transition: 'width 0.5s ease-in-out', // La animación del barrido
                    zIndex: 0 // Se asegura que esté detrás del texto
                },
                // Estilos para el contenido de texto para que esté sobre el barrido
                '& > *': {
                    position: 'relative',
                    zIndex: 1
                }
            }}
        >
            {children}
        </Box>
    );
};
