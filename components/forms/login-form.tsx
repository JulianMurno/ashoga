"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from 'next/link'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Mail, Lock, EyeOff, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { useState } from "react"

import { signIn } from "@/server/users"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(8)
})

export function LoginForm() {
  
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
    disabled: loading
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)

    const { message, success } = await signIn(values)

    if (success) {
      toast.success(message)
      router.push('/')
    } else { toast.error(message) }

    setLoading(false)
  }

  return (
    <div className="flex-1 flex items-center justify-center max-md:pt-0 p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-2">Bienvenido</h2>
          <p className="text-gray-600 dark:text-gray-400">Ingrese su usuario</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <FormControl>
                      <Input
                        placeholder="Ingrese su correo..."
                        {...field}
                        className="pl-10 h-12 bg-gray-100 border-0 rounded-lg text-gray-900 dark:text-gray-200 placeholder:text-gray-500"
                        />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
              />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <FormControl>
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Ingrese su contraseña..." {...field}
                        className="pl-10 pr-10 h-12 bg-gray-100 border-0 rounded-lg text-gray-900 dark:text-gray-200 placeholder:text-gray-500"
                        />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
              />
            {/* <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                Olvidaste tu contraseña
              </Link>
            </div> */}
            <Button
              type="submit"
              className="w-full h-12 bg-(--ashoga-light) hover:bg-(--ashoga-dark) text-white font-medium rounded-lg cursor-pointer"
              >
                {
                  loading
                  ? <Loader2 className="size-4 animate-spin" />
                  : "Ingresar"
                }
              </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}