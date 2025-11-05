import { EventoInsert, EventoSelect, TareaInsert, TareaSelect } from "./db/schema";

export type Prioridades = 'baja' | 'media' | 'alta';

export type Roles = 'secretario' | 'comisionDirectiva' | 'admin';

export type TasksInsertData = Omit<TareaInsert, 'tareaId' | 'creadoPor' | 'fechaCreacion'>

export type EventInsertData = Omit<EventoInsert, 'done' | 'eventoId' | 'creadoPor'>

export type EventWithTasks = EventoSelect & {
  tasks: TareaSelect[]
}