"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export function AdminGuard({ children, requiredRoles = ["admin"] }: AdminGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [hasAccess, setHasAccess] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login")
        return
      }

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Verificar si el usuario tiene los roles requeridos
      const userRoles = user.roles || []
      const hasRequiredRole = requiredRoles.some(role => 
        userRoles.some(userRole => 
          userRole.toLowerCase().includes(role.toLowerCase()) ||
          role.toLowerCase().includes(userRole.toLowerCase())
        )
      )

      if (!hasRequiredRole) {
        setHasAccess(false)
      } else {
        setHasAccess(true)
      }
      
      setIsChecking(false)
    }
  }, [user, isAuthenticated, isLoading, requiredRoles, router])

  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <CardTitle>Verificando permisos...</CardTitle>
            <CardDescription>
              Comprobando acceso al panel de administración
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Acceso Denegado</CardTitle>
            <CardDescription>
              No tienes permisos para acceder al panel de administración
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p>Roles requeridos: {requiredRoles.join(", ")}</p>
              <p>Tu rol actual: {user?.roles?.join(", ") || "Sin roles"}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => router.back()}
              >
                Volver
              </Button>
              <Button 
                className="flex-1"
                onClick={() => router.push("/dashboard/student")}
              >
                Ir al Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}

