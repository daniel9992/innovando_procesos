import { CategoryUseCase } from '../application/category.useCase';
import { CreateCalendarUseCase } from '../application/createCalendar.useCase';
import { DeleteCalendarUseCase } from '../application/deleteCalendar.useCase';
import { OnCalendarUpdateUseCase } from '../application/onCalendarUpdateUseCase';

import { ReadCalendarUseCase } from '../application/readCalendar.useCase';

import { UpdateCalendarUseCase } from '../application/updateCalendar.useCase';
import { FirebaseCategoryRepository } from './firebaseCategoryRepository';
import { FirebaseCalendarRepository } from './firebaseRepository';

// 1. Instanciamos la implementación concreta del repositorio.
export const calendarRepository = new FirebaseCalendarRepository();

// 2. Instanciamos el caso de uso, INYECTANDO la instancia del repositorio
export const createEventOnCalendarUseCase = new CreateCalendarUseCase(
    calendarRepository
);

export const deleteCalendarUseCase = new DeleteCalendarUseCase(
    calendarRepository
);

export const readCalendarUseCase = new ReadCalendarUseCase(
    calendarRepository
);

export const listenToCalendarUseCase = new OnCalendarUpdateUseCase(
    calendarRepository
);

export const updateCalendarUseCase = new UpdateCalendarUseCase(
    calendarRepository
);

// 3. Instanciamos los casos de uso categorias, INYECTANDO la instancia del repositorio
export const categoryRepository = new FirebaseCategoryRepository();

export const categoryUseCase = new CategoryUseCase(categoryRepository);
