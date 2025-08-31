"use client"

import { useAuth } from "@/hooks/use-auth"
import { TeacherDashboard } from "@/components/pages/teacher-dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TeacherDashboardPage() {
  console.log('🚨 [TeacherDashboardPage] FUNCIÓN EJECUTADA - Inicio');
  
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  console.log('🚨 [TeacherDashboardPage] HOOKS EJECUTADOS:', { isLoading, isAuthenticated, user: !!user });

  useEffect(() => {
    console.log('🚨 [TeacherDashboardPage] USEEFFECT EJECUTADO');
    console.log('🔍 [TeacherDashboardPage] Estado completo:', { 
      isLoading, 
      isAuthenticated, 
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        roles: user.roles
      } : null
    });
    
    // 🚨 LOGGING DETALLADO
    if (isLoading) {
      console.log('⏳ [TeacherDashboardPage] Cargando autenticación...');
      return;
    }
    
    if (!isAuthenticated) {
      console.log('❌ [TeacherDashboardPage] No autenticado, redirigiendo a login');
      router.push("/auth/login");
      return;
    }
    
    if (user) {
      console.log('✅ [TeacherDashboardPage] Usuario autenticado, permitiendo acceso');
      console.log('👤 [TeacherDashboardPage] Datos del usuario:', user);
    }
  }, [user, isLoading, isAuthenticated, router])

  console.log('🚨 [TeacherDashboardPage] ANTES DEL RENDER - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);

  if (isLoading) {
    console.log('🔄 [TeacherDashboardPage] Renderizando loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <p className="ml-4 text-lg">Cargando Dashboard Teacher...</p>
      </div>
    )
  }

  // 🚨 PERMITIR ACCESO SI ESTÁ AUTENTICADO (sin verificar rol específico)
  if (!isAuthenticated) {
    console.log('🚫 [TeacherDashboardPage] No autenticado, no renderizando nada');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-500">No autenticado - Redirigiendo...</p>
      </div>
    )
  }

  console.log('🎉 [TeacherDashboardPage] Renderizando TeacherDashboard component');
  
  // 🚨 RENDERIZAR PÁGINA SIMPLE PARA PRUEBA
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🎉 ¡DASHBOARD DE TEACHER FUNCIONANDO!
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Información del Usuario:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        <div className="mt-6">
          <TeacherDashboard />
        </div>
      </div>
    </div>
  )
}
