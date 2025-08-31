"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { aiService } from "@/lib/ai-service"
import { courseService } from "@/lib/course-service"
import type { LessonPlan, LessonStep } from "@/lib/ai-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Target, 
  CheckCircle, 
  Play, 
  Brain, 
  Users, 
  Timer, 
  Loader2,
  Download,
  Share,
  Bookmark,
  Lightbulb
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function LessonPlanPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [lessonPlan, setLessonPlan] = useState<LessonPlan | null>(null)
  const [course, setCourse] = useState<any>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // Obtener el ID del módulo desde los parámetros
  const moduleId = params.id as string

  useEffect(() => {
    if (moduleId && user) {
      loadLessonPlan()
    }
  }, [moduleId, user])

  const loadLessonPlan = async () => {
    try {
      setIsLoading(true)
      
      // Generar plan de lección usando IA
      const planData = await aiService.generateLessonPlan(moduleId)
      if (!planData) {
        toast({
          title: "Error",
          description: "No se pudo generar el plan de lección. Inténtalo de nuevo.",
          variant: "destructive",
        })
        return
      }

      setLessonPlan(planData)

      // Obtener información del curso
      const courseData = await courseService.getCourseById(moduleId)
      setCourse(courseData)

    } catch (error) {
      console.error('Error loading lesson plan:', error)
      toast({
        title: "Error",
        description: "Error al cargar el plan de lección. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const markStepAsCompleted = (stepNumber: number) => {
    setCompletedSteps(prev => new Set([...prev, stepNumber]))
    
    // Si es el último paso, marcar el módulo como completado
    if (stepNumber === lessonPlan!.steps.length - 1) {
      handleCompleteModule()
    }
  }

  const handleCompleteModule = async () => {
    if (!user || !moduleId) return

    try {
      await courseService.updateModuleProgress(moduleId, user.id, 100)
      toast({
        title: "¡Felicitaciones!",
        description: "Has completado este módulo exitosamente.",
      })
    } catch (error) {
      console.error('Error completing module:', error)
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Generando plan de lección con IA...</span>
        </div>
      </div>
    )
  }

  if (!lessonPlan) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error al cargar el plan de lección</h2>
          <p className="text-muted-foreground mb-4">No se pudo generar el plan para este módulo.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  const progress = (completedSteps.size / lessonPlan.steps.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" className="flex items-center gap-2" onClick={() => router.push(`/course/${moduleId}`)}>
              <ArrowLeft className="h-4 w-4" />
              Volver al Curso
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                Generado por IA
              </Badge>
              <Badge variant="secondary">
                {formatDuration(lessonPlan.totalDuration)}
              </Badge>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-poppins font-bold text-foreground mb-2">{lessonPlan.title}</h1>
            <p className="text-muted-foreground mb-4">
              {course?.title || "Curso"} • Plan de lección personalizado por IA
            </p>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progreso del plan de lección</span>
                <span>{Math.round(progress)}% completado</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(parseInt(value))}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                {lessonPlan.steps.map((step, index) => (
                  <TabsTrigger 
                    key={step.id} 
                    value={index.toString()}
                    className="flex items-center gap-2"
                  >
                    {completedSteps.has(index) && <CheckCircle className="h-3 w-3 text-green-500" />}
                    Paso {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>

              {lessonPlan.steps.map((step, index) => (
                <TabsContent key={step.id} value={index.toString()} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{step.title}</CardTitle>
                          <CardDescription className="text-base">
                            Paso {step.stepNumber} de {lessonPlan.totalSteps}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {formatDuration(step.duration)}
                          </Badge>
                          {completedSteps.has(index) && (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completado
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Content */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          Contenido
                        </h3>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-foreground leading-relaxed">{step.content}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Student Activity */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Actividad del Estudiante
                        </h3>
                        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                          <p className="text-blue-800 dark:text-blue-200">{step.studentActivity}</p>
                        </div>
                      </div>

                      <Separator />

                      {/* Time Allocation */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Distribución del Tiempo
                        </h3>
                        <p className="text-muted-foreground">{step.timeAllocation}</p>
                      </div>

                      <Separator />

                      {/* Materials Needed */}
                      {step.materialsNeeded.length > 0 && (
                        <>
                          <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Materiales Necesarios
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {step.materialsNeeded.map((material, idx) => (
                                <Badge key={idx} variant="outline">
                                  {material}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Separator />
                        </>
                      )}

                      {/* Success Indicator */}
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Indicador de Éxito
                        </h3>
                        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                          <p className="text-green-800 dark:text-green-200">{step.successIndicator}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-4">
                        {!completedSteps.has(index) && (
                          <Button 
                            onClick={() => markStepAsCompleted(index)}
                            className="flex-1"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Completado
                          </Button>
                        )}
                        {index < lessonPlan.steps.length - 1 && (
                          <Button 
                            variant="outline"
                            onClick={() => setCurrentStep(index + 1)}
                          >
                            Siguiente Paso
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Resumen del Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Duración Total</p>
                    <p className="font-semibold">{formatDuration(lessonPlan.totalDuration)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total de Pasos</p>
                    <p className="font-semibold">{lessonPlan.totalSteps}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Completados</p>
                    <p className="font-semibold">{completedSteps.size}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pendientes</p>
                    <p className="font-semibold">{lessonPlan.totalSteps - completedSteps.size}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Objetivos de Aprendizaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {lessonPlan.learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Materials Summary */}
            {lessonPlan.materialsNeeded.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Materiales Necesarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lessonPlan.materialsNeeded.map((material, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        <span>{material}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Plan
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Guardar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
