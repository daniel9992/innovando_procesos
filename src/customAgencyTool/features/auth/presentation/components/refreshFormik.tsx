import LoadingWithText from '@src/customAgencyTool/components/loading/loadingWithText';
import { MyFlex } from '@src/customAgencyTool/components/ui';

const RefreshFormik = () => {
  return (
    <MyFlex
      direction={'column'}
      gap={3}
      height={'250px'}
      justifyContent={'center'}
      mx={'auto'}
    >
      <LoadingWithText text={'Cargando...'} />
    </MyFlex>
  );
};

export default RefreshFormik;
