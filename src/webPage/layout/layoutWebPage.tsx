import { Box, Button, Flex, Presence } from '@chakra-ui/react';
import { MyTooltip } from '@src/customAgencyTool/components/ui';
import { FaWhatsapp } from 'react-icons/fa';
import { Outlet } from 'react-router';
import TopMenu from '../components/topMenu/topMenu';
import Footer from '../pages/home/footer/footer';
import '../style/index.css';

const LayoutWebPage = () => {
    return (
        <Presence present={true}>
            <TopMenu />
            {/* <br />
            <br />
            <br />
            <br /> */}

            <Outlet />

            <Footer />

            <Flex className="bgGradientBottom"></Flex>

            <Box
                position={'fixed'}
                bottom={'6rem'}
                left={{ base: '2rem', md: '5rem' }}
                display={'inline'}
            >
                <MyTooltip content={'Whatsapp'}>
                    <Button
                        aria-label="Toggle Navigation"
                        variant="ghost"
                        shadow={'lg'}
                        height={'4em'}
                        w={'4em'}
                        position={'absolute'}
                        borderRadius={'full'}
                        color={'gray.500'}
                        bg={'#5FFC7B'}
                        _hover={{
                            bg: '#28D146',
                            color: 'white'
                        }}
                        onClick={() => {
                            window.open(
                                'https://api.whatsapp.com/send?phone=+50671584910',
                                '_blank'
                            );
                        }}
                    >
                        <FaWhatsapp />
                    </Button>
                </MyTooltip>
            </Box>
        </Presence>
    );
};

export default LayoutWebPage;
