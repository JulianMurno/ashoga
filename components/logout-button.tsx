import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function LogoutButton () {
  const { push } = useRouter()
  const handleLogout = async () => {
    toast.warning('Cerrando sesión, por favor espere')
    const res = await authClient.signOut()
    if (res.data?.success) {
      toast.success('Sesión cerrada correctamente')
      push('/login')
    } else { toast.error('Ocurrió un error al cerrar sesión, intentelo nuevamente') }
  }

  return <Button variant='outline' aria-description="cerra sesión" about="cerrar sesión" onClick={handleLogout}>
    <LogOut />
  </Button>
}