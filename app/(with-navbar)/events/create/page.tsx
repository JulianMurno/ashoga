import CreateEventForm from "@/components/forms/create-event-form";
import { getEventTypes } from "@/server/events";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EventCreatePage() {
  const eventTypes = await getEventTypes()

  return (
    <div className="pt-8 relative grid grid-rows-[auto_1fr] max-h-full overflow-y-hidden">
      <Link className="absolute top-8 left-12 transition-transform hover:scale-125" href='/events'><ArrowLeft /></Link>
      <h1 className="text-3xl text-center pb-2">Crear Evento</h1>
      <CreateEventForm eventTypes={eventTypes} />
    </div>
  )
}