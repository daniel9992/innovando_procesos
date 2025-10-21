/**
 *  Get a random string
 * @returns string
 */
export const GetRamdom = (): string => {
    return Math.random().toString(36).substring(2, 15);
};
