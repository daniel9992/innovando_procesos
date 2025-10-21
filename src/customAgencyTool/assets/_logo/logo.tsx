import { MyImage } from '@src/customAgencyTool/components/ui';
import { useColorModeValue } from '@src/customAgencyTool/components/ui/color-mode';
import type { FC } from 'react';
import LogoDark from './Logo-Dark.png';
import LogoLight from './Logo-Light.png';

interface LogoProps {
  size?: string;
}

const Logo: FC<LogoProps> = ({ size = '100%' }) => {
  const useLogo = useColorModeValue(LogoLight, LogoDark);

  return (
    <MyImage
      src={useLogo}
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
