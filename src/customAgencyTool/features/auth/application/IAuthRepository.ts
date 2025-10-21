import type { IResetPasswordCredentials } from '../domain/resetPass.entity';
import type { InterfaceCurrentUser } from '../domain/user.entity';
import type { ILoginCredentials } from './login.useCase';
import type { IRegisterUserData } from './register.useCase';

// El contrato completo del repositorio
export interface IAuthRepository {
  /**
   * Registra un nuevo usuario, crea su perfil y envía un email de verificación.
   */
  register(data: IRegisterUserData): Promise<InterfaceCurrentUser>;

  /**
   * Inicia sesión de un usuario con email y contraseña.
   */
  login(credentials: ILoginCredentials): Promise<InterfaceCurrentUser>;

  /**
   *  Restablece la contraseña de un usuario.
   */
  resetPassword(credentials: IResetPasswordCredentials): Promise<void>;

  /**
   * Cierra la sesión del usuario actual.
   */
  logout(): Promise<void>;

  /**
   * Observa los cambios en el estado de autenticación en tiempo real.
   * @param callback Una función que se ejecuta cada vez que el estado de auth cambia.
   * @returns Una función para cancelar la suscripción y evitar memory leaks.
   */
  onAuthStateChanged(
    callback: (user: InterfaceCurrentUser | null) => void
  ): () => void;
}
