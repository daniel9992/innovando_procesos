import type { IAuthRepository } from './IAuthRepository';

export class WatchAuthStateChangeUseCase {
  // Inyección de Dependencias: Recibimos el repositorio vía constructor
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(): Promise<void> {
    // Delegamos la responsabilidad de la persistencia al repositorio
    const unsubscribe = this.authRepository.onAuthStateChanged((user) => {
      console.log('user', user);
    });

    // Aquí puedes añadir lógica de negocio: validaciones, etc.
    // if (data.password.length < 8) {
    //   throw new Error('La contraseña debe tener al menos 8 caracteres.');
    // }

    // Cierremos la suscripción al evento de cambio de estado de autenticación
    unsubscribe();
  }
}
