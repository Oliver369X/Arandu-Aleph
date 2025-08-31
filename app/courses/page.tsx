"use client"

import { useState, useEffect } from "react"
import { courseService } from "@/lib/course-service"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, Users, Star, Play, Search, Filter, Plus } from "lucide-react"
import type { Course } from "@/lib/data-adapter"

export default function CoursesPage() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchQuery, selectedCategory, selectedLevel])

  const loadCourses = async () => {
    try {
      setIsLoading(true)
      const coursesData = await courseService.getCourses()
      setCourses(coursesData)
    } catch (error) {
      console.error('Error loading courses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = courses

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Filtrar por nivel
    if (selectedLevel !== "all") {
      filtered = filtered.filter(course => course.level === selectedLevel)
    }

    setFilteredCourses(filtered)
  }

  const handleEnrollCourse = async (courseId: string) => {
    try {
      console.log('🔍 [CoursesPage] Inscribiéndose en curso:', courseId);
      // Aquí iría la lógica para inscribirse en el curso
      alert('¡Te has inscrito exitosamente en el curso!')
      // Recargar cursos para actualizar el estado
      await loadCourses()
    } catch (error) {
      console.error('Error enrolling in course:', error)
      alert('Error al inscribirse en el curso')
    }
  }

  const handleViewCourse = (courseId: string) => {
    console.log('🔍 [CoursesPage] Viendo curso:', courseId);
    window.location.href = `/course/${courseId}`;
  }

  const categories = ["Tecnología", "Ciencia", "Arte", "Negocios", "Salud", "Educación"]
  const levels = ["Principiante", "Intermedio", "Avanzado"]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span>Cargando cursos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Catálogo de Cursos</h1>
          <p className="text-muted-foreground">Explora nuestra colección de cursos y encuentra tu próximo desafío de aprendizaje</p>
        </div>

        {/* Filtros */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-muted-foreground">
            {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grid de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2 mb-3">
                      {course.description || "Descripción del curso no disponible"}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {course.instructor?.name?.charAt(0) || "I"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">{course.instructor?.name || "Instructor"}</span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{Math.round((course.duration || 0) / 60)}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.studentsCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{course.rating || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{course.category || "Tecnología"}</Badge>
                  <Badge variant="outline">{course.level || "Intermedio"}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewCourse(course.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Ver Curso
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEnrollCourse(course.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Inscribirse
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron cursos</h3>
            <p className="text-muted-foreground">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}
