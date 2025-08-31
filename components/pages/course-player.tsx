"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { courseService } from "@/lib/course-service"
import { aiService } from "@/lib/ai-service"
import { apiService } from "@/lib/api"
import type { Course, CourseProgress, AIFeedback } from "@/lib/data-adapter"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Maximize,
  FileText,
  Download,
  Star,
  CheckCircle,
  Lock,
  Clock,
  Users,
  ArrowLeft,
  ArrowRight,
  Brain,
  Target,
  Lightbulb,
  Loader2,
  CheckSquare,
  Square,
  Gamepad2,
} from "lucide-react"
import Link from "next/link"
import { GameLibrary } from "@/components/games/game-library"

interface CoursePlayerProps {
  courseId?: string
}

export function CoursePlayer({ courseId }: CoursePlayerProps) {
  const { user } = useAuth()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")
  const [courseData, setCourseData] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [userProgress, setUserProgress] = useState<CourseProgress | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [aiContent, setAiContent] = useState<any>(null)
  const [isGeneratingContent, setIsGeneratingContent] = useState(false)
  const [aiFeedbackSteps, setAiFeedbackSteps] = useState<AIFeedback[]>([])
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)
  
  // Mock resources data
  const resources = [
    {
      title: "Presentación de la Lección",
      size: "2.5 MB",
      type: "pdf"
    },
    {
      title: "Ejercicios Prácticos",
      size: "1.8 MB", 
      type: "pdf"
    },
    {
      title: "Código de Ejemplo",
      size: "450 KB",
      type: "zip"
    }
  ]

  const generateAIContent = async (moduleId: string) => {
    try {
      setIsGeneratingContent(true)
      const content = await aiService.generateEducationalContent(moduleId)
      setAiContent(content)
    } catch (error) {
      console.error('Error generating AI content:', error)
    } finally {
      setIsGeneratingContent(false)
    }
  }

  const loadAIContent = async (moduleId: string) => {
    try {
      // First try to get existing AI feedback and convert it to content
      const existingFeedback = await aiService.getAIFeedbackBySubtopic(moduleId)
      
      if (existingFeedback.length > 0) {
        // Convert existing AI feedback to content format
        const content = {
          content: existingFeedback.map(step => step.content).join('\n\n'),
          summary: existingFeedback[0]?.content.substring(0, 200) + '...' || '',
          keyPoints: existingFeedback
            .map(step => step.successIndicator)
            .filter(Boolean)
            .slice(0, 5),
          examples: existingFeedback
            .map(step => step.studentActivity)
            .filter(Boolean)
            .slice(0, 3)
        }
        setAiContent(content)
        return
      }
      
      // If no existing feedback, generate new content
      await generateAIContent(moduleId)
    } catch (error) {
      console.error('Error loading AI content:', error)
    }
  }

  const fetchAIFeedbackSteps = async (moduleId: string) => {
    try {
      setIsLoadingFeedback(true)
      const feedbackSteps = await aiService.getAIFeedbackBySubtopic(moduleId)
      setAiFeedbackSteps(feedbackSteps)
      return feedbackSteps
    } catch (error) {
      console.error('Error fetching AI feedback steps:', error)
      setAiFeedbackSteps([])
      return []
    } finally {
      setIsLoadingFeedback(false)
    }
  }

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !user?.id) return
      
      try {
        setIsLoading(true)
        
        // Fetch course details
        const course = await courseService.getCourseById(courseId)
        setCourseData(course)
        
        // Fetch course modules/lessons
        try {
          const courseModulesResponse = await apiService.getSubtopicsBySubjectId(courseId)
          if (courseModulesResponse.success && courseModulesResponse.data) {
            setLessons(courseModulesResponse.data)
            
            // Load AI content and feedback for the current lesson
            if (courseModulesResponse.data.length > 0) {
              const firstLessonId = courseModulesResponse.data[0].id
              
              // Load both AI feedback steps and content
              await Promise.all([
                fetchAIFeedbackSteps(firstLessonId),
                loadAIContent(firstLessonId)
              ])
            }
          } else {
            console.error('Error fetching course modules:', courseModulesResponse.error)
            // Fallback to empty array
            setLessons([])
          }
        } catch (apiError) {
          console.error('API Error fetching course modules:', apiError)
          // Fallback to empty array if API fails completely
          setLessons([])
        }
        
        // Fetch user progress
        const progressArray = await courseService.getUserProgress(user.id)
        const progress = progressArray.find(p => p.courseId === courseId) || null
        setUserProgress(progress)
        
      } catch (error) {
        console.error('Error fetching course data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourseData()
  }, [courseId, user?.id])

  const handleStatusUpdate = async (stepId: string, newStatus: boolean) => {
    try {
      setUpdatingStatus(stepId)
      
      // Find the current step to get all required data
      const currentStep = aiFeedbackSteps.find(step => step.id === stepId)
      if (!currentStep) {
        console.error('Step not found:', stepId)
        return
      }

      // Prepare the update data with all required fields
      const updateData = {
        id: currentStep.id,
        subtopicId: currentStep.subtopicId,
        timeMinutes: currentStep.timeMinutes,
        stepNumber: currentStep.stepNumber,
        stepName: currentStep.stepName,
        content: currentStep.content,
        studentActivity: currentStep.studentActivity,
        timeAllocation: currentStep.timeAllocation,
        materialsNeeded: currentStep.materialsNeeded,
        successIndicator: currentStep.successIndicator,
        status: newStatus
      }

      // Update the step
      const updatedStep = await aiService.updateAIFeedbackStep(stepId, updateData)
      
      if (updatedStep) {
        // Update local state
        setAiFeedbackSteps(prev => 
          prev.map(step => 
            step.id === stepId 
              ? { ...step, status: newStatus }
              : step
          )
        )
      }
    } catch (error) {
      console.error('Error updating step status:', error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Curso no encontrado</h2>
          <p className="text-muted-foreground">El curso que buscas no existe o no tienes acceso.</p>
        </div>
      </div>
    )
  }

  const currentLessonData = Array.isArray(lessons) && lessons.length > 0 
    ? lessons.find((lesson) => lesson.current) || lessons[0] 
    : null

  // Show message if no lessons are available
  if (!Array.isArray(lessons) || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/dashboard/student">
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">No hay lecciones disponibles</h2>
              <p className="text-muted-foreground mb-4">Este curso aún no tiene contenido disponible o hay un problema de conexión con el servidor.</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Verifica que el servidor backend esté ejecutándose en http://localhost:3001</p>
                <p>• Asegúrate de que el endpoint /api-v1/subtopics esté disponible</p>
                <p>• Revisa la consola del navegador para más detalles del error</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with course info */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" className="flex items-center gap-2" asChild>
              <Link href="/dashboard/student">
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">{courseData.category}</Badge>
              <Badge variant="outline">{courseData.difficulty || 'Intermedio'}</Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-foreground mb-2">{courseData.title}</h1>
              <p className="text-muted-foreground">
                Por {courseData.instructor?.name || 'Instructor'} • {userProgress?.completedModulesCount || 0}/{lessons.length} lecciones
                completadas
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Progreso del curso</div>
              <div className="flex items-center gap-2">
                <Progress value={courseData.progress || 0} className="w-32" />
                <span className="text-sm font-medium">{courseData.progress || 0}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <Card className="mb-6">
              <CardContent className="p-0">
                {/* Video Container */}
                <div className="aspect-video bg-black rounded-t-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="/placeholder.svg?height=400&width=600&text=Video+Player"
                      alt="Video Player"
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button size="lg" className="rounded-full w-16 h-16" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="p-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm">
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Volume2 className="h-4 w-4" />
                        <div className="w-20 h-1 bg-muted rounded-full">
                          <div className="w-3/4 h-full bg-primary rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">5:30 / {currentLessonData?.duration || '00:00'}</span>
                      <Button variant="ghost" size="sm">
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full h-1 bg-muted rounded-full">
                      <div className="w-1/3 h-full bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lesson Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">Resumen</TabsTrigger>
                <TabsTrigger value="ai-content">Contenido IA</TabsTrigger>
                <TabsTrigger value="ai-feedback">Plan de Lección</TabsTrigger>
                <TabsTrigger value="games" className="flex items-center gap-1">
                  <Gamepad2 className="w-4 h-4" />
                  Juegos
                </TabsTrigger>
                <TabsTrigger value="notes">Notas</TabsTrigger>
                <TabsTrigger value="resources">Recursos</TabsTrigger>
                <TabsTrigger value="discussion">Discusión</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{currentLessonData?.title || 'Lección no disponible'}</CardTitle>
                    <CardDescription>{currentLessonData?.description || 'Descripción no disponible'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {currentLessonData?.duration || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {courseData.totalStudents || 0} estudiantes
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-yellow-500" />
                          {courseData.rating || 0}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="font-semibold mb-2">Objetivos de Aprendizaje</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            Comprender los conceptos fundamentales de las redes neuronales
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            Identificar los componentes básicos de una neurona artificial
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            Aplicar conceptos básicos en ejemplos prácticos
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-content" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Contenido Generado por IA
                    </CardTitle>
                    <CardDescription>Contenido educativo personalizado generado por inteligencia artificial</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isGeneratingContent ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span>Generando contenido personalizado...</span>
                        </div>
                      </div>
                    ) : aiContent ? (
                      <div className="space-y-6">
                        {/* Summary */}
                        <div>
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-600" />
                            Resumen
                          </h3>
                          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                            <p className="text-blue-800 dark:text-blue-200">{aiContent.summary}</p>
                          </div>
                        </div>

                        {/* Key Points */}
                        {aiContent.keyPoints && aiContent.keyPoints.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Target className="h-4 w-4 text-green-600" />
                              Puntos Clave
                            </h3>
                            <ul className="space-y-2">
                              {aiContent.keyPoints.map((point: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                  <span>{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Examples */}
                        {aiContent.examples && aiContent.examples.length > 0 && (
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Star className="h-4 w-4 text-yellow-600" />
                              Ejemplos Prácticos
                            </h3>
                            <ul className="space-y-2">
                              {aiContent.examples.map((example: string, index: number) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Full Content */}
                        <div>
                          <h3 className="font-semibold mb-3">Contenido Completo</h3>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-foreground leading-relaxed whitespace-pre-wrap">{aiContent.content}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                          <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Descargar Contenido
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Brain className="h-4 w-4" />
                            Generar Quiz
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Ver Plan de Lección
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No hay contenido generado</h3>
                        <p className="text-muted-foreground mb-4">
                          Haz clic en el botón para generar contenido personalizado con IA
                        </p>
                        <Button onClick={() => currentLessonData?.id && loadAIContent(currentLessonData.id)}>
                          <Brain className="h-4 w-4 mr-2" />
                          Cargar Contenido IA
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-feedback" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Plan de Lección IA
                    </CardTitle>
                    <CardDescription>Pasos detallados del plan de lección generado por IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingFeedback ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-6 w-6 animate-spin" />
                          <span>Cargando plan de lección...</span>
                        </div>
                      </div>
                    ) : aiFeedbackSteps.length > 0 ? (
                      <div className="space-y-6">
                        {aiFeedbackSteps.map((step) => (
                          <div key={step.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={step.status || false}
                                    onCheckedChange={(checked) => 
                                      handleStatusUpdate(step.id, checked as boolean)
                                    }
                                    disabled={updatingStatus === step.id}
                                  />
                                  {updatingStatus === step.id && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">
                                    Paso {step.stepNumber}: {step.stepName}
                                  </h3>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {step.timeMinutes} minutos
                                    </span>
                                    <Badge variant={step.status ? "default" : "secondary"}>
                                      {step.status ? "Completado" : "Pendiente"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {/* Content */}
                              <div>
                                <h4 className="font-medium mb-2 text-sm text-muted-foreground">Contenido:</h4>
                                <p className="text-sm leading-relaxed">{step.content}</p>
                              </div>

                              {/* Student Activity */}
                              {step.studentActivity && (
                                <div>
                                  <h4 className="font-medium mb-2 text-sm text-muted-foreground">Actividad del Estudiante:</h4>
                                  <p className="text-sm leading-relaxed">{step.studentActivity}</p>
                                </div>
                              )}

                              {/* Time Allocation */}
                              <div>
                                <h4 className="font-medium mb-2 text-sm text-muted-foreground">Distribución de Tiempo:</h4>
                                <p className="text-sm leading-relaxed">{step.timeAllocation}</p>
                              </div>

                              {/* Materials Needed */}
                              {step.materialsNeeded && (
                                <div>
                                  <h4 className="font-medium mb-2 text-sm text-muted-foreground">Materiales Necesarios:</h4>
                                  <p className="text-sm leading-relaxed">{step.materialsNeeded}</p>
                                </div>
                              )}

                              {/* Success Indicator */}
                              {step.successIndicator && (
                                <div>
                                  <h4 className="font-medium mb-2 text-sm text-muted-foreground">Indicador de Éxito:</h4>
                                  <p className="text-sm leading-relaxed">{step.successIndicator}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Summary */}
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h3 className="font-semibold mb-2">Resumen del Plan</h3>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Total de pasos:</span>
                              <span className="ml-2 font-medium">{aiFeedbackSteps.length}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Tiempo total:</span>
                              <span className="ml-2 font-medium">
                                {aiFeedbackSteps.reduce((sum, step) => sum + step.timeMinutes, 0)} minutos
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Pasos completados:</span>
                              <span className="ml-2 font-medium">
                                {aiFeedbackSteps.filter(step => step.status).length}
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Progreso:</span>
                              <span className="ml-2 font-medium">
                                {Math.round((aiFeedbackSteps.filter(step => step.status).length / aiFeedbackSteps.length) * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-semibold mb-2">No hay plan de lección disponible</h3>
                        <p className="text-muted-foreground mb-4">
                          El plan de lección para esta unidad aún no ha sido generado
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Mis Notas</CardTitle>
                    <CardDescription>Toma notas durante la lección</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <textarea
                        className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Escribe tus notas aquí..."
                      />
                      <Button>Guardar Notas</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recursos de la Lección</CardTitle>
                    <CardDescription>Materiales adicionales para descargar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{resource.title}</p>
                              <p className="text-sm text-muted-foreground">{resource.size}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="games" className="mt-6">
                <GameLibrary 
                  subtopicId={currentLessonData?.id}
                  showGenerator={true}
                  onGameSelect={(game) => {
                    console.log('🎮 Juego seleccionado:', game);
                  }}
                />
              </TabsContent>

              <TabsContent value="discussion" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Discusión de la Lección</CardTitle>
                    <CardDescription>Participa en la conversación con otros estudiantes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                            JD
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">Juan Díaz</span>
                              <span className="text-sm text-muted-foreground">hace 2 horas</span>
                            </div>
                            <p className="text-sm">
                              Excelente explicación.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            CM
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">Dr. Carlos Mendoza</span>
                              <Badge variant="secondary" className="text-xs">
                                Instructor
                              </Badge>
                              <span className="text-sm text-muted-foreground">hace 1 hora</span>
                            </div>
                            <p className="text-sm">
                              @Juan Díaz Un gusto.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-muted-foreground text-sm font-medium">
                          MG
                        </div>
                        <div className="flex-1">
                          <textarea
                            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Únete a la discusión..."
                            rows={3}
                          />
                          <Button className="mt-2">Publicar Comentario</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar with lesson list */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contenido del Curso</CardTitle>
                <CardDescription>
                  {userProgress?.completedModulesCount || 0} de {lessons.length} lecciones
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="p-4 space-y-2">
                    {lessons.map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          lesson.current
                            ? "bg-primary text-primary-foreground"
                            : lesson.completed
                              ? "bg-muted hover:bg-muted/80"
                              : "hover:bg-muted/50"
                        }`}
                        onClick={async () => {
                          setCurrentLesson(index)
                          if (lesson.id) {
                            await Promise.all([
                              fetchAIFeedbackSteps(lesson.id),
                              loadAIContent(lesson.id)
                            ])
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {lesson.completed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : lesson.current ? (
                              <Play className="h-4 w-4" />
                            ) : (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-1">{lesson.title}</h4>
                            <div className="flex items-center gap-2 text-xs opacity-75">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Navigation buttons */}
            <div className="mt-4 space-y-2">
              <Button 
                className="w-full" 
                disabled={currentLesson === 0}
                onClick={async () => {
                  if (currentLesson > 0) {
                    const newLessonIndex = currentLesson - 1
                    setCurrentLesson(newLessonIndex)
                    const lesson = lessons[newLessonIndex]
                    if (lesson?.id) {
                      await Promise.all([
                        fetchAIFeedbackSteps(lesson.id),
                        loadAIContent(lesson.id)
                      ])
                    }
                  }
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Lección Anterior
              </Button>
              <Button 
                className="w-full bg-transparent" 
                variant="outline"
                disabled={currentLesson === lessons.length - 1}
                onClick={async () => {
                  if (currentLesson < lessons.length - 1) {
                    const newLessonIndex = currentLesson + 1
                    setCurrentLesson(newLessonIndex)
                    const lesson = lessons[newLessonIndex]
                    if (lesson?.id) {
                      await Promise.all([
                        fetchAIFeedbackSteps(lesson.id),
                        loadAIContent(lesson.id)
                      ])
                    }
                  }
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Siguiente Lección
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
