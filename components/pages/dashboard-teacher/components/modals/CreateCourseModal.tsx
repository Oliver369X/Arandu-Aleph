import { useState } from "react"
import { Button } from "@/components/ui/button"
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
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"

interface CreateCourseModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onCreateCourse: (data: any) => Promise<{ success: boolean; error?: string; data?: any }>
  isCreating: boolean
}

export function CreateCourseModal({ isOpen, onOpenChange, onCreateCourse, isCreating }: CreateCourseModalProps) {
  const [newCourseData, setNewCourseData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    difficulty: 'principiante'
  })

  const handleCreateCourse = async () => {
    if (!newCourseData.title.trim()) {
      alert('Por favor ingresa un título para el curso');
      return;
    }

    const result = await onCreateCourse(newCourseData)
    
    if (result.success) {
      // Limpiar form y cerrar modal
      setNewCourseData({
        title: '',
        description: '',
        category: '',
        price: '',
        duration: '',
        difficulty: 'principiante'
      })
      onOpenChange(false)

      // Mostrar notificación detallada con todos los campos guardados
      const responseData = result.data as any;
      const savedFields = [
        `📚 Título: ${responseData?.name || newCourseData.title}`,
        responseData?.description && `📝 Descripción: ${responseData.description}`,
        responseData?.category && `🏷️ Categoría: ${responseData.category}`,
        responseData?.price && `💰 Precio: $${responseData.price}`,
        responseData?.duration && `⏰ Duración: ${responseData.duration}`,
        responseData?.difficulty && `⭐ Dificultad: ${responseData.difficulty}`
      ].filter(Boolean).join('\n');

      alert(`🎉 ¡Curso creado exitosamente!\n\n${savedFields}\n\n✅ Todos los campos se guardaron en la base de datos.`);
    } else {
      alert(`Error creando el curso: ${result.error || 'Error desconocido'}`);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Curso</DialogTitle>
          <DialogDescription>Completa la información para crear tu nuevo curso</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del Curso *</Label>
              <Input 
                id="title" 
                placeholder="Ej: Introducción a Web3" 
                value={newCourseData.title}
                onChange={(e) => setNewCourseData(prev => ({ ...prev, title: e.target.value }))}
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select 
                value={newCourseData.category} 
                onValueChange={(value) => setNewCourseData(prev => ({ ...prev, category: value }))}
                disabled={isCreating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blockchain">Blockchain</SelectItem>
                  <SelectItem value="defi">DeFi</SelectItem>
                  <SelectItem value="nft">NFTs</SelectItem>
                  <SelectItem value="desarrollo">Desarrollo</SelectItem>
                  <SelectItem value="matematicas">Matemáticas</SelectItem>
                  <SelectItem value="ciencias">Ciencias</SelectItem>
                  <SelectItem value="idiomas">Idiomas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea 
              id="description" 
              placeholder="Describe tu curso..."
              value={newCourseData.description}
              onChange={(e) => setNewCourseData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isCreating}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (USD)</Label>
              <Input 
                id="price" 
                type="number" 
                placeholder="150"
                value={newCourseData.price}
                onChange={(e) => setNewCourseData(prev => ({ ...prev, price: e.target.value }))}
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duración</Label>
              <Input 
                id="duration" 
                placeholder="8 semanas"
                value={newCourseData.duration}
                onChange={(e) => setNewCourseData(prev => ({ ...prev, duration: e.target.value }))}
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificultad</Label>
              <Select 
                value={newCourseData.difficulty} 
                onValueChange={(value) => setNewCourseData(prev => ({ ...prev, difficulty: value }))}
                disabled={isCreating}
              >
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
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleCreateCourse} 
            className="bg-secondary hover:bg-secondary/90"
            disabled={isCreating || !newCourseData.title.trim()}
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Crear Curso
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
