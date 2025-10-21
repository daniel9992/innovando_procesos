export interface InterfaceRoute {
    path: string;
    param?: string;
}

export const GetRoutePath = (
    route: InterfaceRoute,
    param?: string
): string => {
    const path = route.path;

    if (route.param) {
        if (!param) {
            throw new Error('Param is required');
        }
        return `${path}/${param}`;
    }
    return path;
};

export const ReadRoutePath = (route: InterfaceRoute) => {
    const path = route.path;

    if (route.param) {
        return `${path}/:${route.param}`;
    }
    return path;
};

export const ReducePath = (path: string, levels: number): string => {
    //entrada: 'http://localhost:5173/dashboard/ot/orderTracking-page/orderTraking/ot-form/vgu36EYIrO2WKx43lqok'

    //salida esperada: 'http://localhost:5173/dashboard/ot/orderTracking-page/orderTraking'
    // Remover trailing slash si existe
    const cleanPath = path.replace(/\/$/, '');

    // Dividir el path
    const segments = cleanPath.split('/');

    // Si levels es mayor que el número de segmentos menos 1, retornar el root
    if (levels >= segments.length) {
        return segments[0];
    }

    // Tomar todos los segmentos excepto los últimos 'levels'
    const reducedSegments = segments.slice(0, segments.length - levels);

    // Unir los segmentos nuevamente
    return reducedSegments.join('/');
};
