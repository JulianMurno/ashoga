'use client'

import { TasksInsertData } from "@/types"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import z from "zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Loader2, X } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatePicker } from "../ui/date-picker"
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import { formateDate } from "@/lib/utils"

interface Props {
  open?: boolean
  callback: (task: TasksInsertData & { tareaId?: number }) => void 
  closeFn: () => void
  eventLimitDate: Date
  data: TasksInsertData & { tareaId?: number }
}

const formSchema = z.object({
  titulo: z.string().min(5, { error: '5 carácteres como mínimo' }),
  descripcion: z.string().nullable(),
  prioridad: z.enum(['baja', 'media', 'alta']),
  estado: z.string().nullable(),
  hecha: z.boolean(),
  fechaInicio: z.date().nullable(),
  fechaVencimiento: z.date(),
  tareaId: z.number().optional()
});

export default function UpdateTaskModal ({ open, callback, closeFn, eventLimitDate, data }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: data.titulo,
      descripcion: data.descripcion ?? '',
      prioridad: data.prioridad as "baja" | "media" | "alta",
      estado: data.estado ?? '',
      hecha: data.hecha,
      fechaInicio: data.fechaInicio ?? null,
      fechaVencimiento: data.fechaVencimiento ? new Date(data.fechaVencimiento) : new Date(eventLimitDate),
      tareaId: data.tareaId
    }
  })

  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)

    if (values.fechaVencimiento && values.fechaVencimiento?.getDate() > eventLimitDate.getDate()) {
      form.setError('fechaVencimiento', { message: 'Fecha posterior a la del evento ' + formateDate(eventLimitDate) })
      setIsLoading(false)
      return
    }
    callback(values)
    closeFn()

    form.reset()

    setIsLoading(false)
  }

  return (
    <div className={"absolute max-[540px]:px-2 top-0 left-0 w-full h-full flex justify-center items-center bg-black/30 dark:bg-stone-600/30 " + (open ? 'block' : 'hidden')}>
      <div className="w-[520px] max-[540px]:w-full min-h-3/5 max-h-4/5 overflow-y-auto not-dark:bg-zinc-200 bg-slate-800 dark:mx-6 relative pb-3 pt-5 px-3 rounded-xl text-center">
        <X onClick={() => { closeFn(); form.reset() }} className="absolute top-2 right-2 cursor-pointer hover:scale-120 transition-transform"/>
        <h4 className="text-2xl text-center mb-7">Actualizar Tarea</h4>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo de la Tarea</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Reunión con Municipalidad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-6 max-[540px]:flex-col max-[540px]:justify-normal max-[540px]:gap-3 mb-6">
              <FormField
                control={form.control}
                name="fechaInicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <DatePicker className="not-dark:bg-zinc-300" date={field.value ?? undefined} updateFunc={field.onChange} />
                      </FormControl>
                      <Button type="button" className="bg-slate-300 hover:bg-slate-400" onClick={() => form.setValue('fechaInicio', null)}><X /></Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fechaVencimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Vencimiento</FormLabel>
                    <FormControl>
                      <DatePicker className="not-dark:bg-zinc-300" date={field.value ?? undefined} updateFunc={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-6 mt-6 max-[540px]:flex-col max-[540px]:justify-normal max-[540px]:gap-3 mb-6">
              <FormField
                control={form.control}
                name="prioridad"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex">
                      <FormLabel>Prioridad: </FormLabel>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baja">Baja</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="alta">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex">
                      <FormLabel>Estado: </FormLabel>
                      <Select {...field} value={field.value ?? undefined} onValueChange={(v) => { field.onChange(v); form.setValue('hecha', v === 'completada') }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="en proceso">En proceso</SelectItem>
                          <SelectItem value="completada">Completada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripcion: </FormLabel>
                  <FormControl>
                    <Textarea {...field} className="h-min" value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-1/2 mt-6 mb-3" type="submit">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirmar'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}