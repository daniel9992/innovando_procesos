// import { CallToActionTranslateEs } from "@pageComponents/callToAction/calltoActionTranslate";
// import { FooterTranslateEs } from "@pageComponents/footer/footerTranslate";
// import {
//   HomeFeature1TranslateEs,
//   HomeFeature2TranslateEs,
//   HomeFeature3TranslateEs,
// } from "@pageComponents/home-Feature/homeFeatureTranslate";
// import { FrequentQuestionEs } from "@pageComponents/home-FQ/frequentQuestionTranslate";
// import { HomeHeroTranslateEs } from "@pageComponents/home-Hero/homeHeroTranslate";
// import { TopMenuEs } from "@pageComponents/topMenu/topMenuTranslate";
// import { AboutTranslateEs } from "@pagePages/about/aboutTranslate";
// import { CourseTranslateEs } from "@pagePages/course/courseTranslate";
// import { CaptionCarouselCourseEs } from "@pagePages/course/hero/heroTranslate";
// import { InfoTranslateEs } from "@pagePages/info/infoTranslate";

import { TopMenuEs } from '@src/webPage/components/topMenu/topMenuTranslate';
import { AboutTranslateEs } from '@src/webPage/pages/about/aboutTranslate';
import { FooterTranslateEs } from '@src/webPage/pages/home/footer/footerTranslate';
import {
    HomeFeature1TranslateEs,
    HomeFeature2TranslateEs,
    HomeFeature3TranslateEs
} from '@src/webPage/pages/home/home-Feature/homeFeatureTranslate';
import { FrequentQuestionEs } from '@src/webPage/pages/home/home-FQ/frequentQuestionTranslate';
import { HomeHeroTranslateEs } from '@src/webPage/pages/home/home-Hero/homeHeroTranslate';
import { InfoTranslateEs } from '@src/webPage/pages/info/infoTranslate';

const translationsEs = {
    TopMenu: TopMenuEs,
    HomeHero: HomeHeroTranslateEs,
    HomeFeature1: HomeFeature1TranslateEs,
    HomeFeature2: HomeFeature2TranslateEs,
    HomeFeature3: HomeFeature3TranslateEs,
    FrequentQuestion: FrequentQuestionEs,
    Footer: FooterTranslateEs,
    // CaptionCarouselCourse: CaptionCarouselCourseEs,
    // CoursePage: CourseTranslateEs,
    Info: InfoTranslateEs,
    About: AboutTranslateEs
    // CallToAction: CallToActionTranslateEs,
};

export default translationsEs;
