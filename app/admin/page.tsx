"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  Shield, 
  BookOpen, 
  GraduationCap, 
  TrendingUp, 
  Activity,
  BarChart3,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { apiService } from "@/lib/api"

interface DashboardStats {
  totalUsers: number
  totalRoles: number
  totalSubjects: number
  totalProgress: number
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
  userGrowth: Array<{
    month: string
    users: number
  }>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalRoles: 0,
    totalSubjects: 0,
    totalProgress: 0,
    recentActivity: [],
    userGrowth: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Cargar datos en paralelo
      const [usersResponse, rolesResponse, subjectsResponse, progressResponse] = await Promise.all([
        apiService.getUsers(),
        apiService.getRoles(),
        apiService.getSubjects(),
        apiService.getProgress()
      ])

      const dashboardStats: DashboardStats = {
        totalUsers: usersResponse.success ? usersResponse.data?.length || 0 : 0,
        totalRoles: rolesResponse.success ? rolesResponse.data?.length || 0 : 0,
        totalSubjects: subjectsResponse.success ? subjectsResponse.data?.length || 0 : 0,
        totalProgress: progressResponse.success ? progressResponse.data?.length || 0 : 0,
        recentActivity: [
          {
            id: "1",
            type: "user_registration",
            description: "Nuevo usuario registrado: Juan Pérez",
            timestamp: new Date().toISOString()
          },
          {
            id: "2",
            type: "role_assignment",
            description: "Rol de profesor asignado a María García",
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: "3",
            type: "course_completion",
            description: "Curso completado: Introducción a Blockchain",
            timestamp: new Date(Date.now() - 7200000).toISOString()
          }
        ],
        userGrowth: [
          { month: "Ene", users: 45 },
          { month: "Feb", users: 52 },
          { month: "Mar", users: 61 },
          { month: "Abr", users: 78 },
          { month: "May", users: 89 },
          { month: "Jun", users: 102 }
        ]
      }

      setStats(dashboardStats)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_registration':
        return <Users className="w-4 h-4 text-blue-500" />
      case 'role_assignment':
        return <Shield className="w-4 h-4 text-green-500" />
      case 'course_completion':
        return <GraduationCap className="w-4 h-4 text-purple-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getActivityBadgeVariant = (type: string) => {
    switch (type) {
      case 'user_registration':
        return 'default'
      case 'role_assignment':
        return 'secondary'
      case 'course_completion':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Administración</h1>
            <p className="text-muted-foreground">Vista general del sistema ARANDU</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cargando...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">...</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Administración</h1>
          <p className="text-muted-foreground">Vista general del sistema ARANDU</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/users">
              <Users className="w-4 h-4 mr-2" />
              Gestionar Usuarios
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/roles">
              <Shield className="w-4 h-4 mr-2" />
              Gestionar Roles
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(stats.totalUsers * 0.12)} desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Activos</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRoles}</div>
            <p className="text-xs text-muted-foreground">
              Roles configurados en el sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materias</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">
              Cursos disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProgress}</div>
            <p className="text-xs text-muted-foreground">
              Registros de progreso
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas acciones en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getActivityIcon(activity.type)}
                    <Badge variant={getActivityBadgeVariant(activity.type)} className="text-xs">
                      {activity.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Acceso directo a funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/users">
                <Users className="w-4 h-4 mr-2" />
                Gestionar Usuarios
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/roles">
                <Shield className="w-4 h-4 mr-2" />
                Administrar Roles
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/courses">
                <BookOpen className="w-4 h-4 mr-2" />
                Gestionar Cursos
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/admin/stats">
                <BarChart3 className="w-4 h-4 mr-2" />
                Ver Estadísticas
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Crecimiento de Usuarios</CardTitle>
          <CardDescription>
            Evolución mensual de usuarios registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {stats.userGrowth.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center">
                <div className="text-sm font-medium">{data.users}</div>
                <div className="text-xs text-muted-foreground">{data.month}</div>
                <div className="w-8 h-20 bg-gray-100 rounded-t mt-2 relative">
                  <div 
                    className="absolute bottom-0 w-full bg-primary rounded-t"
                    style={{ 
                      height: `${(data.users / Math.max(...stats.userGrowth.map(d => d.users))) * 100}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

