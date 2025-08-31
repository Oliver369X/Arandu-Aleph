"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { courseService } from "@/lib/course-service"
import { aiService } from "@/lib/ai-service"
import { AIAnalysisCard } from "@/components/ui/ai-analysis-card"
import type { Course, CourseProgress } from "@/lib/data-adapter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import {
  BookOpen,
  Clock,
  Trophy,
  Star,
  Play,
  Calendar,
  Award,
  TrendingUp,
  Brain,
  Users,
  Target,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Download,
  Share,
  MessageSquare,
  Bell,
  Settings,
  Gamepad2,
  Zap,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { GameCard } from "@/components/games/game-card"
import { GamePlayer } from "@/components/games/game-player"
import { AIGame, apiService } from "@/lib/api"

export function StudentDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [courses, setCourses] = useState<Course[]>([])
  const [userProgress, setUserProgress] = useState<CourseProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState<{
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    nextSteps: string[];
  } | null>(null)
  
  // Estados para juegos
  const [popularGames, setPopularGames] = useState<AIGame[]>([])
  const [selectedGame, setSelectedGame] = useState<AIGame | null>(null)
  const [isGamePlayerOpen, setIsGamePlayerOpen] = useState(false)
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    favoriteType: 'quiz',
    totalTimeSpent: 0,
    averageScore: 0
  })

  // Función para obtener el progreso de un curso
  const getCourseProgress = (courseId: string): CourseProgress => {
    return userProgress.find(p => p.courseId === courseId) || {
      userId: user?.id || "",
      courseId: courseId,
      progressPercentage: 0,
      completedModules: [] as string[],
      currentModule: "",
      lastAccessed: new Date().toISOString(),
      totalModules: 0,
      completedModulesCount: 0,
    }
  }

  // Funciones para manejar juegos
  const loadPopularGames = async () => {
    try {
      const response = await apiService.getPopularGames(6)
      if (response.success && response.data) {
        setPopularGames(response.data)
      }
    } catch (error) {
      console.error('Error cargando juegos populares:', error)
    }
  }

  const handleGamePlay = (game: AIGame) => {
    setSelectedGame(game)
    setIsGamePlayerOpen(true)
  }

  const handleGameComplete = (results: any) => {
    console.log('🎮 Juego completado:', results)
    // Actualizar estadísticas del estudiante
    setGameStats(prev => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
      totalTimeSpent: prev.totalTimeSpent + (results.timeSpent || 0)
    }))
  }

  // Mock data - en producción vendría del backend
  const studentData = {
    name: user?.name || "Estudiante",
    email: user?.email || "estudiante@email.com",
    avatar: user?.image || "/placeholder.svg?height=40&width=40",
    level: "Intermedio",
    totalCourses: courses.length,
    completedCourses: userProgress.filter(p => p.progressPercentage === 100).length,
    totalHours: courses.reduce((sum, course) => sum + course.duration, 0),
    certificates: userProgress.filter(p => p.progressPercentage === 100).length,
    currentStreak: 7,
    points: 1250,
    nextLevelPoints: 1500,
    weeklyGoal: 10, // horas por semana
    weeklyProgress: 7.5,
  }

  // Convertir cursos reales al formato esperado por el componente
  const enrolledCourses = courses.map(course => {
    const progress = getCourseProgress(course.id)
    return {
      id: course.id,
      title: course.title,
      instructor: course.instructor.name,
      progress: progress.progressPercentage,
      totalLessons: course.modules?.length || 0,
      completedLessons: progress.completedModules?.length || 0,
      nextLesson: course.modules?.find(m => !(progress.completedModules || [] as string[]).includes(m.id))?.title || "Curso completado",
      dueDate: "2024-01-15", // Placeholder
      thumbnail: course.thumbnail || "/placeholder-course.jpg",
      category: course.category || "Tecnología",
      difficulty: course.level || "Intermedio",
      rating: course.rating || 4.5,
      timeSpent: `${Math.round((course.duration || 0) / 60)}h ${(course.duration || 0) % 60}m`,
      lastAccessed: new Date(progress.lastAccessed).toLocaleDateString("es-ES"),
      status: progress.progressPercentage === 100 ? "completed" : 
              progress.progressPercentage > 80 ? "near_completion" : 
              progress.progressPercentage > 0 ? "active" : "just_started",
    }
  })

  // Funciones para acciones reales
  const handleViewCourse = (courseId: string) => {
    console.log('🔍 [StudentDashboard] Viendo curso:', courseId);
    window.location.href = `/course/${courseId}`;
  }

  const handleTakeQuiz = (courseId: string) => {
    console.log('🔍 [StudentDashboard] Tomando quiz del curso:', courseId);
    window.location.href = `/quiz/${courseId}`;
  }

  const handleViewCertificate = (courseId: string) => {
    console.log('🔍 [StudentDashboard] Viendo certificado del curso:', courseId);
    window.location.href = `/certificates/${courseId}`;
  }

  const handleBrowseCourses = () => {
    console.log('🔍 [StudentDashboard] Navegando a catálogo de cursos');
    window.location.href = '/courses';
  }

  const handleViewProfile = () => {
    console.log('🔍 [StudentDashboard] Viendo perfil');
    window.location.href = '/profile';
  }

  const recentActivity = [
    {
      type: "lesson_completed",
      title: "Completaste: Fundamentos de Machine Learning",
      course: "Introducción a la IA",
      time: "Hace 2 horas",
      points: 50,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      type: "quiz_passed",
      title: "Aprobaste el quiz: Conceptos de Blockchain",
      course: "Blockchain y Criptomonedas",
      time: "Ayer",
      points: 25,
      icon: Star,
      color: "text-yellow-500",
    },
    {
      type: "certificate_earned",
      title: "¡Obtuviste un certificado!",
      course: "Desarrollo Web con React",
      time: "Hace 3 días",
      points: 100,
      icon: Trophy,
      color: "text-primary",
    },
    {
      type: "discussion_reply",
      title: "Recibiste una respuesta en el foro",
      course: "Introducción a la IA",
      time: "Hace 1 día",
      points: 10,
      icon: MessageSquare,
      color: "text-blue-500",
    },
  ]

  const upcomingDeadlines = [
    {
      title: "Entrega de Proyecto Final",
      course: "Desarrollo Web con React",
      dueDate: "2024-01-10",
      priority: "high",
      timeLeft: "2 días",
      type: "project",
    },
    {
      title: "Quiz: Redes Neuronales",
      course: "Introducción a la IA",
      dueDate: "2024-01-15",
      priority: "medium",
      timeLeft: "1 semana",
      type: "quiz",
    },
    {
      title: "Tarea: Análisis de Smart Contracts",
      course: "Blockchain y Criptomonedas",
      dueDate: "2024-01-20",
      priority: "low",
      timeLeft: "2 semanas",
      type: "assignment",
    },
  ]

  const achievements = [
    {
      title: "Primer Curso Completado",
      description: "Completaste tu primer curso en ARANDU",
      icon: Trophy,
      earned: true,
      date: "2023-12-15",
      rarity: "common",
    },
    {
      title: "Racha de 7 días",
      description: "Estudiaste 7 días consecutivos",
      icon: Target,
      earned: true,
      date: "2024-01-05",
      rarity: "uncommon",
    },
    {
      title: "Experto en IA",
      description: "Completa 3 cursos de Inteligencia Artificial",
      icon: Brain,
      earned: false,
      progress: 33,
      rarity: "rare",
    },
    {
      title: "Colaborador Activo",
      description: "Participa en 10 discusiones del foro",
      icon: Users,
      earned: false,
      progress: 60,
      rarity: "uncommon",
    },
    {
      title: "Velocista del Aprendizaje",
      description: "Completa un curso en menos de una semana",
      icon: TrendingUp,
      earned: false,
      progress: 0,
      rarity: "epic",
    },
  ]

  const studyStats = {
    thisWeek: {
      hoursStudied: 7.5,
      lessonsCompleted: 12,
      quizzesPassed: 3,
      pointsEarned: 275,
    },
    thisMonth: {
      hoursStudied: 28,
      lessonsCompleted: 45,
      quizzesPassed: 12,
      pointsEarned: 950,
    },
  }

  const filteredCourses = enrolledCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === "all" || course.category.toLowerCase() === filterCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "Tecnología", "Fintech", "Programación", "Diseño"]

  useEffect(() => {
    if (user?.id) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Cargar cursos
      const coursesData = await courseService.getCourses()
      setCourses(coursesData)
      
      // Cargar progreso del usuario
      const progressData = await courseService.getUserProgress(user!.id)
      
      // Cargar juegos populares
      await loadPopularGames()
      setUserProgress(progressData)
      
      // Obtener análisis de IA
      const analysis = await aiService.analyzeStudentProgress(user!.id)
      setAiAnalysis(analysis)
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span>Cargando dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del Dashboard */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={studentData.avatar || "/placeholder.svg"} alt={studentData.name} />
                <AvatarFallback>
                  {studentData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-poppins font-bold text-foreground">
                  ¡Hola, {studentData.name.split(" ")[0]}!
                </h1>
                <p className="text-muted-foreground">Continúa tu viaje de aprendizaje</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-muted-foreground">Progreso al siguiente nivel:</span>
                  <Progress value={(studentData.points / studentData.nextLevelPoints) * 100} className="w-32" />
                  <span className="text-sm text-muted-foreground">
                    {studentData.points}/{studentData.nextLevelPoints}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-sm">
                Nivel {studentData.level}
              </Badge>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{studentData.points}</p>
                <p className="text-sm text-muted-foreground">Puntos</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/messages">
                    <MessageSquare className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/notifications">
                    <Bell className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/profile">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cursos Activos</p>
                  <p className="text-2xl font-bold text-foreground">{studentData.totalCourses}</p>
                  <p className="text-xs text-muted-foreground">{studentData.completedCourses} completados</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={handleBrowseCourses}
              >
                Ver Cursos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Horas de Estudio</p>
                  <p className="text-2xl font-bold text-foreground">{studentData.totalHours}h</p>
                  <p className="text-xs text-muted-foreground">Esta semana: {studyStats.thisWeek.hoursStudied}h</p>
                </div>
                <Clock className="h-8 w-8 text-emerald-500" />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={() => window.location.href = '/progress'}
              >
                Ver Progreso
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certificados</p>
                  <p className="text-2xl font-bold text-foreground">{studentData.certificates}</p>
                  <p className="text-xs text-muted-foreground">Verificados en blockchain</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-3"
                onClick={() => window.location.href = '/certificates'}
              >
                Ver Certificados
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Racha Actual</p>
                  <p className="text-2xl font-bold text-foreground">{studentData.currentStreak} días</p>
                  <p className="text-xs text-muted-foreground">¡Sigue así!</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Meta Semanal</p>
                  <p className="text-2xl font-bold text-foreground">{studentData.weeklyProgress}h</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Progress
                      value={(studentData.weeklyProgress / studentData.weeklyGoal) * 100}
                      className="w-16 h-1"
                    />
                    <span className="text-xs text-muted-foreground">/{studentData.weeklyGoal}h</span>
                  </div>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="courses">Mis Cursos</TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-1">
              <Gamepad2 className="w-4 h-4" />
              Juegos
            </TabsTrigger>
            <TabsTrigger value="progress">Progreso</TabsTrigger>
            <TabsTrigger value="achievements">Logros</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cursos en Progreso */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Continuar Aprendiendo
                    </CardTitle>
                    <CardDescription>Tus cursos en progreso</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <img
                          src={course.thumbnail || "/placeholder.svg"}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">{course.instructor}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Progress value={course.progress} className="flex-1" />
                            <span className="text-sm text-muted-foreground">{course.progress}%</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>Tiempo: {course.timeSpent}</span>
                            <span>Último acceso: {course.lastAccessed}</span>
                          </div>
                        </div>
                        <Button size="sm" asChild>
                          <Link href={`/course/${course.id}`}>
                            <Play className="h-4 w-4 mr-2" />
                            Continuar
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Actividad Reciente y Análisis de IA */}
              <div className="space-y-6">
                {/* Análisis de IA */}
                {aiAnalysis && (
                  <AIAnalysisCard 
                    analysis={aiAnalysis}
                    title="Análisis de IA"
                    description="Recomendaciones personalizadas basadas en tu progreso"
                    showDetails={false}
                  />
                )}

                {/* Actividad Reciente */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Actividad Reciente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <activity.icon className={`h-4 w-4 ${activity.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.course}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          +{activity.points}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Próximas Fechas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Próximas Fechas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <AlertCircle
                            className={`h-4 w-4 ${
                              deadline.priority === "high"
                                ? "text-red-500"
                                : deadline.priority === "medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{deadline.title}</p>
                          <p className="text-xs text-muted-foreground">{deadline.course}</p>
                          <p className="text-xs text-muted-foreground">Faltan: {deadline.timeLeft}</p>
                        </div>
                        <Badge variant={deadline.type === "project" ? "default" : "outline"} className="text-xs">
                          {deadline.type}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Sección de Juegos Populares */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  🎮 Juegos Educativos Populares
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('games')}
                >
                  Ver todos
                </Button>
              </div>
              
              {popularGames.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularGames.slice(0, 3).map(game => (
                    <GameCard
                      key={game.id}
                      game={game}
                      onPlay={handleGamePlay}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No hay juegos disponibles aún
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Enhanced Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Todas las categorías" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      {course.status === "near_completion" && (
                        <Badge variant="default" className="bg-green-500">
                          Casi terminado
                        </Badge>
                      )}
                      {course.status === "just_started" && <Badge variant="outline">Recién iniciado</Badge>}
                    </div>
                    <div className="absolute top-2 left-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleViewCourse(course.id)}>
                            <BookOpen className="h-4 w-4 mr-2" />
                            Ver Curso
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTakeQuiz(course.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Tomar Quiz
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewCertificate(course.id)}>
                            <Trophy className="h-4 w-4 mr-2" />
                            Ver Certificado
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Descargar recursos
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share className="h-4 w-4 mr-2" />
                            Compartir progreso
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Ir al foro
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground line-clamp-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground">{course.instructor}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-muted-foreground">{course.rating}</span>
                        <Badge variant="outline" className="text-xs">
                          {course.difficulty}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progreso</span>
                          <span className="text-foreground">
                            {course.completedLessons}/{course.totalLessons} lecciones
                          </span>
                        </div>
                        <Progress value={course.progress} />
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Tiempo invertido:</span>
                          <span>{course.timeSpent}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Último acceso:</span>
                          <span>{course.lastAccessed}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <p className="text-sm text-muted-foreground mb-2">Siguiente: {course.nextLesson}</p>
                        <Button className="w-full" asChild>
                          <Link href={`/course/${course.id}`}>
                            <Play className="h-4 w-4 mr-2" />
                            Continuar Curso
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Estadísticas de Juegos */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5" />
                    Mis Estadísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Juegos jugados</span>
                      <span className="font-medium">{gameStats.gamesPlayed}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tiempo total</span>
                      <span className="font-medium">{Math.floor(gameStats.totalTimeSpent / 60)}h {gameStats.totalTimeSpent % 60}m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Puntuación promedio</span>
                      <span className="font-medium">{gameStats.averageScore}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tipo favorito</span>
                      <Badge variant="secondary">{gameStats.favoriteType}</Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">Racha actual</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < 5 ? 'bg-green-500' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      5 días seguidos jugando
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Juegos */}
              <div className="lg:col-span-3 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5" />
                      Juegos Disponibles
                    </CardTitle>
                    <CardDescription>
                      Explora y juega juegos educativos personalizados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {popularGames.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {popularGames.map(game => (
                          <GameCard
                            key={game.id}
                            game={game}
                            onPlay={handleGamePlay}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Gamepad2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hay juegos disponibles</h3>
                        <p className="text-muted-foreground mb-4">
                          Los juegos aparecerán aquí cuando estén disponibles para tus cursos
                        </p>
                        <Button variant="outline">
                          Explorar Cursos
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Enhanced Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Progreso General</CardTitle>
                  <CardDescription>Tu avance en la plataforma</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Cursos Completados</span>
                        <span>
                          {studentData.completedCourses}/{studentData.totalCourses}
                        </span>
                      </div>
                      <Progress value={(studentData.completedCourses / studentData.totalCourses) * 100} />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Horas de Estudio</span>
                        <span>{studentData.totalHours}/100h</span>
                      </div>
                      <Progress value={(studentData.totalHours / 100) * 100} />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Certificados Obtenidos</span>
                        <span>{studentData.certificates}/5</span>
                      </div>
                      <Progress value={(studentData.certificates / 5) * 100} />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Meta Semanal</span>
                        <span>
                          {studentData.weeklyProgress}/{studentData.weeklyGoal}h
                        </span>
                      </div>
                      <Progress value={(studentData.weeklyProgress / studentData.weeklyGoal) * 100} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de Aprendizaje</CardTitle>
                  <CardDescription>Métricas de tu rendimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">{studentData.currentStreak}</div>
                      <div className="text-sm text-muted-foreground">Días consecutivos</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-emerald-500">4.8</div>
                      <div className="text-sm text-muted-foreground">Promedio de calificaciones</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-yellow-500">92%</div>
                      <div className="text-sm text-muted-foreground">Tasa de finalización</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-500">15</div>
                      <div className="text-sm text-muted-foreground">Proyectos completados</div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-3">Esta Semana</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horas:</span>
                          <span className="font-medium">{studyStats.thisWeek.hoursStudied}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lecciones:</span>
                          <span className="font-medium">{studyStats.thisWeek.lessonsCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quizzes:</span>
                          <span className="font-medium">{studyStats.thisWeek.quizzesPassed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Puntos:</span>
                          <span className="font-medium">{studyStats.thisWeek.pointsEarned}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Este Mes</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Horas:</span>
                          <span className="font-medium">{studyStats.thisMonth.hoursStudied}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lecciones:</span>
                          <span className="font-medium">{studyStats.thisMonth.lessonsCompleted}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quizzes:</span>
                          <span className="font-medium">{studyStats.thisMonth.quizzesPassed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Puntos:</span>
                          <span className="font-medium">{studyStats.thisMonth.pointsEarned}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enhanced Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`${achievement.earned ? "border-primary bg-primary/5" : "border-border"}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`p-3 rounded-full ${achievement.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                      >
                        <achievement.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              achievement.rarity === "common"
                                ? "border-gray-400 text-gray-600"
                                : achievement.rarity === "uncommon"
                                  ? "border-green-400 text-green-600"
                                  : achievement.rarity === "rare"
                                    ? "border-blue-400 text-blue-600"
                                    : "border-purple-400 text-purple-600"
                            }`}
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>

                        {achievement.earned ? (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600 dark:text-green-400">
                              Obtenido el {achievement.date}
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Progreso</span>
                              <span className="text-foreground">{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Enhanced Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendario de Actividades</CardTitle>
                <CardDescription>Próximas clases, exámenes y entregas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingDeadlines.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.course}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">Fecha límite: {item.dueDate}</p>
                          <span className="text-sm font-medium">• Faltan: {item.timeLeft}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                        <Badge
                          variant={
                            item.priority === "high"
                              ? "destructive"
                              : item.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {item.priority === "high" ? "Urgente" : item.priority === "medium" ? "Medio" : "Bajo"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Game Player Modal */}
      <GamePlayer
        game={selectedGame || undefined}
        isOpen={isGamePlayerOpen}
        onClose={() => {
          setIsGamePlayerOpen(false)
          setSelectedGame(null)
        }}
        onComplete={handleGameComplete}
      />
    </div>
  )
}
