import type { InterfaceCurrentUser } from '../domain/user.entity';
import type { IAuthRepository } from './IAuthRepository';

// Datos necesarios para el registro
export interface ILoginCredentials {
    email: string;
    password: string;
}

export class LoginUserUseCase {
    // Inyección de Dependencias: Recibimos el repositorio vía constructor
    constructor(private readonly authRepository: IAuthRepository) {}

    async execute(data: ILoginCredentials): Promise<InterfaceCurrentUser> {
        // Delegamos la responsabilidad de la persistencia al repositorio
        const user = await this.authRepository.login(data);

        return user;
    }
}
