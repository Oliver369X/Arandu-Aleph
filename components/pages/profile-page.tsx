"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Mail, Phone, MapPin, Calendar, Award, BookOpen, Users, Camera, Wallet } from "lucide-react"

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Dr. María González",
    email: "maria.gonzalez@arandu.edu",
    phone: "+1 (555) 123-4567",
    location: "Buenos Aires, Argentina",
    bio: "Profesora de Tecnología Blockchain con más de 10 años de experiencia en educación digital y criptomonedas.",
    joinDate: "Enero 2023",
    specialties: ["Blockchain", "Criptomonedas", "Smart Contracts", "DeFi"],
    walletAddress: "0x742d35Cc6634C0532925a3b8D404fddF4f8b8761",
  })

  const stats = [
    { label: "Cursos Creados", value: "12", icon: BookOpen },
    { label: "Estudiantes", value: "1,247", icon: Users },
    { label: "Certificados Emitidos", value: "856", icon: Award },
    { label: "Calificación Promedio", value: "4.9", icon: Award },
  ]

  const achievements = [
    { title: "Educador Destacado", description: "Top 1% de educadores en la plataforma", date: "2024" },
    { title: "Innovador Blockchain", description: "Pionero en educación blockchain", date: "2023" },
    { title: "Mentor Certificado", description: "Certificación en mentoría digital", date: "2023" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Perfil Principal */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="h-24 w-24 mx-auto">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="text-2xl">MG</AvatarFallback>
                    </Avatar>
                    <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <h2 className="text-xl font-bold mt-4">{profileData.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400">Docente Blockchain</p>
                  <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Miembro desde {profileData.joinDate}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Wallet className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="font-mono text-xs">{profileData.walletAddress}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <stat.icon className="h-6 w-6 mx-auto text-arandu-blue mb-2" />
                      <div className="text-2xl font-bold text-arandu-blue">{stat.value}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Logros */}
            <Card>
              <CardHeader>
                <CardTitle>Logros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-arandu-gold mt-1" />
                      <div>
                        <h4 className="font-semibold text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Perfil</TabsTrigger>
                <TabsTrigger value="security">Seguridad</TabsTrigger>
                <TabsTrigger value="preferences">Preferencias</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Información Personal</CardTitle>
                      <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Cancelar" : "Editar"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre Completo</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Ubicación</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          disabled={!isEditing}
                          onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">Biografía</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="wallet">Dirección de Wallet</Label>
                      <Input
                        id="wallet"
                        value={profileData.walletAddress}
                        disabled={!isEditing}
                        onChange={(e) => setProfileData({ ...profileData, walletAddress: e.target.value })}
                        className="font-mono text-sm"
                      />
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <Button className="bg-arandu-blue hover:bg-arandu-blue/90">Guardar Cambios</Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Seguridad</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Cambiar Contraseña</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="current-password">Contraseña Actual</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="new-password">Nueva Contraseña</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div>
                          <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button className="bg-arandu-blue hover:bg-arandu-blue/90">Actualizar Contraseña</Button>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Autenticación de Dos Factores</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">2FA habilitado</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Protege tu cuenta con autenticación de dos factores
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Sesiones Activas</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Navegador actual</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Chrome en Windows • Buenos Aires</p>
                          </div>
                          <Badge variant="secondary">Actual</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Dispositivo móvil</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Safari en iPhone • Hace 2 horas</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Cerrar sesión
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferencias</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Notificaciones</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificaciones por email</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Recibir actualizaciones por correo
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificaciones push</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Notificaciones en el navegador</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Mensajes de estudiantes</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Notificar nuevos mensajes</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Idioma y Región</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="language">Idioma</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option>Español</option>
                            <option>English</option>
                            <option>Português</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="timezone">Zona Horaria</Label>
                          <select className="w-full p-2 border rounded-md">
                            <option>GMT-3 (Buenos Aires)</option>
                            <option>GMT-5 (New York)</option>
                            <option>GMT+0 (London)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="font-semibold mb-4">Privacidad</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Perfil público</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Permitir que otros vean tu perfil
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Mostrar estadísticas</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Mostrar estadísticas en el perfil
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Button className="bg-arandu-blue hover:bg-arandu-blue/90">Guardar Preferencias</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
