import { TareaInsert } from "@/db/schema";

const tareasMock: TareaInsert[] = [
  // --- Tareas para Evento 1 (5 de Noviembre) ---
  {
    tareaId: 1,
    titulo: 'Contactar capacitador',
    descripcion: 'Escribir a Sergio (capacitador) para pedir honorarios y disponibilidad',
    prioridad: 'alta',
    estado: 'en proceso',
    fechaCreacion: new Date(2025, 9, 15),
    fechaInicio: new Date(2025, 9, 20),
    fechaVencimiento: new Date(2025, 10, 1), // 1 de Nov (antes del evento 5/Nov)
    eventoId: 1
  },
  {
    tareaId: 2,
    titulo: 'Pasar info a Correspondencia',
    descripcion: '',
    prioridad: 'media',
    estado: 'pendiente',
    fechaCreacion: new Date(2025, 9, 25),
    fechaInicio: null,
    fechaVencimiento: new Date(2025, 10, 3), // 3 de Nov (antes del evento 5/Nov)
    eventoId: 1
  },
  {
    tareaId: 6,
    titulo: 'Consultar alquiler del lugar',
    descripcion: 'Escribir a Salón de Eventos Juan Perez para pedir costo',
    prioridad: 'media',
    estado: 'completada',
    hecha: true,
    fechaCreacion: new Date(2025, 9, 10),
    fechaInicio: new Date(2025, 9, 12),
    fechaVencimiento: new Date(2025, 9, 25), // 25 de Oct (antes del evento 5/Nov)
    eventoId: 1
  },
  // --- Tareas para Evento 2 (12 de Octubre) - Completado ---
  {
    tareaId: 3,
    titulo: 'Pasar info a Socios',
    descripcion: 'Pasar la info enviada por FEHGRA a los Socios',
    prioridad: 'alta',
    estado: 'completada',
    hecha: true,
    fechaCreacion: new Date(2025, 8, 28),
    fechaInicio: null,
    fechaVencimiento: new Date(2025, 9, 1), // 1 de Oct (antes del evento 12/Oct)
    eventoId: 2
  },
  {
    tareaId: 4,
    titulo: 'Recaudar garantías',
    descripcion: 'Hacerle el cobro de las garantía a los socios',
    prioridad: 'alta',
    estado: 'completada',
    hecha: true,
    fechaCreacion: new Date(2025, 8, 28),
    fechaInicio: new Date(2025, 9, 1),
    fechaVencimiento: new Date(2025, 9, 7), // 7 de Oct (antes del evento 12/Oct)
    eventoId: 2
  },
  // --- Tareas para Evento 3 (28 de Octubre) ---
  {
    tareaId: 5,
    titulo: 'Enviar citaciones',
    descripcion: 'Enviar por cadete las citaciones',
    prioridad: 'alta',
    estado: 'pendiente',
    fechaCreacion: new Date(2025, 9, 15),
    fechaInicio: null,
    fechaVencimiento: new Date(2025, 9, 20), // 20 de Oct (antes del evento 28/Oct)
    eventoId: 3
  },
  {
    tareaId: 7,
    titulo: 'Imprimir saldo de Socios',
    descripcion: '',
    prioridad: 'baja',
    estado: 'pendiente',
    fechaCreacion: new Date(2025, 9, 17),
    fechaInicio: null,
    fechaVencimiento: new Date(2025, 9, 27), // 27 de Oct (antes del evento 28/Oct)
    eventoId: 3
  },
];

export default tareasMock;