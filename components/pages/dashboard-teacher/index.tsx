"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Bell, Settings, Plus } from "lucide-react"

// Componentes de los tabs
import { OverviewTab } from "./components/OverviewTab"
import { CoursesTab } from "./components/CoursesTab"
import { StudentsTab } from "./components/StudentsTab"
import { ContentTab } from "./components/ContentTab"
import { AnalyticsTab } from "./components/AnalyticsTab"

// Modales
import { CreateCourseModal } from "./components/modals/CreateCourseModal"

// Hook personalizado
import { useTeacherDashboard } from "./hooks/useTeacherDashboard"

export function TeacherDashboard() {
  console.log('🚨 [TeacherDashboard] COMPONENTE CARGADO');
  
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
  
  const {
    user,
    isLoading,
    courses,
    students,
    courseContent,
    recentActivity,
    statistics,
    aiGames,
    aiFeedbacks,
    handleCreateCourse,
    handleCreateContent,
    handleGenerateAIGame,
    handleGenerateAIFeedback,
    isCreatingCourse,
    isCreatingContent,
    isGeneratingGame,
    isGeneratingFeedback,
    generatingGameId,
    generatingFeedbackId
  } = useTeacherDashboard()

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
          <h2 className="text-xl font-semibold">Cargando Dashboard del Docente</h2>
          <p className="text-muted-foreground">Conectando con el backend...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-poppins font-bold text-primary">Dashboard Docente</h1>
              <div className="flex items-center gap-3">
                <p className="text-muted-foreground">Bienvenido, {user?.name}</p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">Backend Conectado</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Contexto Educativo</span>
                  </div>
                </div>
              </div>
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
              <Button 
                size="sm" 
                className="bg-secondary hover:bg-secondary/90"
                onClick={() => setIsCreateCourseOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Curso
              </Button>
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

          <TabsContent value="overview">
            <OverviewTab
              statistics={statistics}
              recentActivity={recentActivity}
              courses={courses}
            />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesTab
              courses={courses}
              onCreateCourse={() => setIsCreateCourseOpen(true)}
            />
          </TabsContent>

          <TabsContent value="students">
            <StudentsTab
              students={students}
              courses={courses}
            />
          </TabsContent>

          <TabsContent value="content">
            <ContentTab
              courseContent={courseContent}
              courses={courses}
              aiGames={aiGames}
              aiFeedbacks={aiFeedbacks}
              onCreateContent={handleCreateContent}
              onGenerateAIGame={handleGenerateAIGame}
              onGenerateAIFeedback={handleGenerateAIFeedback}
              isCreatingContent={isCreatingContent}
              isGeneratingGame={isGeneratingGame}
              isGeneratingFeedback={isGeneratingFeedback}
              generatingGameId={generatingGameId}
              generatingFeedbackId={generatingFeedbackId}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab
              students={students}
              courses={courses}
              aiGames={aiGames}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modales */}
      <CreateCourseModal
        isOpen={isCreateCourseOpen}
        onOpenChange={setIsCreateCourseOpen}
        onCreateCourse={handleCreateCourse}
        isCreating={isCreatingCourse}
      />
    </div>
  )
}
