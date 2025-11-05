import { getEventById, getEventTasks } from "@/server/events";
import { redirect } from "next/navigation";
import { formateDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/server/users";
import { auth } from "@/lib/auth";
import ErrorPage from "@/components/error-page";
import EventsInfoHeader from "@/components/events/info-header";
import TasksTable from "@/components/events/task-table";

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const id = Number((await params).id);
  const user = await getCurrentUser();
  
  if (!user) { redirect('/login') }
  
  const canEdit = await auth.api.userHasPermission({
    body: { userId: user.id, permission: { events: ['manage-events'] } }
  })

  const eventResponse = await getEventById(id);
  if (!eventResponse.success) return <ErrorPage title="Ocurrió un error" message={eventResponse.message} buttonLink="/events" />;

  const event = eventResponse.event

  const tasks = await getEventTasks({eventId: event.eventoId, all: true })

  return (
    <div className="pt-8 relative px-8 py-6 max-h-full overflow-y-auto flex flex-col gap-6">
      <EventsInfoHeader canEdit={canEdit.success} id={id} completed={event.done} />

      <Card className="not-dark:bg-zinc-200">
        <CardHeader>
          <CardTitle className="text-xl">Información General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div><strong>Nombre:</strong> {event.nombre}</div>
          <div><strong>Tipo:</strong> {event.tipoEvento ?? 'No definido'}</div>
          <div><strong>Lugar:</strong> {event.lugar ?? 'No especificado'}</div>
          <div><strong>Fecha:</strong> {formateDate(event.fecha)}</div>
          <div><strong>Completado:</strong> {event.done ? 'Sí' : 'No'}</div>
        </CardContent>
      </Card>

      <TasksTable tasks={tasks} title="Tareas Asociadas" />
    </div>
  )
}
