import { Image as ChakraImage, type ImageProps } from '@chakra-ui/react';
import { type FC } from 'react';

type MyImageProps = ImageProps;

export const MyImage: FC<MyImageProps> = (props) => {
  return <ChakraImage {...props} />;
};
