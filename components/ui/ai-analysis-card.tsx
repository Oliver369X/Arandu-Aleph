"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Target, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  BookOpen,
  Users,
  Clock
} from "lucide-react"

interface AIAnalysis {
  strengths: string[]
  weaknesses: string[]
  recommendations: string[]
  nextSteps: string[]
  learningStyle?: string
  estimatedCompletionTime?: number
  difficultyLevel?: string
}

interface AIAnalysisCardProps {
  analysis: AIAnalysis
  title?: string
  description?: string
  showDetails?: boolean
  className?: string
}

export function AIAnalysisCard({ 
  analysis, 
  title = "Análisis de IA", 
  description = "Recomendaciones personalizadas basadas en tu progreso",
  showDetails = false,
  className = ""
}: AIAnalysisCardProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails)

  const getDifficultyColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900'
      default: return 'text-blue-600 bg-blue-100 dark:bg-blue-900'
    }
  }

  const getLearningStyleIcon = (style?: string) => {
    switch (style?.toLowerCase()) {
      case 'visual': return <BookOpen className="h-4 w-4" />
      case 'auditory': return <Users className="h-4 w-4" />
      case 'kinesthetic': return <Target className="h-4 w-4" />
      default: return <Brain className="h-4 w-4" />
    }
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analysis.strengths.length}</div>
            <div className="text-xs text-green-600">Fortalezas</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{analysis.weaknesses.length}</div>
            <div className="text-xs text-orange-600">Mejoras</div>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analysis.recommendations.length}</div>
            <div className="text-xs text-blue-600">Recomendaciones</div>
          </div>
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{analysis.nextSteps.length}</div>
            <div className="text-xs text-purple-600">Próximos Pasos</div>
          </div>
        </div>

        {/* Learning Profile */}
        {(analysis.learningStyle || analysis.difficultyLevel || analysis.estimatedCompletionTime) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            {analysis.learningStyle && (
              <div className="flex items-center gap-2">
                {getLearningStyleIcon(analysis.learningStyle)}
                <div>
                  <div className="text-sm font-medium">Estilo de Aprendizaje</div>
                  <div className="text-xs text-muted-foreground capitalize">{analysis.learningStyle}</div>
                </div>
              </div>
            )}
            {analysis.difficultyLevel && (
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Nivel de Dificultad</div>
                  <Badge variant="outline" className={`text-xs ${getDifficultyColor(analysis.difficultyLevel)}`}>
                    {analysis.difficultyLevel}
                  </Badge>
                </div>
              </div>
            )}
            {analysis.estimatedCompletionTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <div>
                  <div className="text-sm font-medium">Tiempo Estimado</div>
                  <div className="text-xs text-muted-foreground">{analysis.estimatedCompletionTime} horas</div>
                </div>
              </div>
            )}
          </div>
        )}

        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <h4 className="font-semibold text-green-600">Fortalezas</h4>
                </div>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-green-700 dark:text-green-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {analysis.weaknesses.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <h4 className="font-semibold text-orange-600">Áreas de Mejora</h4>
                </div>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-orange-700 dark:text-orange-300">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <h4 className="font-semibold text-blue-600">Recomendaciones</h4>
                </div>
                <ul className="space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-blue-700 dark:text-blue-300">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            {analysis.nextSteps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-purple-600" />
                  <h4 className="font-semibold text-purple-600">Próximos Pasos</h4>
                </div>
                <ul className="space-y-2">
                  {analysis.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-purple-700 dark:text-purple-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AI Insights */}
            <div className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">Insights de IA</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Basado en tu patrón de aprendizaje y progreso, la IA ha identificado las mejores estrategias 
                para optimizar tu experiencia educativa. Sigue estas recomendaciones para maximizar tu rendimiento.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
