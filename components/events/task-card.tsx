'use client'

import { TareaSelect } from "@/db/schema"
import { Card } from "../ui/card"
import Pill from "../Pill"
import { formateDate } from "@/lib/utils"
import { toggleTaskStatus } from "@/server/tasks"
import { Button } from "../ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function EventsTaskCard ({ tarea }: { tarea: TareaSelect }) {
  const [done, setDone] = useState(tarea.hecha)
  const [status, setStatus] = useState(tarea.estado)
  const bgColor = tarea.prioridad === 'alta' ? '#fb2c36cc'
    : tarea.prioridad === 'media' ? '#efb100aa'
    : tarea.prioridad === 'baja' ? '#00c95177'
    : '#0009'

  const statusColor = done ? '#00c95177' : '#09f8'

  const { refresh } = useRouter()

  return (
    <Card className="not-dark:bg-gray-200">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto]">
        <div className="grid grid-cols-2 items-center lg:grid-cols-3 gap-2 lg:gap-0 grid-rows-[auto_auto] px-3 py-2">
          <span>{tarea.titulo}</span>
          <div className="flex gap-2 flex-wrap">
            <Pill bgColor={bgColor}>{tarea.prioridad}</Pill>
            <Pill bgColor={statusColor}>{status ?? 'sin definir'}</Pill>
          </div>
          <div>
            <span>inicio {tarea.fechaInicio ? formateDate(tarea.fechaInicio) : 'sin aclarar'}</span>
          </div>
          <div className="col-span-2">{tarea.descripcion || 'Sin descripción'}</div>
          <div>
            <span>{tarea.fechaVencimiento ? 'vence ' + formateDate(tarea.fechaVencimiento) : 'no vence'}</span>
          </div>
        </div>
        <Button onClick={() => {
          toggleTaskStatus(tarea.tareaId, tarea.eventoId!);
          if (status) { refresh() }
          setDone(prev => {
            setStatus(prev ? 'pendiente' : 'hecha')

            return !prev
          })
        }}
          className="w-11/12 justify-self-center self-center"
        >
          {done ? 'Marcar como pendiente' : 'Marcar como hecha'}
        </Button>
      </div>
    </Card>
  )
}