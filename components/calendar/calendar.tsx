"use client";

import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useTheme } from "next-themes";
import { getTasksBetweenDates, GetTasksBetweenDatesResponse } from "@/server/tasks";
import { darken } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// tipos/localFullCalendar.ts (o dentro del mismo archivo .tsx)
export interface DatesSetArg {
  start: Date;
  end: Date;
  // puedes añadir más campos que uses, por ejemplo view: any
  view?: unknown;
}

export interface EventClickArg {
  // info.event y otras propiedades que uses
  event: {
    id?: string;
    title?: string;
    start: null | Date;
    end: null | Date;
    extendedProps: Record<string, unknown>;
  };
  el?: HTMLElement;
  // agrega otras props si las necesitas
}

export interface EventMountArg {
  el: HTMLElement;
  event: {
    extendedProps: Record<string, unknown>;
    // otras props útiles si las necesitas
  };
}


export default function TasksCalendar() {
  const [tasks, setTasks] = useState<GetTasksBetweenDatesResponse>([]);
  const [loading, setLoading] = useState(true);
  const { theme, systemTheme } = useTheme();
  const router = useRouter();

  const handleEventClick = (info: EventClickArg) => {
    const tareaId = info.event.extendedProps.tareaId;
    if (tareaId) router.push(`/task/${tareaId}`);
  };

  const fetchTareas = async (start: Date, end: Date) => {
    setLoading(true);
    const res = await getTasksBetweenDates(start, end);
    setTasks(res);

    if (res.length === 0) {
      alert("No hay tareas en el rango de fechas seleccionado.");
    }
    setLoading(false);
  };

  // 🔥 Esta función se ejecuta cada vez que cambia el rango visible
  const handleDatesSet = (info: DatesSetArg) => {
    fetchTareas(info.start, info.end);
  };

  const handleEventMount = (info: EventMountArg) => {
    const el = info.el as HTMLElement;

    // Cursor tipo pointer
    el.style.cursor = "pointer";

    // Color base según prioridad
    const baseColor =
      info.event.extendedProps.prioridad === "alta"
        ? "#ef4444"
        : info.event.extendedProps.prioridad === "media"
        ? "#fbbf24"
        : "#22c55e";

    el.style.backgroundColor = baseColor;
    el.style.borderColor = baseColor;
    el.style.transition = "background-color 0.2s ease";

    // Hover in / out
    el.addEventListener("mouseenter", () => {
      el.style.backgroundColor = darken(baseColor, 0.15);
    });
    el.addEventListener("mouseleave", () => {
      el.style.backgroundColor = baseColor;
    });
  };

  const [headerToolbar, setHeaderToolbar] = useState({
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,dayGridWeek",
  });

  useEffect(() => {
    const updateHeader = () => {
      if (window.innerWidth < 640) {
        setHeaderToolbar({
          left: "prev,next,today",
          center: "title",
          right: "", // 👈 Oculta los botones de vista
        });
      } else {
        setHeaderToolbar({
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        });
      }
    };

    updateHeader();
    window.addEventListener("resize", updateHeader);
    return () => window.removeEventListener("resize", updateHeader);
  }, []);

  return (
    <div
      className="
      relative 
      [&_.fc-scrollgrid]:overflow-visible 
      [&_.fc-scroller]:!overflow-visible 
      [&_.fc-scroller-harness-liquid]:!overflow-visible"
    >
      {loading && (
        <Loader2 className="animate-spin size-12 z-50 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      )}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale="es"
        height="auto"
        contentHeight="auto"
        aspectRatio={1.4}
        dayHeaderClassNames={() =>
          (theme !== 'system' ? theme === "dark" : systemTheme === 'dark')
            ? ["bg-gray-800 text-gray-100 border-gray-700"]
            : ["bg-gray-100 text-gray-700 border-gray-300"]
        }
        events={tasks.map((e) => ({
          ...e,
          title: e.titulo,
          start: e.formatedDate,
          end: e.formatedDate,
          backgroundColor:
            e.prioridad === "alta"
              ? "#ef4444"
              : e.prioridad === "media"
              ? "#fbbf24"
              : "#22c55e",
          borderColor:
            e.prioridad === "alta"
              ? "#ef4444"
              : e.prioridad === "media"
              ? "#fbbf24"
              : "#22c55e",
        }))}
        datesSet={handleDatesSet}
        eventDidMount={handleEventMount}
        eventClick={handleEventClick}
        headerToolbar={headerToolbar}
        buttonText={{
          today: "Hoy",
          month: "Mes",
          week: "Semana",
          day: "Día",
        }}
        eventDisplay="block"
        dayCellClassNames={() =>
          (theme !== 'system' ? theme === "dark" : systemTheme === 'dark')
            ? ["bg-gray-800 border-gray-700 text-white"]
            : ["bg-white"]
        }
      />
    </div>
  );
}
