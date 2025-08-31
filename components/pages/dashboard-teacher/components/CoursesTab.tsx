import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Users,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Star,
  Clock,
  TrendingUp
} from "lucide-react"
import type { Course } from "@/lib/data-adapter"

interface CoursesTabProps {
  courses: Course[]
  onCreateCourse: () => void
}

export function CoursesTab({ courses, onCreateCourse }: CoursesTabProps) {
  const [selectedCourse, setSelectedCourse] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-poppins font-semibold">Gestión de Cursos</h2>
        <div className="flex gap-2">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los cursos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="draft">Borradores</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-secondary hover:bg-secondary/90" onClick={onCreateCourse}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Nuevo Curso
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  No hay cursos disponibles
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                  Los datos se están cargando desde el backend real. Si eres nuevo, crea tu primer curso.
                </p>
                <Button className="bg-secondary hover:bg-secondary/90" onClick={onCreateCourse}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear tu Primer Curso
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          courses.map((course) => (
            <Card
              key={course.id}
              className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="font-poppins text-lg mb-2">{course.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={(course as any).status === "active" ? "default" : "secondary"}>
                        {(course as any).status === "active" ? "Activo" : "Borrador"}
                      </Badge>
                      <Badge variant="outline">{course.difficulty}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-primary" />
                    <span>{(course as any).students} estudiantes</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-accent" />
                    <span>{course.rating}/5</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-secondary" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                    <span>${(course as any).revenue}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso del curso</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {course.completedLessons} de {course.totalLessons} lecciones completadas
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
