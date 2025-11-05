'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "../ui/button"
import Link from "next/link"
import { Input } from "../ui/input"
import { Select, SelectItem } from "../ui/select"
import { SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@radix-ui/react-select"
import { TipoEventoSelect } from "@/db/schema"
import { useDebouncedCallback } from 'use-debounce'

export default function EventsHeader ({ eventTypes }: { eventTypes: TipoEventoSelect[] }) {
  const pathname = usePathname().split('/')[1]
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleParamChange = (param: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === '') {
      params.delete(param)
    } else {
      params.set(param, value)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handleDebounced = useDebouncedCallback((param:string, value: string) => {
    handleParamChange(param, value)
  }, 300)

  return (
    <header className="">
      <div className="flex justify-between items-center mb-3">
        <div className="w-10" />
        <h1 className="text-3xl font-bold text-center mb-5">Eventos {pathname && pathname === 'create' && '- Crear'}</h1>
        <Button asChild>
          <Link href="/events/create" className="text-md">
            Crear Evento
          </Link>
        </Button>
      </div>
      <form onSubmit={(e) => { e.preventDefault() }} className="flex gap-2">
        <Input placeholder="buscar por nombre" onChange={(v) => {
          handleDebounced('q', v.target.value)
        }}
          defaultValue={searchParams.get('q') || ''}
        />
        <div className="relative">
          <Select onValueChange={(v) => {
            handleDebounced('type', v === 'all' ? '' : v)
          }}
            defaultValue={searchParams.get('type') || 'all'}
          >
            <SelectTrigger asChild>
              <Button>
                Tipo:
                <SelectValue />
              </Button>
            </SelectTrigger>
            <SelectContent className="z-50 bg-slate-800 rounded-lg p-3">
              <SelectGroup>
                <SelectLabel className="mb-2">Tipo de Evento</SelectLabel>
                <SelectItem className="focus:bg-slate-700" value='all'>Todos</SelectItem>
                {
                  eventTypes.map((type) => (
                    <SelectItem className="focus:bg-slate-700" key={type.tipoEventoId} value={type.tipoEventoId.toString()}>{type.nombre}</SelectItem>
                  ))
                }
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="relative">
          <Select onValueChange={(v) => {
            handleDebounced('completed', v === 'false' ? '' : v)
          }}
          defaultValue={searchParams.get('completed') || 'false'}
          >
            <SelectTrigger asChild>
              <Button>
                Completados:
                <SelectValue />
              </Button>
            </SelectTrigger>
            <SelectContent className="z-50 bg-slate-800 rounded-lg p-3">
              <SelectGroup>
                <SelectItem className="focus:bg-slate-700" value='all'>Todos</SelectItem>
                <SelectItem className="focus:bg-slate-700" value='true'>Si</SelectItem>
                <SelectItem className="focus:bg-slate-700" value='false'>No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </form>
    </header>
  )
}