"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { aiService } from "@/lib/ai-service"
import { courseService } from "@/lib/course-service"
import type { Quiz, QuizQuestion } from "@/lib/ai-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, ArrowLeft, ArrowRight, CheckCircle, XCircle, Trophy, Target, BookOpen, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds
  const [isLoading, setIsLoading] = useState(true)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [course, setCourse] = useState<any>(null)

  // Obtener el ID del módulo desde los parámetros
  const moduleId = params.id as string

  useEffect(() => {
    if (moduleId && user) {
      loadQuizData()
    }
  }, [moduleId, user])

  useEffect(() => {
    if (quiz && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            submitQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [quiz, showResults])

  const loadQuizData = async () => {
    try {
      setIsLoading(true)
      
      // Generar quiz usando IA
      const quizData = await aiService.generateQuiz(moduleId, 10)
      if (!quizData) {
        toast({
          title: "Error",
          description: "No se pudo generar la evaluación. Inténtalo de nuevo.",
          variant: "destructive",
        })
        return
      }

      setQuiz(quizData)

      // Obtener información del curso
      const courseData = await courseService.getCourseById(moduleId)
      setCourse(courseData)

    } catch (error) {
      console.error('Error loading quiz:', error)
      toast({
        title: "Error",
        description: "Error al cargar la evaluación. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const calculateScore = () => {
    if (!quiz) return 0
    
    let correct = 0
    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id]
      if (question.type === "single") {
        if (userAnswer === question.correctAnswer) correct++
      } else {
        const correctAnswers = question.correctAnswers || []
        const userAnswers = Array.isArray(userAnswer) ? userAnswer : []
        if (correctAnswers.length === userAnswers.length && correctAnswers.every((ans) => userAnswers.includes(ans))) {
          correct++
        }
      }
    })
    return Math.round((correct / quiz.questions.length) * 100)
  }

  const submitQuiz = async () => {
    if (!quiz || !user) return

    const score = calculateScore()
    const passed = score >= quiz.passingScore

    // Guardar progreso en el backend
    try {
      await courseService.updateModuleProgress(moduleId, user.id, passed ? 100 : 0)
      
      toast({
        title: passed ? "¡Felicitaciones!" : "Necesitas mejorar",
        description: passed ? "Has aprobado la evaluación" : "No alcanzaste el puntaje mínimo",
        variant: passed ? "default" : "destructive",
      })
    } catch (error) {
      console.error('Error saving progress:', error)
    }

    setShowResults(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Generando evaluación con IA...</span>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Error al cargar la evaluación</h2>
          <p className="text-muted-foreground mb-4">No se pudo generar la evaluación para este módulo.</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const passed = score >= quiz.passingScore

    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4">
                {passed ? (
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                )}
              </div>
              <CardTitle className="text-2xl">{passed ? "¡Felicitaciones!" : "Necesitas mejorar"}</CardTitle>
              <CardDescription>
                {passed ? "Has aprobado la evaluación exitosamente" : "No alcanzaste el puntaje mínimo requerido"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{score}%</div>
                  <div className="text-sm text-muted-foreground">Tu Puntuación</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-muted-foreground">{quiz.passingScore}%</div>
                  <div className="text-sm text-muted-foreground">Puntaje Mínimo</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {Math.round((Object.keys(answers).length / quiz.questions.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Completado</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Revisión de Respuestas</h3>
                {quiz.questions.map((question, index) => {
                  const userAnswer = answers[question.id]
                  const isCorrect =
                    question.type === "single"
                      ? userAnswer === question.correctAnswer
                      : Array.isArray(userAnswer) &&
                        question.correctAnswers?.length === userAnswer.length &&
                        question.correctAnswers?.every((ans) => userAnswer.includes(ans))

                  return (
                    <div key={question.id} className="text-left p-4 border rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">
                            Pregunta {index + 1}: {question.question}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">{question.explanation}</p>
                          {!isCorrect && (
                            <div className="text-sm">
                              <span className="text-red-600 dark:text-red-400">Tu respuesta: </span>
                              {Array.isArray(userAnswer) ? userAnswer.join(", ") : userAnswer || "Sin respuesta"}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push(`/course/${moduleId}`)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Revisar Material
                </Button>
                {!passed && (
                  <Button onClick={() => window.location.reload()}>
                    <Target className="h-4 w-4 mr-2" />
                    Intentar de Nuevo
                  </Button>
                )}
                <Button variant="outline" onClick={() => router.push(`/course/${moduleId}`)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Curso
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQ = quiz.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" className="flex items-center gap-2" onClick={() => router.push(`/course/${moduleId}`)}>
              <ArrowLeft className="h-4 w-4" />
              Volver al Curso
            </Button>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(timeLeft)}
              </Badge>
              <Badge variant="secondary">
                Generado por IA
              </Badge>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-poppins font-bold text-foreground mb-2">{quiz.title}</h1>
            <p className="text-muted-foreground">
              {course?.title || "Curso"} • Evaluación personalizada por IA
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>
              Pregunta {currentQuestion + 1} de {quiz.questions.length}
            </span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Pregunta {currentQuestion + 1}</CardTitle>
            <CardDescription className="text-base font-medium text-foreground">{currentQ.question}</CardDescription>
          </CardHeader>
          <CardContent>
            {currentQ.type === "single" ? (
              <RadioGroup
                value={(answers[currentQ.id] as string) || ""}
                onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
              >
                <div className="space-y-3">
                  {currentQ.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {currentQ.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${index}`}
                      checked={((answers[currentQ.id] as string[]) || []).includes(option)}
                      onCheckedChange={(checked) => {
                        const currentAnswers = (answers[currentQ.id] as string[]) || []
                        if (checked) {
                          handleAnswerChange(currentQ.id, [...currentAnswers, option])
                        } else {
                          handleAnswerChange(
                            currentQ.id,
                            currentAnswers.filter((a) => a !== option),
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {currentQuestion === quiz.questions.length - 1 ? (
              <Button onClick={submitQuiz} className="bg-primary hover:bg-primary/90">
                Enviar Evaluación
              </Button>
            ) : (
              <Button onClick={() => setCurrentQuestion((prev) => Math.min(quiz.questions.length - 1, prev + 1))}>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Question Overview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Respuestas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {quiz.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "outline"}
                  size="sm"
                  className={`w-10 h-10 p-0 ${
                    answers[quiz.questions[index].id] ? "bg-green-100 dark:bg-green-900 border-green-500" : ""
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
