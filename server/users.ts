'use server'

import { auth } from "@/lib/auth"
import { Roles } from "@/types"
import { APIError } from "better-auth"
import { headers } from "next/headers"

export async function signIn({ email, password }: { email: string, password: string }) {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: '/'
      }
    })

    return {
      success: true,
      message: "Inicio de sesión exitoso"
    }
  } catch (error) {
    const e = error as APIError

    if (e.statusCode === 401) { e.message = 'Email o contraseña incorrecto' }

    return {
      success: false,
      message: e.message || "Ocurrió un error al iniciar sesión"
    }
  }
}

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) return null;

  return {
    ...session.user,
    role: session.user.role as Roles
  }
}
