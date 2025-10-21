import { initializeApp } from 'firebase/app';
import {
    connectAuthEmulator,
    getAuth,
    GoogleAuthProvider
} from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
// import { getMessaging } from 'firebase/messaging/sw';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'; // Importa getFunctions
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_REACT_APP_PROUECT_ID,
    storageBucket: import.meta.env.VITE_REACT_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_REACT_APP_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_REACT_APP_APPID
};

// Initialize Firebase Authentication and get a reference to the service
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

/**
 *  ? ----------------------------------
 *  *   Initialize App Check
 *  ? ----------------------------------
 */
export const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(import.meta.env.VITE_REACT_APP_SIDE_KEY),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
});

/**
 *  ? ----------------------------------
 *  *   Initialize Firebase Functions
 *  ? ----------------------------------
 */
export const functions = getFunctions(app, 'us-central1');

/**
 *  ? ----------------------------------
 *  *   Firebase IA
 *  ? ----------------------------------
 */
// Initialize the Gemini Developer API backend service
export const ai = getAI(app, {
    backend: new GoogleAIBackend()
});
export const model = getGenerativeModel(ai, {
    model: 'gemini-2.5-flash',
    generationConfig: {
        //maxOutputTokens: 2048, // puede ser contraproducente
        temperature: 0.7,
        topP: 1
    }
});

/**
 *  ? ----------------------------------
 *  *   Connect Emulators
 *  ? ----------------------------------
 */
if (
    false
    // window.location.hostname === 'localhost' &&
    // import.meta.env.VITE_REACT_ENV === 'development'
) {
    connectFunctionsEmulator(functions, 'localhost', 5001); // Puerto por defecto del emulador
    connectFirestoreEmulator(db, 'localhost', 8081); // Puerto por defecto del emulador
    connectAuthEmulator(auth, 'http://127.0.0.1:9099'); // Puerto por defecto del emulador
    connectStorageEmulator(storage, 'localhost', 9199); // Puerto por defecto del emulador
    console.log('Conectado al emulador de Firebase Functions');
}
