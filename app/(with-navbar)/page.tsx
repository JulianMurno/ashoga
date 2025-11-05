import { Prioridades } from "../../types"
import { Button } from "@/components/ui/button"
import { INIT_TASKS } from "@/server/init_db"
import DashboardFilters from "@/components/dashboard/header"
import { fetchUserTasks } from "@/server/tasks"
import TaskCard from "@/components/dashboard/task-card"
import { getEventName } from "@/server/events"

const TaskColumn = async ({ priority, daysOffset }: { priority: Prioridades, daysOffset: number }) => {
  const tasks = await fetchUserTasks({ priority, daysOffset })

  const bgColor = priority === 'alta' ? 'bg-(--prioridad-alta)' : priority === 'media' ? 'bg-(--prioridad-media)' : 'bg-(--prioridad-baja)'

  return (
    <div className="flex flex-col w-1/3 max-md:w-full h-fit max-h-full">
      <span className={`${bgColor} w-full p-2 rounded font-bold`}>Prioridad {priority}</span>
      <div className="flex flex-col gap-4 mt-2">
        { tasks.length === 0
          ? <span className="text-center">No hay tareas de prioridad {priority}</span>
          : tasks.map(async t => {
          const eventName = await (async () => {
            return t.eventoId ? (await getEventName(t.eventoId)) : ''
          })()

          let text = ''
          let bgColor: `#${string}` = '#efb100dd'

          if (t.fechaVencimiento) {
            const diffTime = t.fechaVencimiento.getTime() - Date.now()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays < 0) {
              text = `Venció hace ${-diffDays} día${diffDays === -1 ? '' : 's'}`
              bgColor = '#fb2c36cc'
            } else if (diffDays === 0) {
              text = 'Vence hoy'
            } else if (diffDays === 1) {
              text = 'Vence mañana'
            } else if (diffDays <= 7) {
              text = `Vence en ${diffDays} días`
            } else {
              text = `Vence en ${diffDays} días`
              bgColor = '#00c951dd'
            }
          } else {
            text = 'No vence'
            bgColor = '#6a7282'
          }

          return <TaskCard key={t.tareaId} bgColor={bgColor} text={text} {...t} eventName={eventName} />
          })
        }
      </div>
    </div>
  )
}

export default async function Dashboard (props: {
  searchParams?: Promise<{
    days?: `${number}`
    task?: `${number}`
    edit?: string
  }>
}) {
  const searchParams = await props.searchParams
  const days = Number(searchParams?.days) || 7

  return <div className="grid grid-cols-1 grid-rows-[auto_auto_1fr] h-full p-4 overflow-y-auto">
    <h1 className="text-center text-3xl">
      { process.env.NODE_ENV === 'development' && <form action={INIT_TASKS}><Button className="fixed right-2 bottom-2 opacity-60">CREATE DEFAULT TASKS</Button></form>}
      Tareas
    </h1>

    <DashboardFilters />

    <div className="w-full flex max-md:flex-col gap-4 mt-4 p-2">
      <TaskColumn priority='alta' daysOffset={days} />
      <TaskColumn priority='media' daysOffset={days} />
      <TaskColumn priority='baja' daysOffset={days} />
    </div>
  </div>
}