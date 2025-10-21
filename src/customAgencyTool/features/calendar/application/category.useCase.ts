import type { InterfaceCategory } from '../domain/calendarEvent.entity';

export interface IUpdateCategory {
    categories: InterfaceCategory[];
}

export interface ICategoryRepository {
    /**
     * Lee los eventos del calendario
     */
    readCategory(): Promise<InterfaceCategory[]>;

    /**
     * Actualiza un evento en el calendario
     */
    updateCategory(args: IUpdateCategory): Promise<void>;
}

export class CategoryUseCase {
    // Inyección de Dependencias: Recibimos el repositorio vía constructor
    constructor(
        private readonly categoryRepository: ICategoryRepository
    ) {}

    read(): Promise<InterfaceCategory[]> {
        return this.categoryRepository.readCategory();
    }

    update(args: IUpdateCategory): Promise<void> {
        return this.categoryRepository.updateCategory(args);
    }
}
