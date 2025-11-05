'use server'

import { db } from "@/db/drizzle"
import { getCurrentUser } from "./users"
import { Prioridades, TasksInsertData } from "@/types"
import { StandardResponse } from "./types"
import { evento, tarea, TareaSelect } from "@/db/schema"
import { between, eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import { dateToYearMonthDay } from "@/lib/utils"

export async function fetchUserTasks({ priority, daysOffset }: { priority: Prioridades, daysOffset: number }) {
  const currentUser = await getCurrentUser()

  if (!currentUser) redirect('/login');

  const tasks = await db.query.tarea.findMany({
    where: (tarea, { and, eq, ne, lte, or }) => and(
      eq(tarea.prioridad, priority),
      ne(tarea.estado, 'completada'),
      eq(tarea.creadoPor, currentUser.id),
      or(eq(tarea.prioridad, 'alta'), lte(tarea.fechaVencimiento, new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000)))
    ),
    orderBy: (tarea, { asc, sql }) => [sql`${tarea.fechaVencimiento} asc nulls last`, asc(tarea.fechaCreacion)]
  })

  return tasks
}

export async function markTaskAsDone(tareaId: number): Promise<StandardResponse> {
  try {
    await db.update(tarea)
      .set({ estado: "completada", hecha: true })
      .where(eq(tarea.tareaId, tareaId));

    return {
      success: true,
      message: "Tarea marcada como completada",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al marcar la tarea como completada",
    };
  }
}

export async function markTaskAsPending(tareaId: number, eventId: number): Promise<StandardResponse> {
  try {
    await db.update(evento)
      .set({ done: false })
      .where(eq(evento.eventoId, eventId));

    await db.update(tarea)
      .set({ estado: "pendiente", hecha: false })
      .where(eq(tarea.tareaId, tareaId));

    return {
      success: true,
      message: "Tarea marcada como pendiente",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al marcar la tarea como pendiente",
    };
  }
}

export async function toggleTaskStatus(tareaId: number, eventoId: number): Promise<StandardResponse> {
  try {
    const previousState = (await db.select().from(tarea).where(eq(tarea.tareaId, tareaId)))[0].hecha;

    if (previousState) {
      await db.update(evento)
        .set({ done: false })
        .where(eq(evento.eventoId, eventoId));
    }

    await db.update(tarea)
      .set({ estado: previousState ? "pendiente" : "completada", hecha: !previousState })
      .where(eq(tarea.tareaId, tareaId));

    return {
      success: true,
      message: "Estado de la tarea cambiado",
    };
  } catch (error) {
    const e = error as Error
    return {
      success: false,
      message: e.message || "Error al cambiar el estado de la tarea",
    };
  }
}

export async function editTask(taskId: number, taskData: Partial<TasksInsertData>): Promise<StandardResponse> {
  try {
    await db.update(tarea)
      .set(taskData)
      .where(eq(tarea.tareaId, taskId));

    return {
      success: true,
      message: "Tarea actualizada correctamente",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar la tarea",
    };
  }
}


export async function deleteTask(taskId: number): Promise<StandardResponse> {
  try {
    await db.delete(tarea)
      .where(eq(tarea.tareaId, taskId));

    return {
      success: true,
      message: "Tarea eliminada correctamente 🗑️",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al eliminar la tarea ❌",
    };
  }
}

export async function fetchTaskById(taskId: number) {
  const task = await db.query.tarea.findFirst({
    where: eq(tarea.tareaId, taskId)
  })

  return task
}

export type GetTasksBetweenDatesResponse = (TareaSelect & { formatedDate: `${number}-${number}-${number}` })[]

export async function getTasksBetweenDates(startDate: Date, endDate: Date): Promise<GetTasksBetweenDatesResponse> {
  const tasks = await db.select().from(tarea).where(
    between(tarea.fechaVencimiento, startDate, endDate)
  )

  return tasks.map(t => ({ ...t, formatedDate: dateToYearMonthDay(t.fechaVencimiento) }))
}