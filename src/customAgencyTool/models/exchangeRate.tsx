import * as Yup from 'yup';

export interface InterfaceExchange {
	compra: {
		fecha: Date;
		valor: number;
	};
	venta: {
		fecha: Date;
		valor: number;
	};
}

export interface InterfaceExchangeRate {
	dolar: InterfaceExchange;
	euro: InterfaceExchange;
}

export interface InterfaceFerchHacienda {
	dolar: {
		venta: {
			fecha: string;
			valor: number;
		};
		compra: {
			fecha: string;
			valor: number;
		};
	};
	euro: {
		fecha: string;
		dolares: number;
		colones: number;
	};
}

export const InterfaceExchangeRateSchema = Yup.object().shape({
	compra: Yup.object().shape({
		fecha: Yup.date(),
		valor: Yup.number().required('Debe ingresar el valor de la compra'),
	}),
	venta: Yup.object().shape({
		fecha: Yup.date(),
		valor: Yup.number().required('Debe ingresar el valor de la venta'),
	}),
});
