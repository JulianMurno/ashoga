import { Roles } from "@/types";

export const USERS: { email: string, password: string, name: string, role: Roles }[] = [
  // { email: 'paco.perez@gmail.com', name: 'Paco Perez', password: 'password123', role: 'comisionDirectiva' },
  // { email: 'juan.ramirez@gmail.com', name: 'Juan Ramirez', password: 'password123', role: 'comisionDirectiva' },
  // { email: 'lionel.jara@gmail.com', name: 'Lionel Jara', password: 'password123', role: 'admin' },
  // { email: 'santiago.horrach@gmail.com', name: 'Santiago Horrach', password: 'password123', role: 'comisionDirectiva' },
  // { email: 'francisco.demarioa@gmail.com', name: 'Francisco Demaria', password: 'password123', role: 'comisionDirectiva' },
  // { email: 'bautista.gutierrez@gmail.com', name: 'Bautista Gutierrez', password: 'password123', role: 'comisionDirectiva' },
  // { email: 'federico.we@gmail.com', name: 'Federico We...', password: 'password123', role: 'comisionDirectiva' },
  // { email: 'juan.riquelme@gmail.com', name: 'Juan Riquelme', password: 'password123', role: 'comisionDirectiva' },
  // { email: 'martin.palermo@gmail.com', name: 'Martin Palermo', password: 'password123', role: 'comisionDirectiva' },
  // { email: 'david.villa@gmail.com', name: 'David Villa', password: 'password123', role: 'secretario' },
  { email: 'demo@gmail.com', name: 'Usuario Demostración', password: '12345678', role: 'secretario' }
] as const;