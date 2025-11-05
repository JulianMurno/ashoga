'use client'

import { EventWithType } from "@/server/events"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

export const columns: ColumnDef<EventWithType>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "fecha",
    header: "Fecha",
  },
  {
    accessorKey: "lugar",
    header: "Lugar",
  },
  {
    accessorKey: "tipoEvento.nombre",
    header: "Tipo de Evento",
  },
  {
    accessorKey: "done",
    header: "Completado",
    cell: ({ row }) => {
      const a = row.original.done
      return a ? 'Sí' : 'No'
    }
  },
  {
    accessorKey: "eventoId",
    header: "",
    cell: ({ row }) => {
      const id = row.original.eventoId
      return <Link href={`/events/${id}`} className="text-blue-500 hover:underline">Ver</Link>
    }
  },
]