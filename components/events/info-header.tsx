'use client'

import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft, Check, CircleX, Pencil } from "lucide-react";
import ButtonWithConfirm from "../ButtonWithConfirirm";
import { deleteEvent, markEventAsComplete, markEventAsUncomplete } from "@/server/events";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EventsInfoHeader({ canEdit, id, completed }: { canEdit: boolean, id: number, completed: boolean }) {
  const router = useRouter()

  return (
    <div className="flex flex-col justify-between items-center gap-6 lg:flex-row lg:gap-4">
      <ArrowLeft className="absolute top-8 left-8 cursor-pointer transition-transform hover:scale-125 z-50" onClick={() => router.back()} />
      {canEdit && <div />}
      <h1 className="text-3xl">Detalles del Evento</h1>
      {canEdit && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline" className="flex gap-2 items-center bg-slate-200"
            onClick={() => {
              if (!completed) {
                markEventAsComplete(id)
                  .then(res => {
                    if (res.success) {
                      toast.success('Evento completado')
                      router.refresh()
                    } else {
                      toast.error(res.message || 'Ocurrió un error al completar el evento')
                    }
                  })
              } else {
                markEventAsUncomplete(id)
                  .then(res => {
                    if (res.success) {
                      toast.success('Evento marcado como incompleto')
                      router.refresh()
                    } else {
                      toast.error(res.message || 'Ocurrió un error al marcar el evento como incompleto')
                    }
                  })
              }
            }}
          >
            { completed ? <CircleX size={16} /> : <Check size={16} />}
            { completed ? 'Marcar como incompleto' : 'Marcar como completado' }
          </Button>
          <Link href={`/events/${id}/edit`}>
            <Button variant="outline" className="flex gap-2 items-center bg-slate-200">
              <Pencil size={16} />
              Editar
            </Button>
          </Link>
          <ButtonWithConfirm
            onClick={() => {
              deleteEvent(id)
                .then(res => {
                  if (res.success) {
                    toast.success('Evento eliminado correctamente')
                    router.push('/events')
                  } else {
                    toast.error(res.message || 'Ocurrió un error al eliminar el evento')
                  }
                })
            }}
            confirmMessage="¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer."
            className=""
          >
            Eliminar
          </ButtonWithConfirm>
        </div>
      )}
    </div>
  )
}