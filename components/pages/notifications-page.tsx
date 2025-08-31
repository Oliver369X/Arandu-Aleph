"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, MessageSquare, Award, BookOpen, Settings, Check, Trash2 } from "lucide-react"

interface Notification {
  id: string
  type: "message" | "achievement" | "course" | "system"
  title: string
  description: string
  timestamp: string
  isRead: boolean
  priority: "high" | "medium" | "low"
  actionUrl?: string
}

export function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "message",
      title: "Nuevo mensaje de Ana García",
      description: "Tengo una duda sobre la implementación de smart contracts...",
      timestamp: "5 minutos",
      isRead: false,
      priority: "high",
    },
    {
      id: "2",
      type: "achievement",
      title: "Certificado generado",
      description: 'Tu certificado de "Blockchain Fundamentals" está listo para descargar',
      timestamp: "1 hora",
      isRead: false,
      priority: "medium",
    },
    {
      id: "3",
      type: "course",
      title: "Nueva evaluación disponible",
      description: 'La evaluación del módulo 3 de "Smart Contracts" ya está disponible',
      timestamp: "2 horas",
      isRead: true,
      priority: "medium",
    },
    {
      id: "4",
      type: "system",
      title: "Actualización de la plataforma",
      description: "Hemos agregado nuevas funcionalidades de IA para mejorar tu experiencia",
      timestamp: "1 día",
      isRead: true,
      priority: "low",
    },
    {
      id: "5",
      type: "message",
      title: "Respuesta del instructor",
      description: "El profesor Carlos respondió a tu pregunta en el foro",
      timestamp: "2 días",
      isRead: false,
      priority: "medium",
    },
  ])

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return MessageSquare
      case "achievement":
        return Award
      case "course":
        return BookOpen
      case "system":
        return Settings
      default:
        return Bell
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.isRead
    if (filter === "read") return notification.isRead
    return true
  })

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-arandu-blue">Notificaciones</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Mantente al día con todas tus actividades</p>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button onClick={markAllAsRead} variant="outline" size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  Marcar todas como leídas
                </Button>
              )}
              <Badge variant="secondary" className="text-sm">
                {unreadCount} sin leer
              </Badge>
            </div>
          </div>

          <Tabs value={filter} onValueChange={(value) => setFilter(value as any)} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todas ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">Sin leer ({unreadCount})</TabsTrigger>
              <TabsTrigger value="read">Leídas ({notifications.length - unreadCount})</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">No hay notificaciones</h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {filter === "unread"
                        ? "Todas tus notificaciones están marcadas como leídas"
                        : "No tienes notificaciones en este momento"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => {
                  const IconComponent = getIcon(notification.type)
                  return (
                    <Card
                      key={notification.id}
                      className={`transition-all hover:shadow-md ${
                        !notification.isRead ? "border-l-4 border-l-arandu-blue bg-blue-50/50 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <div className="relative">
                            <div
                              className={`p-2 rounded-full ${
                                notification.type === "message"
                                  ? "bg-blue-100 dark:bg-blue-900"
                                  : notification.type === "achievement"
                                    ? "bg-yellow-100 dark:bg-yellow-900"
                                    : notification.type === "course"
                                      ? "bg-green-100 dark:bg-green-900"
                                      : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              <IconComponent
                                className={`h-5 w-5 ${
                                  notification.type === "message"
                                    ? "text-blue-600 dark:text-blue-400"
                                    : notification.type === "achievement"
                                      ? "text-yellow-600 dark:text-yellow-400"
                                      : notification.type === "course"
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-gray-600 dark:text-gray-400"
                                }`}
                              />
                            </div>
                            <div
                              className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${getPriorityColor(notification.priority)}`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3
                                  className={`font-semibold ${!notification.isRead ? "text-arandu-blue" : "text-gray-900 dark:text-gray-100"}`}
                                >
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {notification.description}
                                </p>
                                <div className="flex items-center mt-2 space-x-2">
                                  <span className="text-xs text-gray-500">Hace {notification.timestamp}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {notification.type === "message"
                                      ? "Mensaje"
                                      : notification.type === "achievement"
                                        ? "Logro"
                                        : notification.type === "course"
                                          ? "Curso"
                                          : "Sistema"}
                                  </Badge>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 ml-4">
                                {!notification.isRead && (
                                  <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
