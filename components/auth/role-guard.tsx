"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { determineUserRole, getDashboardRoute, isTeacher, isStudent } from '@/lib/roles'

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles?: ('teacher' | 'student' | 'admin')[]
  redirectTo?: string
}

export function RoleGuard({ children, allowedRoles, redirectTo }: RoleGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return // Esperar a que se cargue la autenticación

    if (!isAuthenticated || !user) {
      console.log('🚫 [RoleGuard] Usuario no autenticado, redirigiendo a login');
      router.push('/auth/login')
      return
    }

    if (!allowedRoles || allowedRoles.length === 0) {
      // Si no se especifican roles, permitir acceso
      return
    }

    const userRole = determineUserRole(user)
    console.log(`🔍 [RoleGuard] Rol del usuario: ${userRole}, Roles permitidos: ${allowedRoles.join(', ')}`)

    // Verificar si el usuario tiene un rol permitido
    const hasAllowedRole = allowedRoles.some(role => {
      switch (role) {
        case 'teacher':
          return isTeacher(user)
        case 'student':
          return isStudent(user)
        case 'admin':
          return userRole === 'admin'
        default:
          return false
      }
    })

    if (!hasAllowedRole) {
      console.log(`🚫 [RoleGuard] Usuario no tiene permisos para esta ruta`);
      
      if (redirectTo) {
        router.push(redirectTo)
      } else {
        // Redirigir al dashboard apropiado según el rol
        const dashboardRoute = getDashboardRoute(userRole)
        console.log(`🔄 [RoleGuard] Redirigiendo a: ${dashboardRoute}`)
        router.push(dashboardRoute)
      }
      return
    }

    console.log('✅ [RoleGuard] Usuario autorizado para acceder a esta ruta')
  }, [user, isAuthenticated, isLoading, allowedRoles, redirectTo, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null // No renderizar nada mientras se redirige
  }

  // Verificar permisos antes de renderizar
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = determineUserRole(user)
    const hasAllowedRole = allowedRoles.some(role => {
      switch (role) {
        case 'teacher':
          return isTeacher(user)
        case 'student':
          return isStudent(user)
        case 'admin':
          return userRole === 'admin'
        default:
          return false
      }
    })

    if (!hasAllowedRole) {
      return null // No renderizar nada mientras se redirige
    }
  }

  return <>{children}</>
}
