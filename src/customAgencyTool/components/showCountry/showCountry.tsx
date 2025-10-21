import ContryListJson from '@src/customAgencyTool/constants/contries.json';
import { useMemo, type FC } from 'react';
import CountryFlag from 'react-country-flag';
import type { InterfaceCountry } from '../formik/05formikInputComplex/formikInputSelectedCountry';
import { MyFlex, MyText } from '../ui';

interface ShowCountryProps {
    country: InterfaceCountry | string;
    opctions?: {
        showText?: boolean;
    };
}

const ShowCountry: FC<ShowCountryProps> = ({ country, opctions }) => {
    const { showText = true } = opctions || {};
    /**
     *  ? -----------------------------
     *  * Variables
     *  ? -----------------------------
     */
    const countries: InterfaceCountry[] = useMemo(() => {
        try {
            // Asegurarse de que ContryListJson es un objeto/array antes de clonar
            if (typeof ContryListJson === 'object' && ContryListJson !== null) {
                return JSON.parse(
                    JSON.stringify(ContryListJson)
                ) as InterfaceCountry[];
            }
            return []; // Retornar un array vacío si el JSON no es válido o está vacío
        } catch (error) {
            console.error('Error parsing countries JSON:', error);
            return []; // En caso de error en el parseo
        }
    }, []); // Dependencia vacía porque ContryListJson se importa estáticamente

    const selectedCountry: InterfaceCountry = useMemo(() => {
        if (typeof country === 'string') {
            const countryUnknown = country as string;
            // search for country by name
            const countryFind = countries.find(
                (c) =>
                    c.name.toLowerCase() === countryUnknown.toLowerCase() ||
                    c.name.toLowerCase().includes(countryUnknown.toLowerCase())
            );

            if (countryFind) {
                return countryFind;
            }

            return {
                iso3166Code: '',
                name: countryUnknown
            };
        }

        return country;
    }, [country, countries]);

    if (typeof country === 'string' && country === '') {
        return <></>;
    }

    return (
        <MyFlex direction={'row'} gap={1} p={0} align={'center'}>
            <CountryFlag
                countryCode={selectedCountry.iso3166Code}
                svg
                style={{
                    // width: '55px',
                    width: '2em',
                    height: '1.5em',
                    display: 'block'
                }} // display: 'block' o 'flex' para evitar espacio extra debajo
                title={`Bandera de ${selectedCountry.name}`}
            />
            {showText && <MyText>{selectedCountry.name}</MyText>}
        </MyFlex>
    );
};

export default ShowCountry;
