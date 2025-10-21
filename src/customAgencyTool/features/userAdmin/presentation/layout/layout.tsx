import { DivContainer } from '@src/customAgencyTool/components/divContainer/divContainer';
import { Outlet } from 'react-router';

const Layout = () => {
    return (
        <DivContainer>
            <Outlet />
        </DivContainer>
    );
};

export default Layout;
