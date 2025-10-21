/*
  Este archivo es el "Composition Root" o Raíz de Composición.
  Su único propósito es crear las instancias de nuestras clases (dependencias)
  y conectarlas entre sí.
  Exportamos los CASOS DE USO ya listos para ser consumidos por la capa de
  presentación (Redux Thunks, hooks, etc.), ocultando los detalles de
  implementación del repositorio.
*/

// Importamos las implementaciones CONCRETAS
import { LoginUserUseCase } from '../application/login.useCase';
import { LogoutUserUseCase } from '../application/logout.useCase';
import { RegisterUserUseCase } from '../application/register.useCase';
import { ResetPasswordUseCase } from '../application/resetPass.useCase';
import { WatchAuthStateChangeUseCase } from '../application/watchAuthStateChangeUseCase';
import { FirebaseAuthRepository } from './firebaseAuthRepository';

// Importamos los CASOS DE USO que necesitan las dependencias

// --- ¡AQUÍ OCURRE LA MAGIA DE LA INSTANCIACIÓN! ---

// 1. Instanciamos la implementación concreta del repositorio.
// No necesita argumentos en el constructor porque ya importa lo que necesita (auth, firestore).
const firebaseAuthRepository = new FirebaseAuthRepository();

// 2. Instanciamos el caso de uso, INYECTANDO la instancia del repositorio
// como una dependencia en su constructor.
export const registerUserUseCase = new RegisterUserUseCase(
  firebaseAuthRepository
);

export const loginUserUseCase = new LoginUserUseCase(
  firebaseAuthRepository
);

export const logoutUserUseCase = new LogoutUserUseCase(
  firebaseAuthRepository
);

export const resetPasswordUseCase = new ResetPasswordUseCase(
  firebaseAuthRepository
);

export const watchAuthStateChangeUseCase = new WatchAuthStateChangeUseCase(
  firebaseAuthRepository
);

// Si tuviéramos más casos de uso para 'auth', usarían el mismo repositorio:
// export const loginUserUseCase = new LoginUserUseCase(firebaseAuthRepository);

// --- FIN DE LA INSTANCIACIÓN ---
