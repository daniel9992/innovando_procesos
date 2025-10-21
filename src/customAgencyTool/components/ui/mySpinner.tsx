import { Spinner, type SpinnerProps } from '@chakra-ui/react';
import type { FC } from 'react';

export const MySpinner: FC<SpinnerProps> = (props) => {
  return <Spinner size="sm" color="blue.500" {...props} />;
};
