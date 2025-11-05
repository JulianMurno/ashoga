import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Better Auth Tables
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: integer("banned", { mode: "boolean" }).default(false),
  banReason: text("ban_reason"),
  banExpires: integer("ban_expires", { mode: "timestamp_ms" }),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp_ms",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp_ms",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type UserSelect = typeof user.$inferSelect
export type UserInsert = typeof user.$inferInsert

export type AccountSelect = typeof account.$inferSelect
export type AccountInsert = typeof account.$inferInsert

export type SessionSelect = typeof session.$inferSelect
export type SessionInsert = typeof session.$inferInsert

export type VerificationSelect = typeof verification.$inferSelect
export type VerificationInsert = typeof verification.$inferInsert

// Our Tables
export const tipoEvento = sqliteTable("tipo_evento", {
  tipoEventoId: integer("tipo_evento_id").primaryKey({ autoIncrement: true }),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
  colorEtiqueta: text("color_etiqueta"),
});

export type TipoEventoSelect = typeof tipoEvento.$inferSelect;
export type TipoEventoInsert = typeof tipoEvento.$inferInsert;

export const plantillasEventos = sqliteTable("plantillas_eventos", {
  plantillaEventoId: integer("plantilla_evento_id").primaryKey({ autoIncrement: true }),
  tipoEventoId: integer("tipo_evento_id").notNull().references(() => tipoEvento.tipoEventoId),
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion"),
});

export type PlantillaEventoSelect = typeof plantillasEventos.$inferSelect;
export type PlantillaEventoInsert = typeof plantillasEventos.$inferInsert;

export const plantillasTareas = sqliteTable("plantillas_tareas", {
  plantillaTareaId: integer("plantilla_tarea_id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  prioridad: text("prioridad"),
  plantillaEventoId: integer("plantilla_evento_id").references(() => plantillasEventos.plantillaEventoId),
});

export type PlantillaTareaSelect = typeof plantillasTareas.$inferSelect;
export type PlantillaTareaInsert = typeof plantillasTareas.$inferInsert;

export const evento = sqliteTable("evento", {
  eventoId: integer("evento_id").primaryKey({ autoIncrement: true }),
  tipoEventoId: integer("tipo_evento_id").notNull().references(() => tipoEvento.tipoEventoId),
  lugar: text("lugar"),
  fecha: integer("fecha", { mode: "timestamp" }).notNull(),
  done: integer("done", { mode: "boolean" }).default(false).notNull(),
  nombre: text("nombre").notNull(),
  creadoPor: text("creado_por").notNull().references(() => user.id),
});

export type EventoSelect = InferSelectModel<typeof evento>;
export type EventoInsert = InferInsertModel<typeof evento>;

export const tarea = sqliteTable("tarea", {
  tareaId: integer("tarea_id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion"),
  prioridad: text("prioridad").notNull(),
  estado: text("estado"),
  hecha: integer("hecha", { mode: "boolean" }).default(false).notNull(),

  fechaInicio: integer("fecha_inicio", { mode: "timestamp" }),
  fechaVencimiento: integer("fecha_vencimiento", { mode: "timestamp" }).notNull(),
  fechaCreacion: integer("fecha_creacion", { mode: "timestamp" })
    .default(sql`(current_timestamp)`).notNull(),

  creadoPor: text("creado_por").references(() => user.id),

  eventoId: integer('evento_id').references(() => evento.eventoId)
});

export type TareaSelect = InferSelectModel<typeof tarea>;
export type TareaInsert = InferInsertModel<typeof tarea>;

export const usuariosTareas = sqliteTable("usuarios_tareas", {
  usuarioTareaId: integer("usuario_tarea_id").primaryKey({ autoIncrement: true }),
  usuarioId: text("usuario_id").notNull().references(() => user.id),
  tareaId: integer("tarea_id").notNull().references(() => tarea.tareaId),
  rolEnTarea: text("rol_en_tarea"),
});

export type UsuariosTareasSelect = typeof usuariosTareas.$inferSelect;
export type UsuariosTareasInsert = typeof usuariosTareas.$inferInsert;

export const documentos = sqliteTable("documentos", {
  documentoId: integer("documento_id").primaryKey({ autoIncrement: true }),
  nombreArchivo: text("nombre_archivo").notNull(),
  urlArchivo: text("url").notNull(),
  fechaSubida: integer("fecha_subida", { mode: "timestamp" })
    .default(sql`(current_timestamp)`),

  subidaPor: text("subida_por").references(() => user.id),
});

export type DocumentoSelect = typeof documentos.$inferSelect;
export type DocumentoInsert = typeof documentos.$inferInsert;

// export const comentarios = sqliteTable("comentarios", {
//   comentarioId: integer("comentario_id").primaryKey({ autoIncrement: true }),
//   texto: text("texto").notNull(),
//   fechaComentario: integer("fecha_comentario", { mode: "timestamp" })
//     .default(sql`(current_timestamp)`),

//   tareaId: integer("tarea_id").notNull().references(() => tarea.tareaId),
//   // Referencia actualizada: usa user.id (TEXT)
//   usuarioId: text("usuario_id").notNull().references(() => user.id),
// });

// export type ComentarioSelect = typeof comentarios.$inferSelect;
// export type ComentarioInsert = typeof comentarios.$inferInsert;

export const notificaciones = sqliteTable("notificaciones", {
  notificacionId: integer("notificaciones_id").primaryKey({ autoIncrement: true }),
  tipo: text("tipo").notNull(),
  fecha: integer("fecha", { mode: "timestamp" })
    .default(sql`(current_timestamp)`),

  // Referencia actualizada: usa user.id (TEXT)
  usuarioId: text("usuario_id").notNull().references(() => user.id),
  tareaId: integer("tarea_id").references(() => tarea.tareaId),
});

export type NotificacionSelect = typeof notificaciones.$inferSelect;
export type NotificacionInsert = typeof notificaciones.$inferInsert;

export const schema = {
  user, account, session, verification,
  tipoEvento,
  plantillasEventos, plantillasTareas,
  evento, tarea, usuariosTareas,
  // documentos, comentarios,
  notificaciones
}