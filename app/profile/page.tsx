"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { apiService } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Globe, 
  Edit, 
  Save, 
  X, 
  Camera,
  Shield,
  Key,
  Bell,
  Settings,
  BookOpen,
  Trophy,
  Clock,
  Target
} from "lucide-react"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: "",
    phone: "",
    website: ""
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: "",
        phone: "",
        website: ""
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      setIsLoading(true)
      console.log('🔍 [ProfilePage] Guardando perfil...')
      
      const result = await updateUser({
        name: formData.name,
        bio: formData.bio
      })

      if (result.success) {
        console.log('✅ [ProfilePage] Perfil actualizado exitosamente')
        setIsEditing(false)
        alert('Perfil actualizado exitosamente')
      } else {
        console.log('❌ [ProfilePage] Error al actualizar perfil:', result.error)
        alert('Error al actualizar el perfil')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      location: "",
      phone: "",
      website: ""
    })
    setIsEditing(false)
  }

  const handleChangePassword = () => {
    console.log('🔍 [ProfilePage] Cambiando contraseña...')
    alert('Función de cambio de contraseña en desarrollo')
  }

  const handleViewCertificates = () => {
    console.log('🔍 [ProfilePage] Viendo certificados...')
    window.location.href = '/certificates'
  }

  const handleViewProgress = () => {
    console.log('🔍 [ProfilePage] Viendo progreso...')
    window.location.href = '/progress'
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Usuario no encontrado</h3>
          <p className="text-muted-foreground">Inicia sesión para ver tu perfil</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">Gestiona tu información personal y preferencias</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
          </TabsList>

          {/* Perfil Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Actualiza tu información personal</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm" disabled={isLoading}>
                        <Save className="h-4 w-4 mr-2" />
                        {isLoading ? "Guardando..." : "Guardar"}
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name?.split(" ").map(n => n[0]).join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    {!isEditing && (
                      <Button variant="outline" size="sm" className="mt-2">
                        <Camera className="h-4 w-4 mr-2" />
                        Cambiar Foto
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      placeholder="tu@email.com"
                    />
                    <p className="text-xs text-muted-foreground">El email no se puede cambiar</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Ciudad, País"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="+1 234 567 890"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Cuéntanos sobre ti..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Accede rápidamente a funciones importantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" onClick={handleViewCertificates} className="h-auto p-4 flex flex-col items-center">
                    <Trophy className="h-8 w-8 mb-2" />
                    <span>Ver Certificados</span>
                  </Button>
                  <Button variant="outline" onClick={handleViewProgress} className="h-auto p-4 flex flex-col items-center">
                    <Target className="h-8 w-8 mb-2" />
                    <span>Mi Progreso</span>
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/courses'} className="h-auto p-4 flex flex-col items-center">
                    <BookOpen className="h-8 w-8 mb-2" />
                    <span>Explorar Cursos</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seguridad Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad de la Cuenta</CardTitle>
                <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Key className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Contraseña</h4>
                      <p className="text-sm text-muted-foreground">Última actualización: hace 30 días</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleChangePassword}>
                    Cambiar
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Autenticación de dos factores</h4>
                      <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferencias Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificaciones</CardTitle>
                <CardDescription>Configura cómo quieres recibir las notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">Notificaciones por email</h4>
                      <p className="text-sm text-muted-foreground">Recibe actualizaciones por email</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actividad Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividad Reciente</CardTitle>
                <CardDescription>Tu actividad en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Completaste una lección</p>
                      <p className="text-sm text-muted-foreground">Hace 2 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <div className="flex-1">
                      <p className="font-medium">Obtuviste un certificado</p>
                      <p className="text-sm text-muted-foreground">Hace 1 día</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Target className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">Alcanzaste tu meta semanal</p>
                      <p className="text-sm text-muted-foreground">Hace 3 días</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
