'use server'

import { evento, EventoSelect, tarea, TareaSelect, tipoEvento, TipoEventoSelect } from "@/db/schema";
import { getCurrentUser } from "./users";
import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { formateDate } from '@/lib/utils'
import { and, asc, eq, like } from "drizzle-orm";
import { EventInsertData, TasksInsertData } from "@/types";
import { StandardResponse } from "./types";

export type EventWithType = Omit<EventoSelect, 'fecha'> & {
  tipoEvento: TipoEventoSelect | undefined | null
  fecha: string
}

export async function getEvents(completedEvents: 'all' | 'true' | 'false' = 'false', type?: number, q: string = ''): Promise<{ success: boolean, message?: string, data: EventWithType[] }> {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect('/login')
  }

  const hasPermission = await auth.api.userHasPermission({
    body: {
      userId: currentUser.id,
      role: currentUser.role,
      permission: { events: ['view-events'] }
    }
  })

  if (!hasPermission) {
    return { success: false, message: 'No tienes permiso para ver los eventos', data: [] }
  }

  const whereConditions = [like(evento.nombre, `${q}%`)]

  if (completedEvents !== 'all') {
    whereConditions.push(eq(evento.done, completedEvents === 'true'))
  }

  if (type) {
    whereConditions.push(eq(evento.tipoEventoId, type))
  }

  const events = await db.select()
    .from(evento)
    .leftJoin(tipoEvento, eq(evento.tipoEventoId, tipoEvento.tipoEventoId))
    .where(and(...whereConditions))
    .orderBy(asc(evento.done), asc(evento.fecha))

  const enrichedEvents = events.map(e => ({
    ...e.evento,
    fecha: e.evento.fecha ? formateDate(e.evento.fecha) : 'Sin fecha',
    tipoEvento: e.tipo_evento
  }))

  return { success: true, data: enrichedEvents }
}

export async function createEvent(
  { eventData, tasks }:
    { eventData: EventInsertData, tasks: TasksInsertData[] }
): Promise<StandardResponse & { eventId: number | null }> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      redirect('/login');
    }

    // 🔒 Verificar permisos del usuario
    const hasPermission = await auth.api.userHasPermission({
      body: {
        userId: currentUser.id,
        role: currentUser.role,
        permission: { events: ["manage-events"] }
      }
    });

    if (!hasPermission) {
      redirect('/events')
    }

    // 🧾 Insertar el evento principal
    const [newEvent] = await db.insert(evento).values({
      ...eventData,
      creadoPor: currentUser.id
    }).returning({ id: evento.eventoId }); // Drizzle retorna el id creado

    if (!newEvent?.id) {
      return {
        success: false,
        message: "No se pudo crear el evento. Intenta nuevamente.",
        eventId: null
      };
    }

    // 🪄 Insertar las tareas asociadas (si hay)
    if (tasks && tasks.length > 0) {
      const tasksToInsert = tasks.map(t => ({
        ...t,
        eventoId: newEvent.id,
        creadoPor: currentUser.id
      }));

      await db.insert(tarea).values(tasksToInsert);
    }

    // ✅ Todo salió bien
    return {
      success: true,
      message: "Evento creado correctamente",
      eventId: newEvent.id
    };

  } catch (error) {
    console.error("Error al crear el evento:", error);

    // 🧠 Mensaje entendible para el usuario
    return {
      success: false,
      message: "Ocurrió un error al crear el evento. Verifica los datos e inténtalo nuevamente.",
      eventId: null
    };
  }
}

type GetEventResponse = StandardResponse & ({
  success: true
  event: EventoSelect & { tipoEvento: string }
} | {
  success: false
  message: string
  event: null
})

export async function getEventById(eventId: number): Promise<GetEventResponse> {
  // devolver la info del evento SIN sus tareas

  const event = (
    await db.select()
      .from(evento)
      .where(eq(evento.eventoId, eventId))
      .leftJoin(tipoEvento, () => eq(tipoEvento.tipoEventoId, evento.tipoEventoId))
  )[0]

  if (!event.evento) {
    return {
      success: false,
      event: null,
      message: `Evento con el ID ${eventId} no pudo encontrarse`
    }
  }

  return {
    success: true,
    event: { ...event.evento, tipoEvento: event.tipo_evento?.nombre ?? 'sin aclarar' }
  }
}

type GetEventTasksProps = {
  eventId: number
  page: number
  limit: number
  all?: false
} | {
  all: true
  eventId: number
  page?: never
  limit?: never
}

export async function getEventTasks({ eventId, page, limit, all }: GetEventTasksProps): Promise<TareaSelect[]> {
  if (all) {
    return await db.select()
      .from(tarea)
      .where(eq(tarea.eventoId, eventId))
  }

  return await db.select()
    .from(tarea)
    .where(eq(tarea.eventoId, eventId))
    .limit(limit)
    .offset((page - 1) * limit)

}

export async function markEventAsComplete(eventId: number): Promise<StandardResponse> {
  // Marcar el evento con el ID pasado como completado solo si TODAS sus tareas están completadas.

  const allTasksCompleted = (await db.select()
    .from(tarea)
    .where(eq(tarea.eventoId, eventId)))
    .every(t => t.hecha);

  if (!allTasksCompleted) {
    return {
      success: false,
      message: 'No se puede marcar el evento como completado porque hay tareas pendientes.'
    };
  }

  await db.update(evento).set({ done: true }).where(eq(evento.eventoId, eventId));

  return {
    success: true,
    message: 'Evento marcado como completado'
  }
}

export async function markEventAsUncomplete(eventId: number): Promise<StandardResponse> {
  await db.update(evento).set({ done: false }).where(eq(evento.eventoId, eventId));
  return { success: true, message: 'Evento marcado como incompleto' }
}

export async function deleteEvent(eventId: number): Promise<StandardResponse> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      redirect('/login');
    }

    // 🔒 Verificar permisos
    const hasPermission = await auth.api.userHasPermission({
      body: {
        userId: currentUser.id,
        role: currentUser.role,
        permission: { events: ["manage-events"] }
      }
    });

    if (!hasPermission) {
      return redirect('/events');
    }

    // 🕵️ Verificar que el evento exista y pertenezca al usuario (si aplica)
    const existingEvent = await db.query.evento.findFirst({
      where: eq(evento.eventoId, eventId)
    });

    if (!existingEvent) {
      return {
        success: false,
        message: "El evento no existe o ya fue eliminado"
      };
    }

    // ⚠️ (Opcional) Si querés asegurar que solo pueda borrar eventos que creó él mismo:
    if (existingEvent.creadoPor !== currentUser.id && currentUser.role !== "admin") {
      return {
        success: false,
        message: "No puedes eliminar un evento que no creaste"
      };
    }

    // 🧹 Eliminar tareas asociadas al evento
    await db.delete(tarea).where(eq(tarea.eventoId, eventId));

    // 🗑️ Eliminar el evento
    const result = await db.delete(evento).where(eq(evento.eventoId, eventId));
    const affected = result.rowsAffected ?? 0;

    if (affected === 0) {
      return {
        success: false,
        message: "No se pudo eliminar el evento. Intenta nuevamente."
      };
    }

    // ✅ Todo salió bien
    return {
      success: true,
      message: "Evento eliminado correctamente"
    };

  } catch (error) {
    const err = error as Error
    console.error("Error al eliminar el evento:", err);

    return {
      success: false,
      message: err.message || "Ocurrió un error al eliminar el evento. Intenta nuevamente."
    };
  }
}

interface UpdateEventProps {
  eventId: number
  eventData: EventInsertData
  tasks: (TasksInsertData & { taskId?: number })[]
}

export async function updateEvent({ eventId, eventData, tasks }: UpdateEventProps): Promise<StandardResponse> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      redirect('/login');
    }

    // 🔒 Verificar permisos
    const hasPermission = await auth.api.userHasPermission({
      body: {
        userId: currentUser.id,
        role: currentUser.role,
        permission: { events: ["manage-events"] }
      }
    });

    if (!hasPermission) {
      return {
        success: false,
        message: "No tienes permiso para modificar eventos"
      };
    }

    // 🕵️ Verificar que el evento exista
    const existingEvent = await db.query.evento.findFirst({
      where: eq(evento.eventoId, eventId)
    });

    if (!existingEvent) {
      return {
        success: false,
        message: "El evento no existe o ya fue eliminado"
      };
    }

    // ⚠️ Verificar propiedad (si aplica)
    if (existingEvent.creadoPor !== currentUser.id && currentUser.role !== "admin") {
      return {
        success: false,
        message: "No puedes modificar un evento que no creaste"
      };
    }

    // 🧩 Actualizar los datos del evento
    await db.update(evento)
      .set(eventData)
      .where(eq(evento.eventoId, eventId));

    const previousTasks = await db.select().from(tarea).where(eq(tarea.eventoId, eventId));
    const tasksToDelete = previousTasks.filter(pt => !tasks.some(t => t.taskId && t.taskId === pt.tareaId));

    tasksToDelete.forEach(async (task) => {
      await db.delete(tarea).where(eq(tarea.tareaId, task.tareaId));
    });

    // 🔁 Procesar tareas asociadas
    for (const task of tasks) {
      // Actualizar tarea existente
      if (task.taskId) {
        const { taskId, ...taskData } = task;
        await db.update(tarea)
          .set(taskData)
          .where(eq(tarea.tareaId, taskId));
        continue;
      }

      await db.insert(tarea).values({
        ...task,
        eventoId: eventId,
        creadoPor: currentUser.id
      });
    }

    return {
      success: true,
      message: "Evento y tareas actualizados correctamente"
    };

  } catch (error) {
    console.error("Error al actualizar el evento:", error);

    let message = "Ocurrió un error al actualizar el evento. Intenta nuevamente.";
    if (error instanceof Error) message = error.message;

    return {
      success: false,
      message
    };
  }
}

export async function getEventTypes() {
  return await db.query.tipoEvento.findMany()
}

export async function getEventDate(eventId: number) {
  return (await db.select().from(evento).where(eq(evento.eventoId, eventId)).limit(1))[0]?.fecha
}

export async function getEventName(eventId: number) {
  return (await db.select().from(evento).where(eq(evento.eventoId, eventId)).limit(1))[0]?.nombre
}