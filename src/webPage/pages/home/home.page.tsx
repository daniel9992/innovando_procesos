import { Helmet } from 'react-helmet-async';
import { HomeFeature } from './home-Feature/homeFeature1';
import FrequentQuestion from './home-FQ/frequentQuestion';
import HomeHero from './home-Hero/homeHero';

const HomePage = () => {
    return (
        <div>
            <Helmet>
                <title>Home</title>
            </Helmet>

            <HomeHero />

            <br />
            <br />
            <br />

            <HomeFeature />
            <br />
            <br />
            <br />

            <FrequentQuestion />
            <br />
            <br />
        </div>
    );
};

export default HomePage;
