import { type FC } from 'react';
import { MyFlex, MyHeading, MySpinner } from '../ui';

interface Props {
  text: string;
}

const LoadingSpinnerWithText: FC<Props> = ({ text }) => {
  return (
    <MyFlex gap={3} align={'center'} direction={'column'}>
      <MySpinner size="xl" />

      <MyHeading
        fontSize={'xl'}
        color={'gray.400'}
        fontWeight={'semibold'}
        fontStyle={'italic'}
        textAlign={'center'}
      >
        {text}
      </MyHeading>
    </MyFlex>
  );
};

export default LoadingSpinnerWithText;
