import { ReadUserToSelectedUseCase } from '../application/userSelected.useCase';
import { FirebaseReadUserToSelectedRepository } from './firebaseReadUserToSelectedRepository';
import { FirebaseUserObservableRepository } from './firebaseUserObservableRepository';

// 1. Instanciamos la implementación concreta del repositorio.
export const userRepository = new FirebaseReadUserToSelectedRepository();

// 2. Instanciamos el caso de uso, INYECTANDO la instancia del repositorio
export const readUserToSelectedUseCase = new ReadUserToSelectedUseCase(
    userRepository
);

export const userAdminObservableRepository =
    new FirebaseUserObservableRepository();
