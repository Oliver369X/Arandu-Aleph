"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  BookOpen,
  Users,
  Plus,
  Settings,
  BarChart3,
  Calendar,
  Award,
  FileText,
  Video,
  Upload,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Clock,
  TrendingUp,
  Star,
  Download,
  Send,
  Bell,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { courseService } from "@/lib/course-service"
import { apiService } from "@/lib/api"
import type { Course, CourseProgress } from "@/lib/data-adapter"

export function TeacherDashboard() {
  console.log('🚨 [TeacherDashboard] COMPONENTE CARGADO');
  const { user } = useAuth()
  console.log('👤 [TeacherDashboard] Usuario recibido:', user);
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState("all") // Updated default value to "all"
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [courseContent, setCourseContent] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        console.log('⚠️ [TeacherDashboard] No user ID available, skipping data fetch');
        return;
      }

      console.log('🚨 [TeacherDashboard] MODO SIMPLE - Cargando datos básicos para profesor:', user.id);

      // 🚨 DATOS MOCK TEMPORALES - EVITAR ERRORES 404
      setCourses([
        { id: '1', name: 'Matemáticas Básicas', description: 'Curso de matemáticas', level: 'Principiante' },
        { id: '2', name: 'Física Avanzada', description: 'Curso de física', level: 'Avanzado' }
      ]);

      setStudents([
        { id: '1', name: 'Juan Pérez', email: 'juan@test.com' },
        { id: '2', name: 'María García', email: 'maria@test.com' },
        { id: '3', name: 'Carlos López', email: 'carlos@test.com' }
      ]);

      setCourseContent([
        { id: '1', title: 'Álgebra Lineal', type: 'lesson' },
        { id: '2', title: 'Geometría', type: 'exercise' }
      ]);

      setRecentActivity([
        {
          id: '1',
          type: 'student_progress',
          description: 'Juan Pérez completó el módulo de Matemáticas',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user: 'Juan Pérez'
        },
        {
          id: '2', 
          type: 'assignment_submitted',
          description: 'María García entregó la tarea de Física',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user: 'María García'
        }
      ]);

      console.log('✅ [TeacherDashboard] Datos mock cargados exitosamente');
    }

    fetchData()
    // NO polling para evitar errores repetidos
  }, [user?.id])

  const handleCreateCourse = () => {
    console.log("[v0] Creating new course")
    setIsCreateCourseOpen(false)
  }

  const handleCreateContent = () => {
    console.log("[v0] Creating new content")
    setIsCreateContentOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-primary">Dashboard Docente</h1>
              <p className="text-muted-foreground">Bienvenido, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
              <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Curso
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Curso</DialogTitle>
                    <DialogDescription>Completa la información para crear tu nuevo curso</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título del Curso</Label>
                        <Input id="title" placeholder="Ej: Introducción a Web3" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoría</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blockchain">Blockchain</SelectItem>
                            <SelectItem value="defi">DeFi</SelectItem>
                            <SelectItem value="nft">NFTs</SelectItem>
                            <SelectItem value="desarrollo">Desarrollo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea id="description" placeholder="Describe tu curso..." />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Precio (USD)</Label>
                        <Input id="price" type="number" placeholder="150" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duración</Label>
                        <Input id="duration" placeholder="8 semanas" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="difficulty">Dificultad</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Nivel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="principiante">Principiante</SelectItem>
                            <SelectItem value="intermedio">Intermedio</SelectItem>
                            <SelectItem value="avanzado">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateCourseOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateCourse} className="bg-secondary hover:bg-secondary/90">
                      Crear Curso
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="courses">Mis Cursos</TabsTrigger>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">3</div>
                  <p className="text-xs text-muted-foreground">+1 desde el mes pasado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">105</div>
                  <p className="text-xs text-muted-foreground">+12 esta semana</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">$5,850</div>
                  <p className="text-xs text-muted-foreground">+18% vs mes anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rating Promedio</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">Basado en 127 reseñas</p>
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
                    .filter((c) => c.nextClass)
                    .map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(course.nextClass!).toLocaleDateString("es-ES", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{course.students} estudiantes inscritos</p>
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
          </TabsContent>

          {/* Courses Tab - Enhanced */}
          <TabsContent value="courses" className="space-y-6">
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
                <Button className="bg-secondary hover:bg-secondary/90" onClick={() => setIsCreateCourseOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Nuevo Curso
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
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
                          <Badge variant={course.status === "active" ? "default" : "secondary"}>
                            {course.status === "active" ? "Activo" : "Borrador"}
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
                        <span>{course.students} estudiantes</span>
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
                        <span>${course.revenue}</span>
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
              ))}
            </div>
          </TabsContent>

          {/* Students Tab - Enhanced */}
          <TabsContent value="students" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-poppins font-semibold">Gestión de Estudiantes</h2>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filtrar por curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los cursos</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Lista
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="font-poppins">Lista de Estudiantes</CardTitle>
                    <CardDescription>Monitorea el progreso y rendimiento de tus estudiantes</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Buscar estudiantes..." className="w-64" />
                    <Button variant="outline">Filtrar</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={student.avatar || "/placeholder.svg"}
                          alt={student.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Inscrito: {new Date(student.joinDate).toLocaleDateString("es-ES")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-sm font-medium">{student.course}</p>
                          <p className="text-xs text-muted-foreground">Curso</p>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  student.status === "at-risk"
                                    ? "bg-red-500"
                                    : student.status === "completed"
                                      ? "bg-green-500"
                                      : "bg-primary"
                                }`}
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{student.progress}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Progreso</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-medium">{student.grade}/100</p>
                          <p className="text-xs text-muted-foreground">Calificación</p>
                        </div>

                        <div className="text-center">
                          <p className="text-sm font-medium">
                            {student.completedAssignments}/{student.totalAssignments}
                          </p>
                          <p className="text-xs text-muted-foreground">Tareas</p>
                        </div>

                        <div className="text-center">
                          <Badge
                            variant={
                              student.status === "completed"
                                ? "default"
                                : student.status === "at-risk"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {student.status === "completed"
                              ? "Completado"
                              : student.status === "at-risk"
                                ? "En Riesgo"
                                : "Activo"}
                          </Badge>
                        </div>

                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab - Enhanced */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-poppins font-semibold">Gestión de Contenido</h2>
              <Dialog open={isCreateContentOpen} onOpenChange={setIsCreateContentOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-secondary hover:bg-secondary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Contenido
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Crear Nuevo Contenido</DialogTitle>
                    <DialogDescription>Selecciona el tipo de contenido que deseas crear</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="content-course">Curso</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar curso" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content-type">Tipo de Contenido</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video Lección</SelectItem>
                          <SelectItem value="document">Documento</SelectItem>
                          <SelectItem value="quiz">Evaluación</SelectItem>
                          <SelectItem value="assignment">Tarea</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content-title">Título</Label>
                      <Input id="content-title" placeholder="Título del contenido" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content-description">Descripción</Label>
                      <Textarea id="content-description" placeholder="Describe el contenido..." />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateContentOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateContent} className="bg-secondary hover:bg-secondary/90">
                      Crear Contenido
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="font-poppins">Biblioteca de Contenido</CardTitle>
                  <CardDescription>Gestiona todo tu material educativo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courseContent.map((content) => (
                      <div
                        key={content.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                            {content.type === "video" && <Video className="w-5 h-5 text-primary" />}
                            {content.type === "document" && <FileText className="w-5 h-5 text-secondary" />}
                            {content.type === "quiz" && <Award className="w-5 h-5 text-accent" />}
                          </div>
                          <div>
                            <h4 className="font-medium">{content.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {content.type === "video" && `${content.duration} • ${content.views} visualizaciones`}
                              {content.type === "document" &&
                                `${content.pages} páginas • ${content.downloads} descargas`}
                              {content.type === "quiz" &&
                                `${content.questions} preguntas • ${content.attempts} intentos`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Subido: {new Date(content.uploadDate).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge variant={content.status === "published" ? "default" : "secondary"}>
                            {content.status === "published" ? "Publicado" : "Borrador"}
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-poppins">Acciones Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setIsCreateContentOpen(true)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Subir Video Clase
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setIsCreateContentOpen(true)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Crear Documento
                  </Button>
                  <Button
                    className="w-full justify-start bg-transparent"
                    variant="outline"
                    onClick={() => setIsCreateContentOpen(true)}
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Crear Evaluación
                  </Button>
                  <Button className="w-full justify-start bg-transparent" variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Importar Contenido
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab - Enhanced */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-poppins font-semibold">Analíticas y Reportes</h2>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Esta semana</SelectItem>
                    <SelectItem value="month">Este mes</SelectItem>
                    <SelectItem value="quarter">Este trimestre</SelectItem>
                    <SelectItem value="year">Este año</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar Reporte
                </Button>
              </div>
            </div>

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
                          <Badge variant="outline">{course.status}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Inscripciones</p>
                            <p className="font-medium">{course.enrollments}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tasa Finalización</p>
                            <p className="font-medium">{course.completionRate}%</p>
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
                            <p className="font-medium text-green-600">${course.revenue}</p>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
