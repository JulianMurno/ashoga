import { TareaSelect } from "@/db/schema"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import EventsTaskCard from "./task-card"

export default function TasksTable ({ tasks, title }: { tasks: TareaSelect[], title: string }) {
  return (
    <Card className="not-dark:bg-zinc-200">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {
          tasks.length === 0
            ? <p className="text-center text-gray-500">No hay tareas asignadas.</p>
            : tasks.map((tarea, i) => {
                return <EventsTaskCard key={i} tarea={tarea} />
              })
        }
      </CardContent>
    </Card>
  )
}