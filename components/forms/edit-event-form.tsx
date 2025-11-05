'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import z from "zod"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { DatePicker } from "../ui/date-picker"
import { Button } from "../ui/button"
import { Loader2, Pen, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { TipoEventoSelect } from "@/db/schema"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import Pill from "../Pill"
import { formateDate } from "@/lib/utils"
import { EventWithTasks, TasksInsertData } from "@/types"
import { updateEvent } from "@/server/events"
import { toast } from "sonner"
import UpdateTaskModal from "../modals/update-task"
import CreateTaskModal from "../modals/create-task"

const eventFormSchema = z.object({
  name: z.string().min(5, { error: 'El nombre debe tener al menos 5 caracteres.' }),
  place: z.string().optional(),
  date: z.date(),
  type: z.int().min(0, { error: 'Debes seleccionar un tipo de evento.' })
})

interface CreateEventFormProps {
  eventTypes: TipoEventoSelect[];
  event: EventWithTasks; // Nuevo prop opcional para editar
}

export default function UpdateEventForm ({ eventTypes, event }: CreateEventFormProps) {
  const [isLoading, setLoading] = useState(false)
  const [currentTask, setCurrentTask] = useState<(TasksInsertData & { tareaId?: number })>()
  const [openModal, setOpenModal] = useState(false)
  const [limitDate, setLimitDate] = useState(event.fecha)

  const [tasks, setTasks] = useState<(TasksInsertData & { tareaId?: number })[]>(event.tasks)

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event.nombre,
      place: event.lugar ?? undefined,
      date: event.fecha,
      type: event.tipoEventoId
    },
    disabled: isLoading
  })

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    setLoading(true)

    const res = await updateEvent({
      eventId: event.eventoId,
      eventData: {
        nombre: values.name, tipoEventoId: values.type,
        lugar: values.place, fecha: values.date
      },
      tasks
    })

    if (!res.success) {
      toast.error(res.message ?? 'Se produjo un error desconocido al crear el evento')
    } else { toast.success(res.message ?? 'Evento creado correctamente') }

    setLoading(false)
  }

  const handleNewTask = (task: TasksInsertData & { tareaId?: number }) => {
    console.log('Handling task:', task)
    setTasks(p => {
      const existingTask = p.find(t => t.tareaId === task.tareaId)
      if (existingTask) {
        return p.map(t => t.tareaId === task.tareaId ? task : t)
      }
      return [...p, task]
    })

    setCurrentTask(undefined)
    setOpenModal(false)
  }

  return (
    <div className="max-h-full px-8 py-6 max-md:px-4">
      
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Card className="not-dark:bg-zinc-200 [&_input]:not-dark:bg-zinc-300 mb-4">
        <CardHeader>
          <CardTitle className="text-xl">Informacion General</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Evento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Reunión con Municipalidad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-8 items-start flex-wrap">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Evento</FormLabel>
                      <Select {...field} value={String(field.value)} onValueChange={(val) => {
                        form.setValue('type', Number(val))
                        form.clearErrors('type')
                      }}>
                        <FormControl>
                          <SelectTrigger className="not-dark:bg-zinc-300">
                            <SelectValue placeholder="Selecciona un tipo de evento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="not-dark:bg-zinc-300">
                          {eventTypes.map(et => (
                            <SelectItem key={et.tipoEventoId} value={String(et.tipoEventoId)}>{et.nombre}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="place"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lugar del Evento</FormLabel>
                      <FormControl>
                        <Input className="min-w-3xs" placeholder="No obligatorio. Ej: Municipalidad" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha del Evento</FormLabel>
                      <FormControl>
                        <DatePicker className="not-dark:bg-zinc-300" date={field.value} updateFunc={(date) => {
                          if (tasks.some(t => t.fechaVencimiento > date)) {
                            form.setError('date', { message: 'Hay una o más tareas que vencen antes del ' + formateDate(date) })
                            return
                          }
                          setLimitDate(date)
                          form.setValue('date', date)
                          form.clearErrors('date')
                        }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
      <Card className="not-dark:bg-zinc-200 [&_input]:not-dark:bg-zinc-300 mb-4">
        <CardHeader>
          <CardTitle className="text-xl">Tareas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5 max-md:px-3">
            {
              tasks.map(( t, i ) => {
                const bgColor = t.prioridad === 'alta' ? '#fb2c36cc'
                  : t.prioridad === 'media' ? '#efb100aa'
                  : t.prioridad === 'baja' ? '#00c95177'
                  : '#0009'

                const statusColor = t.hecha ? '#00c95177'
                  : '#09f8'

                return <Card key={i} className="not-dark:bg-gray-200 grid grid-cols-1 lg:grid-cols-[1fr_auto]">
                  <div className="grid grid-cols-2 gap-4 lg:gap-2 lg:grid-cols-3 grid-rows-[auto_auto] px-3">
                    <span>{t.titulo}</span>
                    <div className="flex gap-2 flex-wrap">
                      <Pill bgColor={ bgColor } >{t.prioridad}</Pill>
                      <Pill bgColor={t.estado ? statusColor : '#0008'}>{t.estado ?? 'sin definir'}</Pill>
                    </div>
                    <div>
                      <span>inicio {t.fechaInicio ? formateDate(t.fechaInicio) : 'sin aclarar'}</span>
                    </div>
                    <div className="col-span-2">{t.descripcion ? t.descripcion : 'Sin descripcion'}</div>
                    <div>
                      <span>{t.fechaVencimiento ? 'vence ' + formateDate(t.fechaVencimiento) : 'no vence'}</span>
                    </div>
                  </div>
                  <div className="self-center pr-2 justify-self-center w-full">
                    <Button
                      className="w-full mb-2 self-center hover:bg-slate-400"
                      type="button"
                      onClick={() => {
                        setCurrentTask(t)
                      }}
                    >
                      <Pen />
                    </Button>

                    <Button
                      className="w-full self-center hover:bg-red-400"
                      type="button"
                      onClick={() => {
                        const conf = confirm('¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.')
                        if (!conf) return;

                        setTasks(prev => {
                          const a = [...prev]
                          return a.filter((_, ind) => i !== ind)
                        })
                      }}
                    >
                      <X/>
                    </Button>
                  </div>
                </Card>
              })
            }
            <Button type="button" onClick={() => setOpenModal(true)}>Nueva Tarea</Button>
        </CardContent>
      </Card>
      <Button disabled={isLoading} type="submit">
        {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Confirmar Modificación de Evento"}
      </Button>
      </form>
      <CreateTaskModal open={!!currentTask && openModal} eventLimitDate={limitDate} callback={ handleNewTask } closeFn={() => setOpenModal(false)} />
      {
        currentTask &&
        <UpdateTaskModal
          open={true}
          eventLimitDate={limitDate}
          callback={ handleNewTask }
          closeFn={() => { setOpenModal(false); setCurrentTask(undefined) }} 
          data={currentTask}
        />
      }
    </div>
  )
}