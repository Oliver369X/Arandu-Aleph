"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AdminGuard } from "@/components/auth/admin-guard"
import { 
  Users, 
  Shield, 
  Settings, 
  BarChart3, 
  BookOpen, 
  GraduationCap,
  Menu,
  X
} from "lucide-react"

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
    description: "Vista general del sistema"
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: Users,
    description: "Gestionar usuarios y roles"
  },
  {
    title: "Roles",
    href: "/admin/roles",
    icon: Shield,
    description: "Administrar roles y permisos"
  },
  {
    title: "Cursos",
    href: "/admin/courses",
    icon: BookOpen,
    description: "Gestionar contenido educativo"
  },
  {
    title: "Estadísticas",
    href: "/admin/stats",
    icon: BarChart3,
    description: "Análisis y métricas"
  },
  {
    title: "Configuración",
    href: "/admin/settings",
    icon: Settings,
    description: "Configuración del sistema"
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <AdminGuard requiredRoles={["admin", "teacher"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-500">ARANDU Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/teacher">Volver al Dashboard</Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="flex flex-col h-full">
              <div className="flex-1 px-4 py-6">
                <nav className="space-y-2">
                  {adminNavItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link key={item.href} href={item.href}>
                        <Card className={`
                          cursor-pointer transition-all duration-200 hover:shadow-md
                          ${isActive ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-gray-50'}
                        `}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-foreground' : 'text-gray-500'}`} />
                              <div>
                                <div className={`font-medium ${isActive ? 'text-primary-foreground' : 'text-gray-900'}`}>
                                  {item.title}
                                </div>
                                <div className={`text-xs ${isActive ? 'text-primary-foreground/80' : 'text-gray-500'}`}>
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </nav>
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <GraduationCap className="w-4 h-4" />
                  <span>ARANDU Admin</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 lg:ml-0">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AdminGuard>
  )
}
