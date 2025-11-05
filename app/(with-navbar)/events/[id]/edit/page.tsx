import { getEventById, getEventTasks, getEventTypes } from "@/server/events";
import { redirect } from "next/navigation";
import EditEventForm from "@/components/forms/edit-event-form";
import { getCurrentUser } from "@/server/users";
import { auth } from "@/lib/auth";
import ErrorPage from "@/components/error-page";

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: Props) {
  const id = Number((await params).id);
  const user = await getCurrentUser();

  if (!user) { redirect('/login') }

  const canEdit = await auth.api.userHasPermission({ body: { userId: user?.id, permission: { events: ['manage-events'] } } })

  if (!canEdit) {
    redirect('/events');
  }

  const eventResponse = await getEventById(id);
  const eventTypes = await getEventTypes();

  if (!eventResponse.success) return <ErrorPage title="Ocurrió un error" message={eventResponse.message} buttonLink="/events" />;
  
  const event = eventResponse.event

  const tasks = await getEventTasks({ eventId: event.eventoId, all: true })

  return (
    <div className="py-8 max-h-full overflow-y-auto">
      <h1 className="text-3xl text-center pb-4">Editar Evento</h1>
      <EditEventForm event={{...event, tasks}} eventTypes={eventTypes} />
    </div>
  );
}
