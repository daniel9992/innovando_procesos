import { HStack, Progress } from '@chakra-ui/react';
import type { FC } from 'react';

interface ProgressProps {
  /** El texto que se mostrará junto a la barra de progreso. Es opcional. */
  label?: string;
  /** El valor actual de la barra de progreso. */
  value: number;
  /** El valor máximo posible, que representa el 100%. */
  max: number;
  /** El color de la barra de progreso. Por defecto es 'teal'. */
  colorPalette?: string;
}

export const MyProgress: FC<ProgressProps> = ({
  label,
  value,
  max,
  colorPalette = 'black'
}) => {
  // 1. Calcular el porcentaje para mostrarlo como texto.
  // Se añade una comprobación para evitar la división por cero si max es 0.
  const percentage = max > 0 ? (value / max) * 100 : 0;

  return (
    // 2. Pasar las props 'value' y 'max' al componente raíz.
    // Esto controla el estado de la barra de progreso.
    <Progress.Root
      value={value}
      max={max}
      width="100%"
      colorPalette={colorPalette}
    >
      <HStack width="100%" gap="4">
        {/* 3. Renderizar el label solo si se ha proporcionado. */}
        {label && <Progress.Label>{label}</Progress.Label>}

        {/* El Track y el Range se ajustarán automáticamente al valor del Root */}
        <Progress.Track flex="1">
          <Progress.Range />
        </Progress.Track>

        {/* 4. Mostrar el texto del valor calculado dinámicamente. */}
        {/* Usamos Math.round() para mostrar un número entero. */}
        <Progress.ValueText>{`${Math.round(
          percentage
        )}%`}</Progress.ValueText>
      </HStack>
    </Progress.Root>
  );
};
