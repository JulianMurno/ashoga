import { columns } from "@/components/events/columns-def";
import EventsHeader from "@/components/events/header";
import { DataTable } from "@/components/events/table"
import { EventWithType, getEvents, getEventTypes } from "@/server/events"
import Link from "next/link";

const verifyCompletedString = (str: string): str is 'all' | 'true' | 'false' => {
  if (['all', 'true', 'false'].includes(str)) {
    return true
  }
  return false
}

export default async function EventsPage({
  searchParams
}: { searchParams: Promise<{ completed: string, type?: string, q?: string }> }) {
  const params = await searchParams;

  const eventTypes = await getEventTypes()

  const events = await getEvents(
    verifyCompletedString(params.completed) ? params.completed : 'false',
    Number(params.type) || undefined,
    params.q
  )

  if (!events.success) {
    return <div>{events.message || 'Error al cargar los eventos'} <Link href="/">Volver a la página principal</Link></div>
  }

  return (
    <div className="p-4 relative z-0 flex flex-col gap-4">
      <EventsHeader eventTypes={eventTypes} />
      <DataTable<EventWithType, EventWithType> data={events.data} columns={columns} />
    </div>
  )
}