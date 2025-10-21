import { AES, enc } from 'crypto-js';

// const SECRET_KEY = "una clave secreta"; // Reemplaza esto con tu propia clave secreta

export const persistSessionStorage = <T,>(key: string, value: T) => {
	// validate data

	const strValue = JSON.stringify(value);

	const encryptedValue = AES.encrypt(
		strValue,
		import.meta.env.VITE_REACT_APP_PUBLIC_KEY_SESSION_STORAGE
	).toString();
	sessionStorage.setItem(key, encryptedValue);
};

export const getFromSessionStorage = (key: string) => {
	const encryptedValue = sessionStorage.getItem(key);
	if (encryptedValue) {
		const bytes = AES.decrypt(
			encryptedValue,
			import.meta.env.VITE_REACT_APP_PUBLIC_KEY_SESSION_STORAGE
		);
		const decryptedValue = bytes.toString(enc.Utf8);
		return JSON.parse(decryptedValue);
	}
	return null;
};

export const clearSessionStorage = (key: string) => {
	sessionStorage.removeItem(key);
};

//---------------------------------------------------------
export const persistLocalStorage = <T,>(key: string, value: T) => {
	// validate data
	if (!value) {
		return undefined;
	}

	const strValue = JSON.stringify(value);

	const encryptedValue = AES.encrypt(
		strValue,
		import.meta.env.VITE_REACT_APP_PUBLIC_KEY_SESSION_STORAGE
	).toString();
	localStorage.setItem(key, encryptedValue);
};

export const getFromLocalStorage = (key: string) => {
	const encryptedValue = localStorage.getItem(key);
	if (encryptedValue) {
		const bytes = AES.decrypt(
			encryptedValue,
			import.meta.env.VITE_REACT_APP_PUBLIC_KEY_SESSION_STORAGE
		);
		const decryptedValue = bytes.toString(enc.Utf8);
		return JSON.parse(decryptedValue);
	}
	return null;
};

export const clearLocalStorage = (key: string) => {
	localStorage.removeItem(key);
};
