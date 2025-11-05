"use client"

import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { formateDate } from "@/lib/utils"

interface Props {
  date: Date | undefined
  updateFunc: (date: Date) => void
  className?: string
  defaultText?: string
}

export function DatePicker({ date, updateFunc, className, defaultText }: Props) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={`data-[empty=true]:text-muted-foreground min-w-[180px] justify-start text-left font-normal ${className}`}
        >
          <CalendarIcon />
          {date ? formateDate(date) : <span>{ defaultText || 'Seleccione una fecha'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar required mode="single" selected={date} onSelect={updateFunc} />
      </PopoverContent>
    </Popover>
  )
}