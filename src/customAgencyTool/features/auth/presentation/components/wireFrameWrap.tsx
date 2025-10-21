import WallPapers from '@assets/_auth/wallpapersSmall.jpg';
import { ColorModeButton } from '@src/customAgencyTool/components/ui/color-mode';
import { MyFlex } from '@src/customAgencyTool/components/ui/myFlex';
import { type FC, type ReactNode } from 'react';

interface WireFrameWrapProps {
  children?: ReactNode;
}

const WireFrameWrap: FC<WireFrameWrapProps> = ({ children }) => {
  return (
    <MyFlex height={'100vh'} width={'100vw'} position={'relative'}>
      <MyFlex position={'absolute'} top={0} right={0}>
        <ColorModeButton />
      </MyFlex>
      <MyFlex
        flex={0.7}
        display={{ base: 'none', md: 'block' }}
        direction={'column'}
        height={'100%'}
        width={'100%'}
        justify={'center'}
        align={'center'}
        backgroundImage={`url(${WallPapers})`}
        backgroundSize={'cover'}
        backgroundPosition={'center'}
      ></MyFlex>
      <MyFlex
        flex={1}
        direction={'column'}
        justify={'center'}
        align={'center'}
        //height={'100vh'}

        gap={1}
        p={{
          base: '1rem',
          md: '2rem'
        }}
      >
        <MyFlex
          direction={'column'}
          width={{
            base: '100%',
            md: '80%',
            xl: '60%'
          }}
        >
          {children}
        </MyFlex>
      </MyFlex>
    </MyFlex>
  );
};

export default WireFrameWrap;
