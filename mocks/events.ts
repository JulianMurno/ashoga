import { EventoInsert, TipoEventoInsert } from "@/db/schema";

// ['Capacitacion Territorial', 'Capacitacion FEHGRA', 'Asamblea']
const eventTypesMocks: TipoEventoInsert[] = [
  {
    nombre: 'Capacitacion Territorial',
    tipoEventoId: 1
  },
  {
    nombre: 'Capacitacion FEHGRA',
    tipoEventoId: 2
  },
  {
    nombre: 'Asamblea',
    tipoEventoId: 3
  }
]

const eventsMocks: Omit<EventoInsert, 'creadoPor'>[] = [
  {
    eventoId: 1,
    nombre: 'Capacitacion X',
    done: false,
    fecha: new Date(2025, 10, 5), // **5 de Noviembre** (Mes 10)
    lugar: 'Sede ASHOGA',
    tipoEventoId: 1
  },
  {
    eventoId: 2,
    nombre: 'Capacitacion Q',
    done: true,
    fecha: new Date(2025, 9, 12), // **12 de Octubre** (Mes 9)
    lugar: 'Online',
    tipoEventoId: 2
  },
  {
    eventoId: 3,
    nombre: 'Asamblea 2025',
    done: false,
    fecha: new Date(2025, 9, 28), // **28 de Octubre** (Mes 9)
    lugar: 'ASHOGA',
    tipoEventoId: 3
  },
]

export { eventTypesMocks, eventsMocks }