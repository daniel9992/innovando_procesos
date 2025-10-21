import type { IResetPasswordCredentials } from '../domain/resetPass.entity';
import type { IAuthRepository } from './IAuthRepository';

export class ResetPasswordUseCase {
  // Inyección de Dependencias: Recibimos el repositorio vía constructor
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(data: IResetPasswordCredentials): Promise<void> {
    // Delegamos la responsabilidad de la persistencia al repositorio
    await this.authRepository.resetPassword(data);
  }
}
