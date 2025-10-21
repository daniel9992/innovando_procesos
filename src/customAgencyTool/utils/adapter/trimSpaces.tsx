/**
 * This function recursively loops through an object and removes spaces at the beginning and end of each string value.
 * If he finds a chain, he trims it.
 * If it finds an array, it processes each element of the array recursively.
 * If it finds an object, it processes each value of the object recursively.
 * If it finds any other type of value, it returns it as is.
 *
 * @param {any} obj - The object to be processed.
 * @returns {any} - The processed object with the spaces at the beginning and end of each string removed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trimSpaces = (obj: any): any => {
  if (typeof obj === "string") {
    return obj.trim();
  } else if (obj instanceof Date) {
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(trimSpaces);
  } else if (typeof obj === "object" && obj !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = trimSpaces(obj[key]);
    }
    return newObj;
  } else {
    return obj;
  }
};
