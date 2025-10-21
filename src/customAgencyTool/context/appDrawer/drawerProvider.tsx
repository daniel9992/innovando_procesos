import {
  MyDrawer,
  type MyDrawerProps
} from '@src/customAgencyTool/components/ui';
import {
  createContext,
  useCallback,
  useState,
  type FC,
  type ReactNode
} from 'react';

// Definimos qué contenido y props puede aceptar nuestra función para abrir el drawer
type OpenDrawerOptions = Pick<
  MyDrawerProps,
  'header' | 'children' | 'footer' | 'placement' | 'size'
>;

// Definimos la forma del objeto que nuestro contexto proporcionará
export interface DrawerContextType {
  openDrawer: (options: OpenDrawerOptions) => void;
  closeDrawer: () => void;
  isOpen: boolean;
}

// Creamos el Context de React
export const DrawerContext = createContext<DrawerContextType | undefined>(
  undefined
);

/**
 * Este es el componente Provider. Envolverá nuestra aplicación (o una parte de ella).
 * Contiene el estado y el componente MyDrawer real que se mostrará.
 */
export const DrawerProvider: FC<{ children: ReactNode }> = ({
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [drawerProps, setDrawerProps] = useState<OpenDrawerOptions>({});

  // Usamos useCallback para memorizar las funciones y evitar renders innecesarios
  const openDrawer = useCallback((options: OpenDrawerOptions) => {
    setDrawerProps(options); // Guardamos el contenido y las props que se mostrarán
    setIsOpen(true); // Abrimos el drawer
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    // Opcional: limpiar las props después de cerrar para liberar memoria
    // setDrawerProps({});
  }, []);

  // El valor que se comparte a todos los componentes hijos
  const contextValue: DrawerContextType = {
    isOpen,
    openDrawer,
    closeDrawer
  };

  return (
    <DrawerContext.Provider value={contextValue}>
      {/* El resto de la aplicación */}
      {children}

      {/* Aquí vive el ÚNICO componente MyDrawer. 
        Está en modo controlado, y su estado y contenido son manejados por este provider.
      */}
      <MyDrawer
        isOpen={isOpen}
        onOpenChange={(open) => !open && closeDrawer()}
        {...drawerProps} // Pasamos el contenido y las opciones dinámicas
      />
    </DrawerContext.Provider>
  );
};
