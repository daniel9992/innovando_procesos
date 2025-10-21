// --- Importaciones de Firebase y de la Arquitectura ---
import { auth, db } from '@src/customAgencyTool/core'; // Asumiendo que db es tu instancia de firestore
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    type User as FirebaseUser // Renombramos para evitar colisiones
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

// --- Importaciones de Dominio y Aplicación ---
import { GetToday } from '@src/customAgencyTool/utils/dayManagment/dayjsUtils';
import type { FirebaseError } from 'firebase/app';

import type { IAuthRepository } from '../application/IAuthRepository';
import type { ILoginCredentials } from '../application/login.useCase';
import type { IRegisterUserData } from '../application/register.useCase';
import type { IResetPasswordCredentials } from '../domain/resetPass.entity';
import {
    initialUser,
    RoleUser,
    type InterfaceCurrentUser
} from '../domain/user.entity';

/**
 * Repositorio de autenticación que implementa la interfaz IAuthRepository
 * utilizando los servicios de Firebase.
 * Toda la lógica de interacción con Firebase está encapsulada aquí.
 */
export class FirebaseAuthRepository implements IAuthRepository {
    // Hacemos las constantes parte de la clase para una mejor organización.
    private static readonly USERS_COLLECTION = 'usersCollection';
    private static readonly USER_IMG_PATH = 'user_profit_img';

    /**
     * Orquesta el proceso completo de registro de un nuevo usuario.
     * Es el ÚNICO método público para esta operación.
     */
    public async register(
        data: IRegisterUserData
    ): Promise<InterfaceCurrentUser> {
        try {
            // 1. Crear el usuario en el servicio de Autenticación de Firebase.
            const firebaseUser = await this.#createUserInAuth(
                data.email,
                data.password
            );

            // 2. Si se proporciona una imagen, subirla a Firebase Storage.
            let imageUrl = '';
            if (data.img) {
                imageUrl = await this.#uploadProfileImage(
                    data.img,
                    firebaseUser.uid
                );
            }

            // 3. Construir el objeto de perfil de usuario COMPLETO para guardarlo en Firestore.
            // NOTA ARQUITECTÓNICA: La construcción de este objeto es una responsabilidad
            // que idealmente pertenece al CASO DE USO, no al repositorio. El repositorio
            // solo debería recibir el objeto ya listo para guardarlo.
            const newUserProfile: InterfaceCurrentUser = {
                ...initialUser,
                uid: firebaseUser.uid,
                id: firebaseUser.uid,
                name: data.name,
                email: firebaseUser.email || '',
                phone: data.phone,
                img: imageUrl, // Usamos la URL de la imagen subida
                role: RoleUser.USER_AUTH,
                birthday: data.birthday,
                dateOfEntry: GetToday(),
                providerId: firebaseUser.providerId,
                countDayOff: 0,
                daysToBeValidated: []
            };

            // 4. Guardar el perfil de usuario en la colección de Firestore.
            await this.#saveUserToFirestore(newUserProfile);

            // 5. Enviar el correo de verificación al usuario recién creado.
            await this.#sendVerificationEmail(firebaseUser);

            // 6. Devolver el perfil del usuario recién creado.
            return newUserProfile;
        } catch (error) {
            console.error('Error en el proceso de registro:', error);
            if (
                (error as FirebaseError)?.code === 'auth/email-already-in-use'
            ) {
                throw new Error('El correo electrónico ya está registrado.');
            }
            throw new Error('Ocurrió un error inesperado durante el registro.');
        }
    }

    /**
     * Inicia sesión y recupera el perfil de usuario desde Firestore.
     */
    public async login(
        credentials: ILoginCredentials
    ): Promise<InterfaceCurrentUser> {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );

            const firebaseUser = userCredential.user;

            // Una vez autenticado, es CRUCIAL obtener nuestro perfil completo de Firestore
            const userProfile = await this.#getUserProfile(firebaseUser.uid);

            if (!userProfile) {
                // Este es un caso extremo donde el usuario existe en Auth pero no en nuestra DB.
                throw new Error('No se encontró el perfil del usuario.');
            }
            return userProfile;
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            // Aquí podrías adaptar el mensaje para 'auth/wrong-password' o 'auth/user-not-found'
            throw new Error(
                'El correo electrónico o la contraseña son incorrectos.'
            );
        }
    }

    /**
     * Cierra la sesión del usuario de Firebase.
     */
    public async logout(): Promise<void> {
        await signOut(auth);
    }

    /**
     * Restablece la contraseña de un usuario.
     */
    public async resetPassword(
        credentials: IResetPasswordCredentials
    ): Promise<void> {
        await sendPasswordResetEmail(auth, credentials.email);
    }

    /**
     * Establece un observador en tiempo real para el estado de autenticación.
     * Este es el método preferido para gestionar el estado de la UI.
     */
    public onAuthStateChanged(
        callback: (user: InterfaceCurrentUser | null) => void
    ): () => void {
        // onAuthStateChanged devuelve la función `unsubscribe` que necesitamos para limpiar.
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Usuario está conectado. Obtenemos su perfil de Firestore.
                const userProfile = await this.#getUserProfile(
                    firebaseUser.uid
                );
                callback(userProfile);
            } else {
                // Usuario está desconectado.
                callback(null);
            }
        });

        return unsubscribe;
    }

    // --- MÉTODOS PRIVADOS ---
    // Estos métodos son los detalles de implementación y no son visibles fuera de esta clase.

    /**
     * #1: Crea el usuario en Firebase Authentication.
     */
    async #createUserInAuth(
        email: string,
        password: string
    ): Promise<FirebaseUser> {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        return userCredential.user;
    }

    /**
     * #2: Sube la imagen de perfil a Firebase Storage y devuelve la URL de descarga.
     */
    async #uploadProfileImage(file: File, userId: string): Promise<string> {
        const storage = getStorage();
        // Usamos el UID del usuario para asociar la imagen, garantizando unicidad.
        const fileRef = ref(
            storage,
            `${FirebaseAuthRepository.USER_IMG_PATH}/${userId}-${file.name}`
        );

        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);

        return downloadURL;
    }

    /**
     * #3: Guarda el objeto del perfil del usuario en la colección de Firestore.
     */
    async #saveUserToFirestore(
        userProfile: InterfaceCurrentUser
    ): Promise<void> {
        const docRef = doc(
            db,
            FirebaseAuthRepository.USERS_COLLECTION,
            userProfile.uid
        );
        // Aquí podrías usar tu `adapterDate` si es necesario antes de guardar
        await setDoc(docRef, userProfile);
    }

    /**
     * #4: Envía un email de verificación al usuario actual.
     */
    async #sendVerificationEmail(user: FirebaseUser): Promise<void> {
        await sendEmailVerification(user);
    }

    /**
     * #5 Obtiene el perfil de un usuario desde la colección de Firestore.
     */
    async #getUserProfile(uid: string): Promise<InterfaceCurrentUser | null> {
        const docRef = doc(db, FirebaseAuthRepository.USERS_COLLECTION, uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as InterfaceCurrentUser;
        } else {
            console.warn(
                `No se encontró perfil en Firestore para el UID: ${uid}`
            );
            return null;
        }
    }
}
