import { useContext } from 'react';
import { DrawerContext, type DrawerContextType } from './drawerProvider';

/**
 * Este es el custom Hook.
 * Proporciona una forma fácil y segura para que los componentes accedan al contexto.
 */
export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    // Este error nos ayuda a detectar si olvidamos envolver un componente con el Provider
    throw new Error(
      'useDrawer debe ser usado dentro de un DrawerProvider'
    );
  }
  return context;
};
