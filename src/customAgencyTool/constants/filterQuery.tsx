export interface InterfaceFilterQuery {
    direction: 'asc' | 'desc';
    field: string;
    value: string | number | Date | boolean;
    operator: QueryOperatos;
}

export interface InterfaceOrderBy {
    field: string;
    direction: 'asc' | 'desc';
}

export declare type QueryOperatos =
    | '<'
    | '<='
    | '=='
    | '!='
    | '>='
    | '>'
    | 'array-contains'
    | 'in'
    | 'array-contains-any'
    | 'not-in';
