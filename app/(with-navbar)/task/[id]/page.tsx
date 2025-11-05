'use client'

import UpdateTaskModal from "@/components/modals/update-task"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { TareaSelect } from "@/db/schema"
import { formateDate } from "@/lib/utils"
import { getEventDate } from "@/server/events"
import { deleteTask, editTask, fetchTaskById, markTaskAsDone, markTaskAsPending } from "@/server/tasks"
import { TasksInsertData } from "@/types"
import { Loader2, X } from "lucide-react"
import Link from "next/link"
import { redirect, useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function TaskPage () {
  const queryParams = useSearchParams()
  const params = useParams()
  const edit = queryParams.get('edit') === 'true';
  const [task, setTask] = useState<TareaSelect | null>(null);
  const [limitDate, setLimitDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchTask = async () => {
      const taskData = await fetchTaskById(Number(params.id));
      if (!taskData) {
        redirect('/')
      }
      const limitDate = await getEventDate(taskData.eventoId!)

      setTask(taskData);
      setLimitDate(limitDate);
    };

    fetchTask();
  }, [params.id]);

  if (!task) {
    return <div className="flex flex-col justify-center items-center w-full h-full">
      Cargando tarea
      <Loader2 className="size-12 animate-spin" />
    </div>;
  }

  const activarEdicion = () => {
    redirect(`/task/${task.tareaId}?edit=true`);
  };

  return (
    <div className="relative flex items-center justify-center">
      <Card className="w-full max-w-lg p-6 relative">
        <div className="absolute top-2 right-2 flex gap-5 items-center">
          <Link
            href={`/events/${task.eventoId}`}
            className="text-blue-700 underline"
          >
            Ver evento
          </Link>
          <Link
            href='/'
            className="text-xl"
          >
            <X />
          </Link>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Detalle de Tarea</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm">Título:</label>
            <p className="font-medium">{task.titulo}</p>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm">Fecha de Inicio:</label>
              <p>{task.fechaInicio ? formateDate(task.fechaInicio) : 'Sin fecha' }</p>
            </div>
            <div className="flex-1">
              <label className="text-sm">Fecha de Vencimiento:</label>
              <p>{task.fechaVencimiento ? formateDate(task.fechaVencimiento) : 'Sin fecha'}</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm">Prioridad:</label>
              <p>{task.prioridad}</p>
            </div>
            <div className="flex-1">
              <label className="text-sm">Estado:</label>
              <p>{task.estado}</p>
            </div>
          </div>

          <div>
            <label className="text-sm">Descripción:</label>
            <p className="whitespace-pre-wrap">{task.descripcion}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={async () => {
              if (task.hecha) {
                await markTaskAsPending(task.tareaId, task.eventoId!);
                window.location.reload();
              }
              else {
                await markTaskAsDone(task.tareaId);
                window.location.reload();
              }
            }}
            className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded"
          >
            {task.hecha ? 'Marcar como Pendiente' : 'Marcar como Completada'}
          </Button>
          <Button
            onClick={() => {
              const conf = confirm('¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.');
              if (conf) { deleteTask(task.tareaId); redirect('/') };
            }}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
          >
            Eliminar
          </Button>
          <Button
            onClick={activarEdicion}
            className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded"
          >
            Editar
          </Button>
        </div>
      </Card>
      <UpdateTaskModal
        open={edit}
        data={task}
        closeFn={() => {}}
        eventLimitDate={limitDate}
        callback={async (t: TasksInsertData & { tareaId?: number | undefined; }) => {
          const res = await editTask(task.tareaId, t)
          if (res.success) {
            toast.success(res.message || 'Tarea actualizada correctamente')
            window.location.href = `/task/${task.tareaId}`
          } else {
            toast.error(res.message || 'Error al actualizar la tarea')
          }
        }}
      />
    </div>
  )
}