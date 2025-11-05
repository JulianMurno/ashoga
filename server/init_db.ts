'use server'

import { auth } from "@/lib/auth";
import { USERS } from '@/mocks/users'
import { getCurrentUser } from "./users";
import tareasMock from "@/mocks/tareas";
import { db } from "@/db/drizzle";
import { evento, tarea, tipoEvento, user } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eventsMocks, eventTypesMocks } from "@/mocks/events";
import { eq } from "drizzle-orm";

export default async function INIT_DB() {
  for (const u of USERS) {
    try {
      const { user: us, token } = await auth.api.signUpEmail({
        body: u
      })

      console.log({ us, token })

      await db.update(user).set({ role: u.role }).where(eq(user.id, us.id))
    } catch (e) {
      console.error(e)
    }
    console.log('//////////////////////////////')
  }
  console.log('//////////////////////////////')

  for (const evt_types of eventTypesMocks) {
    try {
      const insert = await db.insert(tipoEvento).values(evt_types)
      console.log(insert)
    } catch (e) {
      console.error(e)
    }
  }
}

export async function INIT_TASKS() {
  const current_user = await getCurrentUser()

  if (!current_user) return;

  for (const e of eventsMocks) {
    try {
      await db.insert(evento).values({ ...e, creadoPor: current_user.id })
    } catch (e) {
      console.error(e)
    }
    console.log('//////////////////////////////')
  }
  console.log('//////////////////////////////')

  for (const t of tareasMock) {
    try {
      await db.insert(tarea).values({ ...t, creadoPor: current_user.id })
    } catch (e) {
      console.error(e)
    }
    console.log('//////////////////////////////')
  }

  revalidatePath('/')
}