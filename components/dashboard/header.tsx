'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export default function DashboardFilters() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const days = searchParams.get('days') || '7'

  const { push } = useRouter()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('days', value)
    push(`${pathname}?${params}`)
  }

  return (
    <div className="flex gap-1.5 justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Próximos {days} días</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Tareas de los próximos</DropdownMenuLabel>
          <DropdownMenuRadioGroup defaultValue={days} onValueChange={handleChange}>
            <DropdownMenuRadioItem value='3'>3 días</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='7'>7 días</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value='14'>14 días</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}