import type { InterfaceCountry } from '../formik/05formikInputComplex/formikInputSelectedCountry';

export const getCountry = (country: InterfaceCountry | string) => {
    if (typeof country === 'string') {
        return country;
    }
    return country.name;
};
