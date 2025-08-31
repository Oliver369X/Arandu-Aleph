import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Plus,
  Video,
  FileText,
  Award,
  Upload,
  Edit,
  Eye,
  Trash2
} from "lucide-react"
import type { Course } from "@/lib/data-adapter"

interface ContentTabProps {
  courseContent: any[]
  courses: Course[]
  aiGames: any[]
  aiFeedbacks: any[]
  onCreateContent: (data: any) => Promise<{ success: boolean }>
  onGenerateAIGame: (subtopicId: string, subtopicTitle: string) => Promise<void>
  onGenerateAIFeedback: (subtopicId: string, subtopicTitle: string) => Promise<void>
  isCreatingContent: boolean
  isGeneratingGame: boolean
  isGeneratingFeedback: boolean
  generatingGameId: string | null
  generatingFeedbackId: string | null
}

export function ContentTab({
  courseContent,
  courses,
  aiGames,
  aiFeedbacks,
  onCreateContent,
  onGenerateAIGame,
  onGenerateAIFeedback,
  isCreatingContent,
  isGeneratingGame,
  isGeneratingFeedback,
  generatingGameId,
  generatingFeedbackId
}: ContentTabProps) {
  const [isCreateContentOpen, setIsCreateContentOpen] = useState(false)
  const [newContentData, setNewContentData] = useState({
    courseId: '',
    title: '',
    description: '',
    type: 'video'
  })

  const handleCreateContent = async () => {
    const result = await onCreateContent(newContentData)
    if (result.success) {
      setNewContentData({
        courseId: '',
        title: '',
        description: '',
        type: 'video'
      })
      setIsCreateContentOpen(false)
      alert('¡Módulo creado exitosamente! 🎉')
    }
  }

  return (
    <div className="space-y-6">
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
                <Label htmlFor="content-course">Curso *</Label>
                <Select 
                  value={newContentData.courseId} 
                  onValueChange={(value) => setNewContentData(prev => ({ ...prev, courseId: value }))}
                  disabled={isCreatingContent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title || (course as any).name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-type">Tipo de Contenido</Label>
                <Select 
                  value={newContentData.type} 
                  onValueChange={(value) => setNewContentData(prev => ({ ...prev, type: value }))}
                  disabled={isCreatingContent}
                >
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
                <Label htmlFor="content-title">Título *</Label>
                <Input 
                  id="content-title" 
                  placeholder="Título del módulo/contenido"
                  value={newContentData.title}
                  onChange={(e) => setNewContentData(prev => ({ ...prev, title: e.target.value }))}
                  disabled={isCreatingContent}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-description">Descripción</Label>
                <Textarea 
                  id="content-description" 
                  placeholder="Describe el módulo..."
                  value={newContentData.description}
                  onChange={(e) => setNewContentData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={isCreatingContent}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateContentOpen(false)}
                disabled={isCreatingContent}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateContent} 
                className="bg-secondary hover:bg-secondary/90"
                disabled={isCreatingContent || !newContentData.title.trim() || !newContentData.courseId}
              >
                {isCreatingContent ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Módulo
                  </>
                )}
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
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onGenerateAIGame(content.id, content.title)}
                      title="Generar juego AI para este módulo"
                      disabled={isGeneratingGame}
                    >
                      {generatingGameId === content.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      ) : (
                        <span className="text-purple-600">🎮</span>
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onGenerateAIFeedback(content.id, content.title)}
                      title="Generar plan de lección AI para este módulo"
                      disabled={isGeneratingFeedback}
                    >
                      {generatingFeedbackId === content.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      ) : (
                        <span className="text-blue-600">📚</span>
                      )}
                    </Button>
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

        <div className="space-y-6">
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

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-poppins flex items-center gap-2">
                  🎮 Juegos AI Generados
                </CardTitle>
                <Badge variant="outline">{aiGames.length}</Badge>
              </div>
              <CardDescription>
                Juegos educativos generados automáticamente con IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiGames.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-sm">No hay juegos generados aún</p>
                  <p className="text-xs mt-1">Usa el botón 🎮 en los módulos para generar juegos</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {aiGames.map((game) => (
                    <div 
                      key={game.id} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{game.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          📚 {game.subtopicTitle} • 
                          🎲 {game.gameType} • 
                          ⭐ {game.difficulty}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          🎯 {game.playCount} jugadas • 
                          📅 {new Date(game.createdAt).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(`/game/${game.id}`, '_blank')}
                          title="Jugar este juego"
                        >
                          ▶️
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          title="Ver detalles del juego"
                        >
                          👁️
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Feedback Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-poppins flex items-center gap-2">
                  📚 Planes de Lección AI Generados
                </CardTitle>
                <Badge variant="outline">{aiFeedbacks.length}</Badge>
              </div>
              <CardDescription>
                Planes de lección educativos generados automáticamente con IA
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiFeedbacks.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <div className="text-4xl mb-2">📖</div>
                  <p className="text-sm">No hay planes de lección generados aún</p>
                  <p className="text-xs mt-1">Usa el botón 📚 en los módulos para generar planes</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {aiFeedbacks.map((feedback: any) => (
                    <div key={feedback.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{feedback.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {feedback.subtopicTitle}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {feedback.feedbackType}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              ⏱️ {feedback.estimatedTime} min
                            </span>
                            <span className="text-xs text-muted-foreground">
                              📊 {feedback.difficultyLevel}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              alert(`📚 ${feedback.title}\n\n📝 Contenido:\n${feedback.content.replace(/<[^>]*>/g, '').substring(0, 200)}...\n\n🎯 Recomendaciones:\n${(feedback.recommendations || []).join('\n')}`);
                            }}
                            title="Ver plan de lección"
                          >
                            📖
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            title="Ver detalles del plan"
                          >
                            👁️
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
