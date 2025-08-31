import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  FileText,
  TrendingUp,
  Award,
  Calendar,
  Bell,
  Star
} from "lucide-react"
import type { Course } from "@/lib/data-adapter"

interface AnalyticsTabProps {
  students: any[]
  courses: Course[]
  aiGames: any[]
}

export function AnalyticsTab({ students, courses, aiGames }: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-poppins font-semibold">Reportes Académicos</h2>
          <p className="text-sm text-muted-foreground">
            Análisis del rendimiento estudiantil y métricas educativas
          </p>
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período Académico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este bimestre</SelectItem>
              <SelectItem value="semester">Este semestre</SelectItem>
              <SelectItem value="year">Año lectivo 2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Calificaciones
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Reporte de Asistencia
          </Button>
        </div>
      </div>

      {/* Métricas Académicas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Promedio General</p>
                <p className="text-2xl font-bold text-primary">
                  {students.length > 0 
                    ? Math.round(students.reduce((sum, s) => sum + (s.grade || 75), 0) / students.length)
                    : 0
                  }
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tasa Aprobación</p>
                <p className="text-2xl font-bold text-green-600">
                  {students.length > 0 
                    ? Math.round((students.filter(s => (s.grade || 75) >= 60).length / students.length) * 100)
                    : 0
                  }%
                </p>
              </div>
              <Award className="w-8 h-8 text-green-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Asistencia Media</p>
                <p className="text-2xl font-bold text-blue-600">
                  {students.length > 0 
                    ? Math.round(students.reduce((sum, s) => sum + (s.attendance || 87), 0) / students.length)
                    : 0
                  }%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Riesgo Académico</p>
                <p className="text-2xl font-bold text-red-600">
                  {students.filter(s => s.status === 'at-risk').length}
                </p>
              </div>
              <Bell className="w-8 h-8 text-red-600/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de Calificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins">Distribución de Calificaciones</CardTitle>
          <CardDescription>Distribución de notas por rangos de calificación</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { range: '90-100', label: 'Excelente (A)', color: 'text-green-600', bg: 'bg-green-100' },
              { range: '80-89', label: 'Bueno (B)', color: 'text-blue-600', bg: 'bg-blue-100' },
              { range: '70-79', label: 'Regular (C)', color: 'text-orange-600', bg: 'bg-orange-100' },
              { range: '0-69', label: 'Insuficiente (D)', color: 'text-red-600', bg: 'bg-red-100' }
            ].map((grade, index) => {
              const count = students.filter(s => {
                const studentGrade = s.grade || 75;
                switch(index) {
                  case 0: return studentGrade >= 90;
                  case 1: return studentGrade >= 80 && studentGrade < 90;
                  case 2: return studentGrade >= 70 && studentGrade < 80;
                  case 3: return studentGrade < 70;
                  default: return false;
                }
              }).length;
              
              return (
                <div key={grade.range} className={`p-4 rounded-lg ${grade.bg}`}>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${grade.color}`}>{count}</div>
                    <div className="text-sm font-medium text-gray-700">{grade.label}</div>
                    <div className="text-xs text-gray-600">{grade.range} pts</div>
                    <div className="text-xs text-gray-500">
                      {students.length > 0 ? Math.round((count / students.length) * 100) : 0}% del total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Games Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="font-poppins flex items-center gap-2">
            🎮 Estadísticas de Juegos AI
          </CardTitle>
          <CardDescription>Rendimiento de los juegos educativos generados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{aiGames.length}</div>
              <p className="text-sm text-muted-foreground">Juegos Generados</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {aiGames.reduce((total, game) => total + game.playCount, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Jugadas Totales</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {aiGames.length > 0 ? Math.round(aiGames.reduce((total, game) => total + game.playCount, 0) / aiGames.length) : 0}
              </div>
              <p className="text-sm text-muted-foreground">Promedio Jugadas</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(aiGames.map(game => game.gameType)).size}
              </div>
              <p className="text-sm text-muted-foreground">Tipos de Juegos</p>
            </div>
          </div>
          
          {aiGames.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3">Juegos más populares</h4>
              <div className="space-y-2">
                {aiGames
                  .sort((a, b) => b.playCount - a.playCount)
                  .slice(0, 3)
                  .map((game, index) => (
                    <div key={game.id} className="flex items-center justify-between p-2 rounded border">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                        <div>
                          <p className="text-sm font-medium">{game.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {game.gameType} • {game.subtopicTitle}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{game.playCount} jugadas</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-poppins">Rendimiento por Curso</CardTitle>
            <CardDescription>Métricas detalladas de cada curso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {courses.map((course) => (
                <div key={course.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{course.title}</h4>
                    <Badge variant="outline">{(course as any).status}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Inscripciones</p>
                      <p className="font-medium">{(course as any).enrollments}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tasa Finalización</p>
                      <p className="font-medium">{(course as any).completionRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Rating</p>
                      <p className="font-medium flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {course.rating}/5
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Ingresos</p>
                      <p className="font-medium text-green-600">${(course as any).revenue}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso promedio</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-poppins">Métricas Generales</CardTitle>
            <CardDescription>Resumen de tu desempeño como instructor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-primary">78%</div>
                <p className="text-sm text-muted-foreground">Tasa de Finalización</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-secondary">4.8</div>
                <p className="text-sm text-muted-foreground">Rating Promedio</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-accent">24h</div>
                <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">$5,850</div>
                <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Tendencias del Mes</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Nuevas inscripciones</span>
                  <span className="font-medium text-green-600">+23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Certificados emitidos</span>
                  <span className="font-medium text-green-600">+15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tiempo de engagement</span>
                  <span className="font-medium text-green-600">+8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Satisfacción estudiantes</span>
                  <span className="font-medium text-green-600">+5%</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-3">Próximos Objetivos</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                  <span>Alcanzar 150 estudiantes totales</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                  <span>Mantener rating 4.8+ en todos los cursos</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                  <span>Lanzar 2 cursos nuevos este trimestre</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
