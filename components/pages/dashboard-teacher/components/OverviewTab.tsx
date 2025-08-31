import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Users,
  TrendingUp,
  Star,
  Calendar,
  Plus,
  Send,
  Award,
  Download
} from "lucide-react"
import type { Course } from "@/lib/data-adapter"

interface OverviewTabProps {
  statistics: {
    totalCourses: number
    totalStudents: number
    monthlyRevenue: number
    avgProgress: number
    completionRate: number
    averageRating: number
    newEnrollmentsThisWeek: number
    certificatesIssued: number
  }
  recentActivity: any[]
  courses: Course[]
}

export function OverviewTab({ statistics, recentActivity, courses }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Stats Cards - CON DATOS REALES DEL BACKEND */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{statistics.totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.totalCourses > 0 ? 'Datos del backend' : 'No hay cursos aún'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{statistics.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              +{statistics.newEnrollmentsThisWeek} esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">${statistics.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Basado en {statistics.totalStudents} estudiantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.avgProgress}%</div>
            <p className="text-xs text-muted-foreground">
              {statistics.certificatesIssued} certificados emitidos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-poppins">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <activity.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-poppins">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Crear Nueva Lección
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Send className="w-4 h-4 mr-2" />
              Enviar Anuncio a Estudiantes
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Award className="w-4 h-4 mr-2" />
              Generar Certificados
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exportar Reportes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Próximas Clases */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Próximas Clases Programadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses
              .filter((c) => (c as any).nextClass)
              .map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{course.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date((course as any).nextClass!).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{(course as any).students} estudiantes inscritos</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline">
                      <Calendar className="w-3 h-3 mr-1" />
                      Programada
                    </Badge>
                    <Button size="sm" variant="outline">
                      Unirse
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
