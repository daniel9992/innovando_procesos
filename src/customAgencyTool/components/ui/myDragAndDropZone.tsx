import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import {
    useCallback,
    useRef,
    useState,
    type CSSProperties,
    type DragEvent,
    type FC,
    type ReactNode
} from 'react';
import { MyFlex } from './myFlex';

// --- 1. Definición de Tipos y Props ---
// Se añade la prop `style` para permitir personalización externa.
interface DragAndDropZoneProps {
    children?: ReactNode;
    onDrop: (files: FileList) => void;
    overlayText?: string;
    style?: CSSProperties;
}

// --- 2. Sub-componente para el Overlay ---
// Descomponer el overlay en su propio componente mejora la legibilidad.
const DropOverlay: FC<{ text: string }> = ({ text }) => (
    <div style={styles.overlay}>
        <MyFlex direction={'column'} align={'center'} justify={'center'}>
            <SelectedIcons iconName="UPLOAD" size={'40px'} />

            <p style={styles.overlayText}>{text}</p>
        </MyFlex>
    </div>
);

// --- 3. Componente Principal ---
export const MyDragAndDropZone: FC<DragAndDropZoneProps> = ({
    children,
    onDrop,
    overlayText = 'Suelta los archivos aquí',
    style
}) => {
    const [isDragging, setIsDragging] = useState(false);
    // 4. Usar `useRef` para un contador y evitar el "parpadeo" del overlay.
    const dragCounter = useRef(0);

    // 5. Los manejadores de eventos se memoizan con `useCallback` para optimizar.
    const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        dragCounter.current++;
        if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    }, []);

    const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    }, []);

    const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
        event.preventDefault(); // Necesario para que el evento `onDrop` se dispare.
        event.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        (event: DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            event.stopPropagation();
            setIsDragging(false);
            dragCounter.current = 0;

            const files = event.dataTransfer.files;
            if (files && files.length > 0) {
                onDrop(files);
                // Limpia la transferencia para evitar que el navegador abra el archivo.
                // event.dataTransfer.clearData();
            }
        },
        [onDrop]
    );

    return (
        // 6. Los eventos ahora se manejan directamente en el div contenedor.
        <div
            style={{ ...styles.container, ...style }}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            {children}
            {isDragging && <DropOverlay text={overlayText} />}
        </div>
    );
};

// --- 7. Estilos definidos fuera del componente ---
// Esto evita que los objetos de estilo se re-creen en cada render.
const styles: { [key: string]: CSSProperties } = {
    container: {
        position: 'relative',
        height: '100%',
        width: '100%'
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        border: '3px dashed gray', //A294F9
        borderRadius: '10px',
        zIndex: 10,
        transition: 'background-color 0.2s ease-in-out'
    },
    overlayText: {
        color: 'white',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textAlign: 'center',
        pointerEvents: 'none' // Evita que el texto interfiera con los eventos de drag.
    }
};
