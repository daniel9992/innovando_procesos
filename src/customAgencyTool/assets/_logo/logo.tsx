import { MyImage } from '@src/customAgencyTool/components/ui';
import type { FC } from 'react';

interface LogoProps {
  size?: string;
}

const Logo: FC<LogoProps> = ({ size = '100%' }) => {
  return (
    <MyImage
      src="https://placehold.co/600x400"
      alt="Logo"
      // scale={'scale-down'}
      objectFit={'contain'}
      p={0}
      m={0}
      width={size}
      height={size}
    />
  );
};

export default Logo;
