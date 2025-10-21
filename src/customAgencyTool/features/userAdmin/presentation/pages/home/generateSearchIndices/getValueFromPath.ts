type NestedObject = {
  [key: string]: NestedValue;
};

type NestedValue =
  | string
  | string[]
  | number
  | boolean
  | null
  | undefined
  | NestedObject
  | NestedValue[];

/**
 * Function that extracts values from a nested object using a dot-notation path
 * @param obj - The object to extract values from
 * @param path - The dot-notation path to extract values from
 * @returns An array of string values found at the end of the path
 */

export const getValueFromPath = <T extends NestedObject>(
  obj: T,
  path: string,
): string[] => {
  // Split the path into individual property segments
  const parts = path.split('.');
  // Initialize array with the root object, casting it to NestedValue type
  let currentValues: NestedValue[] = [obj as NestedValue];
  // Array to store final string values found at the end of the path
  const finalValues: string[] = [];

  // Iterate through each path segment
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    // Temporary array to store values found at current path level
    const nextValues: NestedValue[] = [];

    for (const val of currentValues) {
      if (val && typeof val === 'object') {
        if (Array.isArray(val)) {
          val.forEach((item) => {
            if (item && typeof item === 'object' && !Array.isArray(item)) {
              const nestedVal = (item as NestedObject)[part];
              if (nestedVal !== undefined && nestedVal !== null) {
                if (Array.isArray(nestedVal)) {
                  nextValues.push(...nestedVal);
                } else {
                  nextValues.push(nestedVal);
                }
              }
            }
          });
        } else {
          const objVal = (val as NestedObject)[part];
          if (objVal !== undefined && objVal !== null) {
            if (Array.isArray(objVal)) {
              nextValues.push(...objVal);
            } else {
              nextValues.push(objVal);
            }
          }
        }
      }
    }

    currentValues = nextValues;
    if (currentValues.length === 0) break;
  }

  currentValues.forEach((v) => {
    if (v !== undefined && v !== null) {
      finalValues.push(String(v));
    }
  });

  return finalValues;
};
