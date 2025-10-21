// types/utils.ts

// Tipo para hacer todas las propiedades opcionales recursivamente
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Tipo para hacer todas las propiedades requeridas recursivamente
export type DeepRequired<T> = {
    [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Tipo para extraer las keys que son de cierto tipo
export type KeysOfType<T, U> = {
    [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

// Tipo para omitir ciertas propiedades recursivamente
export type DeepOmit<T, K extends string> = T extends object
    ? { [P in Exclude<keyof T, K>]: DeepOmit<T[P], K> }
    : T;

// Tipo para pick ciertas propiedades recursivamente
export type DeepPick<T, K extends keyof T> = {
    [P in K]: T[P] extends object ? DeepPick<T[P], keyof T[P]> : T[P];
};

// Tipo para hacer una propiedad nullable
export type Nullable<T> = { [P in keyof T]: T[P] | null };

// Tipo para hacer una propiedad readonly
export type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Tipo para validación de props
export type ValidateProps<Props, RequiredProps extends keyof Props> = Props &
    Required<Pick<Props, RequiredProps>>;
