// Reemplaza estos placeholders con tus valores reales
const YOUR_PROJECT_ID = import.meta.env.VITE_REACT_APP_PROUECT_ID; // El ID de tu proyecto Firebase
const YOUR_FUNCTIONS_REGION = 'us-central1'; // La región de tus funciones

export const getFunctionsBaseUrl = (): string => {
    if (
        false
        // process.env.NODE_ENV === 'development' &&
        // window.location.hostname === 'localhost'
    ) {
        // URL del emulador
        return `http://localhost:5001/${YOUR_PROJECT_ID}/${YOUR_FUNCTIONS_REGION}`;
    } else {
        // URL de la función desplegada
        return `https://${YOUR_FUNCTIONS_REGION}-${YOUR_PROJECT_ID}.cloudfunctions.net`;
    }
};
