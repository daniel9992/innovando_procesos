import Logo from '@src/customAgencyTool/assets/_logo/logo';
import { MyButton, MyFlex } from '@src/customAgencyTool/components/ui';
import { SelectedIcons } from '@src/customAgencyTool/utils/iconSelected/setIcon';
import { Helmet } from 'react-helmet-async';
import WireFrameWrap from '../../components/wireFrameWrap';
import RegisterForm from './00RegisterForm';

const Register = () => {
    return (
        <WireFrameWrap>
            <Helmet>
                <title>Register</title>
            </Helmet>

            <MyFlex direction={'column'} gap={3} position={'relative'}>
                <MyFlex h={'100px'} align={'center'}>
                    <Logo />
                </MyFlex>

                <MyButton
                    url="/login"
                    position={'absolute'}
                    top={'-10'}
                    right={'-10'}
                    size={'xs'}
                    variant={'outline'}
                    colorPalette={'blue'}
                >
                    <SelectedIcons iconName={'ArrowLeft'} />
                    Regresar
                </MyButton>
            </MyFlex>

            <RegisterForm />
        </WireFrameWrap>
    );
};

export default Register;
