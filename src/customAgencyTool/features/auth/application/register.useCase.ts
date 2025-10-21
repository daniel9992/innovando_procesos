import type { InterfaceCurrentUser } from '../domain/user.entity';
import type { IAuthRepository } from './IAuthRepository';

// Datos necesarios para el registro
export interface IRegisterUserData {
    name: string;
    email: string;
    password: string;
    phone: string;
    img?: File;
    birthday: Date;
}

export class RegisterUserUseCase {
    // Inyección de Dependencias: Recibimos el repositorio vía constructor
    constructor(private readonly authRepository: IAuthRepository) {}

    async execute(data: IRegisterUserData): Promise<InterfaceCurrentUser> {
        // Aquí puedes añadir lógica de negocio: validaciones, etc.
        // if (data.password.length < 8) {
        //   throw new Error('La contraseña debe tener al menos 8 caracteres.');
        // }

        // Delegamos la responsabilidad de la persistencia al repositorio
        const user = await this.authRepository.register(data);

        return user;
    }
}
