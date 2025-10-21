import { CreateAgendaUseCase } from '../application/create.useCase';
import { DeleteAgendaUseCase } from '../application/delete.useCase';
import { ReadAgendaUseCase } from '../application/read.useCase';
import { ReadCustomerContactsUseCase } from '../application/readCustomer.useCase';
import { UpdateAgendaUseCase } from '../application/update.useCase';
import { FirebaseAgendaObservableRepository } from './firebaseAgendaObservableRepository';
import { FirebaseAgendaRepository } from './firebaseAgendaRepository';

export const agendaRepository = new FirebaseAgendaRepository();

export const createAgendaUseCase = new CreateAgendaUseCase(agendaRepository);

export const readAgendaUseCase = new ReadAgendaUseCase(agendaRepository);

export const readCustomerContactsUseCase = new ReadCustomerContactsUseCase(
    agendaRepository
);

export const updateAgendaUseCase = new UpdateAgendaUseCase(agendaRepository);

export const deleteAgendaUseCase = new DeleteAgendaUseCase(agendaRepository);

export const agendaObservableRepository =
    new FirebaseAgendaObservableRepository();
