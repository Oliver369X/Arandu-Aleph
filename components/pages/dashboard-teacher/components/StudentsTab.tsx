import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Download,
  TrendingUp,
  Calendar,
  Bell,
  MessageSquare,
  Eye,
  BarChart3
} from "lucide-react"
import type { Course } from "@/lib/data-adapter"

interface StudentsTabProps {
  students: any[]
  courses: Course[]
}

export function StudentsTab({ students, courses }: StudentsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-poppins font-semibold">Mis Estudiantes</h2>
          <p className="text-sm text-muted-foreground">
            Estudiantes matriculados en tus materias y su progreso académico
          </p>
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por materia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las materias</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title} - {course.category || course.difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Calificaciones
          </Button>
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Matricular Estudiante
          </Button>
        </div>
      </div>

      {/* Métricas de Estudiantes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Matriculados</p>
                <p className="text-2xl font-bold text-primary">{students.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Promedio General</p>
                <p className="text-2xl font-bold text-secondary">
                  {students.length > 0 
                    ? Math.round(students.reduce((sum, s) => sum + (s.grade || 75), 0) / students.length)
                    : 0
                  }%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-secondary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Asistencia Media</p>
                <p className="text-2xl font-bold text-accent">
                  {students.length > 0 ? '87%' : '0%'}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-accent/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Riesgo</p>
                <p className="text-2xl font-bold text-red-600">
                  {students.filter(s => s.status === 'at-risk').length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-red-600/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-poppins">Lista de Estudiantes Matriculados</CardTitle>
              <CardDescription>Rendimiento académico y seguimiento personalizado</CardDescription>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Buscar por nombre..." className="w-64" />
              <Button variant="outline">📊 Ver Reportes</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No hay estudiantes matriculados aún
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Los estudiantes aparecerán aquí una vez que estén matriculados en tus materias
              </p>
              <Button className="bg-secondary hover:bg-secondary/90">
                <Users className="w-4 h-4 mr-2" />
                Matricular Estudiantes
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={student.avatar || "/placeholder-user.jpg"}
                        alt={student.name}
                        className="w-12 h-12 rounded-full"
                      />
                      {student.status === "at-risk" && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">!</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>📚 {student.course}</span>
                        <span>•</span>
                        <span>📅 Matriculado: {new Date(student.joinDate).toLocaleDateString("es-ES")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-8">
                    {/* Calificación */}
                    <div className="text-center">
                      <div className="flex items-center gap-2">
                        <div className={`text-lg font-bold ${
                          (student.grade || 75) >= 90 ? 'text-green-600' :
                          (student.grade || 75) >= 70 ? 'text-blue-600' :
                          (student.grade || 75) >= 60 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {student.grade || 75}
                        </div>
                        <div className="text-xs text-muted-foreground">/100</div>
                      </div>
                      <p className="text-xs text-muted-foreground">Calificación</p>
                    </div>

                    {/* Progreso */}
                    <div className="text-center min-w-[80px]">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              student.status === "at-risk" ? "bg-red-500" :
                              student.status === "completed" ? "bg-green-500" : "bg-primary"
                            }`}
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{student.progress}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Progreso</p>
                    </div>

                    {/* Asistencia */}
                    <div className="text-center">
                      <div className={`text-sm font-medium ${
                        (student.attendance || 87) >= 90 ? 'text-green-600' :
                        (student.attendance || 87) >= 80 ? 'text-blue-600' : 'text-orange-600'
                      }`}>
                        {student.attendance || 87}%
                      </div>
                      <p className="text-xs text-muted-foreground">Asistencia</p>
                    </div>

                    {/* Tareas */}
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {student.completedAssignments || 7}/{student.totalAssignments || 10}
                      </div>
                      <p className="text-xs text-muted-foreground">Tareas</p>
                    </div>

                    {/* Status */}
                    <div className="text-center">
                      <Badge
                        variant={
                          student.status === "completed" ? "default" :
                          student.status === "at-risk" ? "destructive" : "secondary"
                        }
                      >
                        {student.status === "completed" ? "📚 Aprobado" :
                         student.status === "at-risk" ? "⚠️ En Riesgo" : "✅ Activo"}
                      </Badge>
                    </div>

                    {/* Acciones */}
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Enviar mensaje"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Ver perfil académico"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        title="Historial de calificaciones"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
