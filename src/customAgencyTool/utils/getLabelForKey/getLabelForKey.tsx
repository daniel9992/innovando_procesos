// Traduce las claves del JSON a etiquetas legibles por humanos.
export const getLabelForKey = (key: string): string => {
    const labelsMap = new Map<string, string>();

    labelsMap.set('file', 'File');
    labelsMap.set('guide', 'Guía');
    labelsMap.set('consignee', 'Consignatario');
    labelsMap.set('consolidator', 'Consolidador');
    labelsMap.set('type_procedure', 'Tipo de Trámite');
    labelsMap.set('modality', 'Modalidad');
    labelsMap.set('sellingPrice', 'Precio de Venta');
    labelsMap.set('status', 'Estado');
    labelsMap.set('dua', 'DUA');
    labelsMap.set('currency', 'Moneda');
    labelsMap.set('invoiced', 'Facturado');
    labelsMap.set('invoice_number', 'Número de Factura');
    labelsMap.set('rate', 'Monto');
    labelsMap.set('rateName', 'Nombre del documento');
    labelsMap.set('declaraitionCode', 'Código de Declaración');
    labelsMap.set('cabys', 'Cabys');
    labelsMap.set('code', 'Código');
    labelsMap.set('name', 'Nombre');
    labelsMap.set('id', 'ID');
    labelsMap.set('statusDate', 'Fecha de Estado');
    labelsMap.set('responsible', 'Responsable');
    labelsMap.set('invoice_customer', 'Facturar Cliente');
    labelsMap.set('receipt', 'Recibo');
    labelsMap.set('lastUpdate', 'Última Actualización');
    labelsMap.set('invoice_id', 'Factura');
    labelsMap.set('finishedDate', 'Fecha de Finalización');
    labelsMap.set('arrayElement', 'Elementos');
    labelsMap.set('remarks', 'Observaciones');
    labelsMap.set('iva', 'IVA');
    labelsMap.set('measuremnetUnit', 'Unidad de Medida');
    labelsMap.set('whoPaidForIt', 'Quien Pagó Por Él');
    labelsMap.set('rateObj', 'Rubro');
    labelsMap.set('units', 'Unidades');
    labelsMap.set('tlc', 'TLC');
    labelsMap.set('consolidatorId', 'ID del Consolidador');
    labelsMap.set('currencyRate', 'Tipo de Cambio');
    labelsMap.set('compra', 'Compra');
    labelsMap.set('venta', 'Venta');
    labelsMap.set('responsibleUid', 'Responsable ID');

    // iterar docDescription 10 veces
    for (let i = 0; i < 10; i++) {
        labelsMap.set(
            `docDescription.listOfDocs[${i}].docObj.docCode`,
            'Documento Codigo'
        );
        labelsMap.set(
            `docDescription.listOfDocs[${i}].docObj.docName`,
            'Documento'
        );
        labelsMap.set(
            `docDescription.listOfDocs[${i}].text`,
            'Documento Texto'
        );
    }

    // iterar servicesRatesPerFilter 10 veces
    for (let i = 0; i < 10; i++) {
        labelsMap.set(
            `servicesRatesPerFilter[${i}].rateObj.code`,
            `${i}. Servicios Codigo Rubro`
        );
        labelsMap.set(
            `servicesRatesPerFilter[${i}].rateObj.rateName`,
            `${i}. Servicios Nombre Rubro`
        );
        labelsMap.set(
            `servicesRatesPerFilter[${i}].units`,
            `${i}. Servicios Unidades `
        );
        labelsMap.set(
            `servicesRatesPerFilter[${i}].sellingPrice`,
            `${i}. Servicios Precio de Venta `
        );
        labelsMap.set(
            `servicesRatesPerFilter[${i}].rate`,
            `${i}. Servicios Tarifa `
        );
        labelsMap.set(
            `servicesRatesPerFilter[${i}].remarks`,
            `${i}. Servicios Descripcion`
        );
        labelsMap.set(
            `servicesRatesPerFilter[${i}].whoPaidForIt`,
            `${i}. Servicios Quien Pago Por`
        );
    }

    // iterar paymentsToThirdPartyRatesPer 10 veces
    for (let i = 0; i < 10; i++) {
        labelsMap.set(
            `paymentsToThirdPartyRatesPer[${i}].rateObj.code`,
            '1. Terceros Codigo Rubro'
        );
        labelsMap.set(
            `paymentsToThirdPartyRatesPer[${i}].rateObj.rateName`,
            '1. Terceros Nombre Rubro'
        );
        labelsMap.set(
            `paymentsToThirdPartyRatesPer[${i}].units`,
            '1.Terceros Unidades '
        );
        labelsMap.set(
            `paymentsToThirdPartyRatesPer[${i}].sellingPrice`,
            '1.Terceros Precio de Venta '
        );
        labelsMap.set(
            `paymentsToThirdPartyRatesPer[${i}].rate`,
            '1.Terceros Tarifa '
        );
        labelsMap.set(
            `paymentsToThirdPartyRatesPer[${i}].remarks`,
            '1.Terceros Descripcion'
        );
        labelsMap.set(
            `paymentsToThirdPartyRatesPer[${i}].whoPaidForIt`,
            '1.Terceros Quien Pago Por'
        );
    }

    // iterar cashAdvance 10 veces
    for (let i = 0; i < 10; i++) {
        labelsMap.set(`cashAdvance[${i}].nameBank`, '1. Banco');
        labelsMap.set(`cashAdvance[${i}].advance`, '1. Comprobante');
        labelsMap.set(`cashAdvance[${i}].rate`, '1. Monto');
        labelsMap.set(`cashAdvance[${i}].currency`, '1. Moneda');
    }

    // Suppliers Control
    labelsMap.set('expiration_date', 'Fecha de Expiración');
    labelsMap.set('supplier', 'Proveedor');
    labelsMap.set('invoice', 'Factura');
    labelsMap.set('internal', 'Interno');
    labelsMap.set('reason', 'Razón');
    labelsMap.set('amount_charged_in_crc', 'Monto en CRC');
    labelsMap.set('amount_charged_in_usd', 'Monto en USD');
    labelsMap.set('date_charged', 'Fecha de Pago');
    labelsMap.set('account_number', 'Número de Cuenta');

    // Transportation
    labelsMap.set('transportTicket', 'Boleta de Transporte');

    // Order Tracking
    labelsMap.set('invoiced', 'Facturado');

    // Bill of Landing
    labelsMap.set('date', 'Fecha');
    labelsMap.set('hawb', 'H-AWB');
    labelsMap.set('docID', 'Documento');
    labelsMap.set('airportOfDeparture', 'Aeroporto de Salida');
    labelsMap.set('airportOfArrival', 'Aeroporto de Llegada');
    labelsMap.set('dateOfDeparture', 'Fecha de Salida');
    labelsMap.set('dateOfArrival', 'Fecha de Llegada');

    // Proforma Invoice
    labelsMap.set('quoteNumber', 'Cotización');
    labelsMap.set('validUpTo', 'Válido Hasta');
    labelsMap.set('termsOfDelivery', 'Condiciones de Entrega');
    labelsMap.set('loadingCountry', 'País de Carga');
    labelsMap.set('downloadCountry', 'País de Descarga');
    labelsMap.set('incoterm', 'Incoterm');
    labelsMap.set('shippingCompany', 'Empresa encargada del transporte');
    labelsMap.set('shippingExecutives', 'Ejecutivo comercial');
    labelsMap.set('loadingLocation', 'Lugar de Carga');
    labelsMap.set('placeOfUnloading', 'Lugar de Descarga');
    labelsMap.set('clientName', 'Cliente');
    labelsMap.set('clientLocation', 'Direccion del Cliente');
    labelsMap.set('clientContact', 'Contacto del Cliente');
    labelsMap.set('clientPhone', 'Teléfono Cliente');
    labelsMap.set('clientEmail', 'Email Cliente');

    return labelsMap.get(key) || key;
};
