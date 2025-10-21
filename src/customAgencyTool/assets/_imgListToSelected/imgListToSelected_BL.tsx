// logos
import AireFrance from '@assets/_billoflanding/bl_logos/Air-France-Logo-2009-2016.jpeg';
import CMA from '@assets/_billoflanding/bl_logos/CMA_CGM_logo.jpeg';
import Camca from '@assets/_billoflanding/bl_logos/Camca_Logo.jpeg';
import Servica from '@assets/_billoflanding/bl_logos/Logo-Grupo_Servica.jpeg';
import SWLhorizontal from '@assets/_billoflanding/bl_logos/Logo.jpeg';
import Onboard from '@assets/_billoflanding/bl_logos/Onboard.jpeg';
import SWLvertical from '@assets/_billoflanding/bl_logos/SWL_Logo.jpeg';
import type { InterfaceImgItem } from '@src/customAgencyTool/components/formik/05formikInputComplex/formikInputSelecteImgs';

export enum LogoTypes {
    AireFrance = '1',
    CMA = '2',
    Servica = '3',
    Onboard = '4',
    SWLvertical = '5',
    SWLhorizontal = '6',
    Camca = '7'
}

export const logosComnpany: InterfaceImgItem[] = [
    {
        id: '4',
        label: 'SWL Vertical',
        src: LogoTypes.SWLvertical,
        alt: 'SWL Vertical'
    },
    {
        id: '5',
        label: 'SWL Horizontal',
        src: LogoTypes.SWLhorizontal,
        alt: 'SWL Horizontal'
    }
];

export const logosBillOfLanding: InterfaceImgItem[] = [
    {
        id: '0',
        label: 'Aire France',
        src: LogoTypes.AireFrance,
        alt: 'Aire France'
    },
    {
        id: '1',
        label: 'Servica',
        src: LogoTypes.Servica,
        alt: 'Servica'
    },
    {
        id: '2',
        label: 'Camca',
        src: LogoTypes.Camca,
        alt: 'Camca'
    },
    {
        id: '3',
        label: 'CMA',
        src: LogoTypes.CMA,
        alt: 'CMA'
    },
    {
        id: '4',
        label: 'Onboard',
        src: LogoTypes.Onboard,
        alt: 'Onboard'
    },
    {
        id: '5',
        label: 'SWL Vertical',
        src: LogoTypes.SWLvertical,
        alt: 'SWL Vertical'
    },
    {
        id: '6',
        label: 'SWL Horizontal',
        src: LogoTypes.SWLhorizontal,
        alt: 'SWL Horizontal'
    }
];

export const GetImgPatyByLogoType = (logoType: string) => {
    const temp = `${logoType}`;
    switch (temp) {
        case LogoTypes.Camca:
            return Camca;
        case LogoTypes.CMA:
            return CMA;
        case LogoTypes.Onboard:
            return Onboard;
        case LogoTypes.SWLvertical:
            return SWLvertical;
        case LogoTypes.SWLhorizontal:
            return SWLhorizontal;
        case LogoTypes.AireFrance:
            return AireFrance;
        case LogoTypes.Servica:
            return Servica;

        default:
            return logoType;
    }
};
