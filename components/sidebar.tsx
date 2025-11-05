'use client'

import { useEffect, useState } from "react"
import ThemeSwitcher from "./theme-switcher"
import { Menu, X, Calendar, ClipboardClock, AlarmClock } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import LogoutButton from "./logout-button"

export default function Sidebar () {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setIsOpen(false), [pathname]);

  const pathnameClean = pathname.split('/')[1]

  const isTaskPage = ['task', ''].includes(pathnameClean)
  const isEventPage = pathnameClean === 'events'
  const isCalendarPage = pathnameClean === 'calendar'

  return (
    <>
      <button className="fixed top-1 left-1 hidden max-md:block cursor-pointer z-[100]" onClick={() => setIsOpen(true)}>
        <Menu />
      </button>
      <div className={`h-full left-0 ${isOpen ? '' : '-translate-x-full'} transition-transform w-full bg-gray-200 dark:bg-gray-900 max-md:fixed max-md:z-[110] md:translate-x-0 p-4 flex flex-col justify-between`}>
        <div className="flex flex-col gap-4">
          <button className="md:hidden self-end cursor-pointer" onClick={() => setIsOpen(false)}>
            <X />
          </button>
          <nav>
            <ul className="flex flex-col gap-2">
              <li><Link href="/" className={'w-full p-1 rounded flex gap-3 ' + (isTaskPage ? 'bg-(--ashoga-light) text-zinc-300' : '')}><ClipboardClock /> Tareas</Link></li>
              <li><Link href="/events" className={'w-full p-1 rounded flex gap-3 ' + (isEventPage ? 'bg-(--ashoga-light) text-zinc-300' : '')}><AlarmClock /> Eventos</Link></li>
              <li><Link href="/calendar" className={'w-full p-1 rounded flex gap-3 ' + (isCalendarPage ? 'bg-(--ashoga-light) text-zinc-300' : '')}><Calendar /> Calendario</Link></li>
            </ul>
          </nav>
        </div>

        <div className="flex gap-3 justify-end relative z-[150]">
          <LogoutButton />
          <ThemeSwitcher className="self-end" />
        </div>
      </div>
    </>
  )
}