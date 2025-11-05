import { Card, CardContent } from "@/components/ui/card";
import TaskCalendar from "@/components/calendar/calendar";

export default async function CalendarioPage() {
  return (
    <div className="p-4 max-h-screen bg-gray-100 dark:bg-gray-900 relative overflow-y-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
        Calendario de Tareas
      </h1>

      <Card className="shadow-md rounded-2xl bg-white dark:bg-gray-800 transition-colors">
        <CardContent>
          {/* Aquí inyectamos los datos al componente cliente */}
          <TaskCalendar />
        </CardContent>
      </Card>
    </div>
  );
}
