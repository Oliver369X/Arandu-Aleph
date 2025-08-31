"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AIGame, GameGenerationRequest, apiService } from '@/lib/api'
import { toast } from '@/hooks/use-toast'
import { 
  Sparkles, 
  Loader2, 
  Brain, 
  Zap, 
  Target,
  BookOpen,
  Gamepad2,
  Puzzle,
  Star,
  RefreshCw,
  Play,
  Settings,
  Lightbulb
} from 'lucide-react'

interface GameGeneratorProps {
  subtopicId: string;
  onGameGenerated?: (game: AIGame) => void;
  className?: string;
}

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

const gameTypeOptions = [
  { 
    value: 'adaptive', 
    label: '🧠 Automático (IA decide)', 
    description: 'La IA analiza el tema y selecciona el mejor tipo de juego',
    icon: Brain,
    recommended: true
  },
  { 
    value: 'quiz', 
    label: '❓ Quiz Interactivo', 
    description: 'Preguntas de opción múltiple con retroalimentación',
    icon: Target
  },
  { 
    value: 'wordsearch', 
    label: '🔤 Sopa de Letras', 
    description: 'Encuentra palabras relacionadas con el tema',
    icon: BookOpen
  },
  { 
    value: 'memory', 
    label: '🧠 Juego de Memoria', 
    description: 'Emparejar conceptos con sus definiciones',
    icon: Zap
  },
  { 
    value: 'puzzle', 
    label: '🧩 Rompecabezas', 
    description: 'Puzzle deslizante con elementos del tema',
    icon: Puzzle
  },
  { 
    value: 'matching', 
    label: '🔗 Emparejar Conceptos', 
    description: 'Conectar términos con sus definiciones',
    icon: Gamepad2
  },
  { 
    value: 'threejs', 
    label: '🎯 Experiencia 3D', 
    description: 'Visualización interactiva en 3D (avanzado)',
    icon: Star
  },
  { 
    value: 'pixijs', 
    label: '🎨 Juego 2D Interactivo', 
    description: 'Experiencia visual 2D con partículas (avanzado)',
    icon: Star
  }
];

export function GameGenerator({ 
  subtopicId, 
  onGameGenerated, 
  className = "" 
}: GameGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGame, setGeneratedGame] = useState<AIGame | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [formData, setFormData] = useState<GameGenerationRequest>({
    gameType: 'adaptive',
    difficulty: 'medium',
    language: 'es',
    customPrompt: '',
    focus: '',
    targetAge: ''
  });

  const generationSteps: GenerationStep[] = [
    {
      id: 'analyze',
      title: 'Analizando tema',
      description: 'La IA está analizando el contenido educativo',
      completed: false,
      current: false
    },
    {
      id: 'select',
      title: 'Seleccionando tipo de juego',
      description: 'Determinando el mejor tipo de juego para el tema',
      completed: false,
      current: false
    },
    {
      id: 'generate',
      title: 'Generando contenido',
      description: 'Creando el juego personalizado',
      completed: false,
      current: false
    },
    {
      id: 'finalize',
      title: 'Finalizando',
      description: 'Preparando el juego para jugar',
      completed: false,
      current: false
    }
  ];

  const [steps, setSteps] = useState(generationSteps);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedGame(null);
    setCurrentStep(0);
    
    // Resetear pasos
    setSteps(generationSteps.map(step => ({ ...step, completed: false, current: false })));

    try {
      // Simular progreso de pasos
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          current: index === i,
          completed: index < i
        })));
        
        // Delay para mostrar progreso
        if (i < steps.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Generar el juego
      const response = await apiService.generateAIGame(subtopicId, formData);
      
      if (response.success && response.data) {
        const newGame = response.data.game;
        setGeneratedGame(newGame);
        
        // Completar todos los pasos
        setSteps(prev => prev.map(step => ({ ...step, completed: true, current: false })));
        
        toast({
          title: "🎮 ¡Juego generado exitosamente!",
          description: `${newGame.title} está listo para jugar`,
        });
        
        onGameGenerated?.(newGame);
      } else {
        throw new Error(response.error || 'Error desconocido');
      }
    } catch (error: any) {
      console.error('Error generando juego:', error);
      
      toast({
        title: "Error al generar juego",
        description: error.message || 'Ocurrió un error inesperado',
        variant: "destructive"
      });
      
      // Resetear pasos en caso de error
      setSteps(generationSteps.map(step => ({ ...step, completed: false, current: false })));
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayGenerated = () => {
    if (generatedGame) {
      // Esto debería abrir el GamePlayer
      // Por ahora solo mostramos un toast
      toast({
        title: "🎮 Abriendo juego",
        description: "El juego se abrirá en una nueva ventana",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      gameType: 'adaptive',
      difficulty: 'medium',
      language: 'es',
      customPrompt: '',
      focus: '',
      targetAge: ''
    });
    setGeneratedGame(null);
    setSteps(generationSteps.map(step => ({ ...step, completed: false, current: false })));
  };

  const selectedGameType = gameTypeOptions.find(option => option.value === formData.gameType);

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Generar Juego Educativo con IA
          </CardTitle>
          <CardDescription>
            Crea un juego personalizado para este tema usando inteligencia artificial
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Selección de tipo de juego */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tipo de Juego</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gameTypeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.gameType === option.value;
                
                return (
                  <div
                    key={option.value}
                    className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, gameType: option.value }))}
                  >
                    {option.recommended && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500">
                        Recomendado
                      </Badge>
                    )}
                    
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{option.label}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Configuración básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dificultad</Label>
              <RadioGroup 
                value={formData.difficulty} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, difficulty: value }))}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="easy" />
                  <Label htmlFor="easy" className="text-sm">🟢 Fácil</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="text-sm">🟡 Medio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="hard" />
                  <Label htmlFor="hard" className="text-sm">🔴 Difícil</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Idioma</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="es">🇪🇸 Español</SelectItem>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Configuración avanzada */}
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Configuración Avanzada
              <span className="text-xs text-muted-foreground">
                {showAdvanced ? '(ocultar)' : '(opcional)'}
              </span>
            </Button>

            {showAdvanced && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <div className="space-y-2">
                  <Label>Prompt Personalizado</Label>
                  <Textarea
                    placeholder="Ej: Crear un juego que enfatice los aspectos prácticos del tema..."
                    value={formData.customPrompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, customPrompt: e.target.value }))}
                    className="min-h-[80px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Instrucciones específicas para personalizar el juego
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Enfoque Específico</Label>
                    <Textarea
                      placeholder="Ej: Conceptos básicos, aplicaciones prácticas..."
                      value={formData.focus}
                      onChange={(e) => setFormData(prev => ({ ...prev, focus: e.target.value }))}
                      className="min-h-[60px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Edad Objetivo</Label>
                    <Textarea
                      placeholder="Ej: 18-25 años, estudiantes universitarios..."
                      value={formData.targetAge}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAge: e.target.value }))}
                      className="min-h-[60px]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progreso de generación */}
          {isGenerating && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="font-medium">Generando juego...</span>
                  </div>
                  
                  <Progress value={(currentStep + 1) / steps.length * 100} className="h-2" />
                  
                  <div className="space-y-2">
                    {steps.map((step, index) => (
                      <div 
                        key={step.id}
                        className={`flex items-center gap-3 text-sm ${
                          step.completed ? 'text-green-600' : 
                          step.current ? 'text-primary' : 
                          'text-muted-foreground'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          step.completed ? 'bg-green-500' :
                          step.current ? 'bg-primary animate-pulse' :
                          'bg-muted-foreground/30'
                        }`} />
                        <span className="font-medium">{step.title}</span>
                        <span className="text-xs">- {step.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Juego generado */}
          {generatedGame && (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">¡Juego generado exitosamente!</h4>
                      <p className="text-sm text-green-600">{generatedGame.title}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tipo:</span>
                      <p className="font-medium">{gameTypeOptions.find(o => o.value === generatedGame.gameType)?.label}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Dificultad:</span>
                      <p className="font-medium">{generatedGame.difficulty}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tiempo estimado:</span>
                      <p className="font-medium">{generatedGame.estimatedTime} min</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Agente:</span>
                      <p className="font-medium">{generatedGame.agentType}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {generatedGame.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button onClick={handlePlayGenerated} className="flex-1">
                      <Play className="w-4 h-4 mr-2" />
                      Jugar Ahora
                    </Button>
                    <Button variant="outline" onClick={resetForm}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generar Otro
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          {!generatedGame && (
            <div className="flex gap-2">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="flex-1"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generar Juego
                  </>
                )}
              </Button>
              
              <Button variant="outline" onClick={resetForm} size="lg">
                <RefreshCw className="w-4 h-4 mr-2" />
                Limpiar
              </Button>
            </div>
          )}

          {/* Información adicional */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">💡 Consejos para mejores resultados:</p>
              <ul className="text-blue-700 space-y-1 text-xs">
                <li>• El modo "Automático" analiza el tema y selecciona el mejor tipo de juego</li>
                <li>• Usa prompts específicos para personalizar el contenido</li>
                <li>• Los juegos 3D y 2D son más complejos pero más interactivos</li>
                <li>• La dificultad afecta la complejidad del contenido y mecánicas</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
