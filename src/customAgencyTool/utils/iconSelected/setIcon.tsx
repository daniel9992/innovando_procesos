import type { FC } from 'react';
import { type IconBaseProps } from 'react-icons';
import { MdOutlineReportGmailerrorred } from 'react-icons/md';
import { IconTypeGitHub, type typeGitHubIcons } from './github.icons';
import { IconTypes, type typeIcons } from './iconTypes';

// Combinar los tipos de iconos
export type CombinedIconTypes = typeIcons | typeGitHubIcons;

// Combinar los objetos de iconos
export const CombinedIcons = {
  ...IconTypes,
  ...IconTypeGitHub
};

interface InterfaceSelectedIconsProps extends IconBaseProps {
  iconName: CombinedIconTypes | string;
  source?: 'default' | 'github';
  size?: string | number; // Usamos size en lugar de boxSize
  m?: number;
  mb?: number;
  mr?: number;
  ml?: number;
  mt?: number;
  mx?: number;
  my?: number;
}

/**
 * Componente que renderiza iconos de múltiples fuentes
 * @param iconName Nombre del icono a renderizar
 * @param source Fuente del icono (opcional)
 * @param props Propiedades adicionales del icono
 * @returns Componente de icono
 */
export const SelectedIcons: FC<InterfaceSelectedIconsProps> = ({
  iconName,
  source,
  ...props
}) => {
  // Verificar si el icono existe en alguna de las colecciones
  const iconExists = Object.prototype.hasOwnProperty.call(
    CombinedIcons,
    iconName
  );

  if (!iconExists) {
    console.error(`Icon not found: ${iconName}`);
    return <MdOutlineReportGmailerrorred {...props} />;
  }

  try {
    // Si se especifica una fuente, buscar en la colección correspondiente
    let Icon;
    if (source === 'github') {
      Icon = IconTypeGitHub[iconName as typeGitHubIcons];
    } else if (source === 'default') {
      Icon = IconTypes[iconName as typeIcons];
    } else {
      // Si no se especifica fuente, buscar en la colección combinada
      Icon = CombinedIcons[iconName as CombinedIconTypes];
    }

    return Icon ? (
      <Icon {...props} />
    ) : (
      <MdOutlineReportGmailerrorred {...props} />
    );
  } catch (error) {
    console.error(`Error rendering icon: ${iconName}`, error);
    return <MdOutlineReportGmailerrorred {...props} />;
  }
};

// Tipo para ayudar con el autocompletado
export type IconNames = keyof typeof CombinedIcons;
