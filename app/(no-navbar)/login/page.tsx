import type React from "react"
import { LoginForm } from "@/components/forms/login-form"
import { Button } from "@/components/ui/button"
import INIT_DB from "@/server/init_db"

export default function LoginPage() {

  return (
    <div className="min-h-screen">
      <div className="flex min-h-lvh flex-col md:flex-row">

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">

            <div className="flex items-end justify-center gap-1 mb-4">
              <div className="w-8 h-16 border-4 border-red-500"></div>
              <div className="w-8 h-20 border-4 border-blue-600"></div>
              <div className="w-8 h-24 border-4 border-yellow-400"></div>
              <div className="w-8 h-24 border-4 border-yellow-400"></div>
              <div className="w-8 h-20 border-4 border-blue-600"></div>
              <div className="w-8 h-16 border-4 border-red-500"></div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">as ho ga</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wide">ASOCIACIÓN HOTELERA Y GASTRONÓMICA VCP</p>
          </div>
        </div>

        <LoginForm />
      </div>
      { process.env.NODE_ENV === 'development' && <form action={INIT_DB}><Button className="absolute left-2 top-2">INIT DB</Button></form>}
    </div>
  )
}
