import { Heading, type HeadingProps } from '@chakra-ui/react';
import type { FC } from 'react';

type InputCustomProps = HeadingProps;

export const MyHeading: FC<InputCustomProps> = ({
  children,
  ...props
}) => {
  return (
    <Heading m={0} p={0} {...props}>
      {children}
    </Heading>
  );
};
