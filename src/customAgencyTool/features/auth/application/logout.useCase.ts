import type { IAuthRepository } from './IAuthRepository';

export class LogoutUserUseCase {
    // Inyección de Dependencias: Recibimos el repositorio vía constructor
    constructor(private readonly authRepository: IAuthRepository) {}

    async execute(): Promise<void> {
        // clear local storage
        localStorage.clear();
        // clear session storage
        sessionStorage.clear();
        // Delegamos la responsabilidad de la persistencia al repositorio
        await this.authRepository.logout();
    }
}
