import type { IReadUserToSelected } from '../domain/readUserToSelected';

export interface IUserToSelectedRepository {
    read(): Promise<IReadUserToSelected[]>;
}

export class ReadUserToSelectedUseCase {
    // Inyección de Dependencias: Recibimos el repositorio vía constructor
    constructor(
        private readonly userRepository: IUserToSelectedRepository
    ) {}

    execute(): Promise<IReadUserToSelected[]> {
        return this.userRepository.read();
    }
}
