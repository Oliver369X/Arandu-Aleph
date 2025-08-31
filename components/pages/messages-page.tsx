"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Phone, Video, MoreVertical, Paperclip, Smile } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  isRead: boolean
}

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isOnline: boolean
  type: "student" | "teacher" | "group"
}

export function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string>("1")
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const chats: Chat[] = [
    {
      id: "1",
      name: "Ana García",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Tengo una duda sobre la tarea de blockchain",
      timestamp: "10:30 AM",
      unreadCount: 2,
      isOnline: true,
      type: "student",
    },
    {
      id: "2",
      name: "Carlos Mendoza",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "¿Cuándo es la próxima evaluación?",
      timestamp: "9:15 AM",
      unreadCount: 0,
      isOnline: false,
      type: "student",
    },
    {
      id: "3",
      name: "Grupo: Desarrollo Web",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "María: Excelente explicación profesor",
      timestamp: "Ayer",
      unreadCount: 5,
      isOnline: true,
      type: "group",
    },
  ]

  const messages: Message[] = [
    {
      id: "1",
      senderId: "1",
      senderName: "Ana García",
      senderAvatar: "/placeholder.svg?height=32&width=32",
      content: "Hola profesor, tengo una duda sobre la implementación de smart contracts",
      timestamp: "10:25 AM",
      isRead: true,
    },
    {
      id: "2",
      senderId: "me",
      senderName: "Yo",
      senderAvatar: "/placeholder.svg?height=32&width=32",
      content: "Hola Ana, claro. ¿Qué específicamente te está causando dificultad?",
      timestamp: "10:27 AM",
      isRead: true,
    },
    {
      id: "3",
      senderId: "1",
      senderName: "Ana García",
      senderAvatar: "/placeholder.svg?height=32&width=32",
      content:
        "Tengo una duda sobre la tarea de blockchain, específicamente sobre cómo implementar la función de verificación",
      timestamp: "10:30 AM",
      isRead: false,
    },
  ]

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const selectedChatData = chats.find((chat) => chat.id === selectedChat)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Aquí se enviaría el mensaje
      console.log("Enviando mensaje:", newMessage)
      setNewMessage("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
          {/* Lista de Chats */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-arandu-blue">Mensajes</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar conversaciones..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedChat === chat.id ? "bg-arandu-blue/10 border-r-2 border-arandu-blue" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {chat.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{chat.timestamp}</span>
                            {chat.unreadCount > 0 && (
                              <Badge className="bg-arandu-green text-white text-xs px-2 py-1">{chat.unreadCount}</Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">{chat.lastMessage}</p>
                        <div className="flex items-center mt-2">
                          <Badge variant="outline" className="text-xs">
                            {chat.type === "student" ? "Estudiante" : chat.type === "teacher" ? "Docente" : "Grupo"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Activo */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedChatData ? (
              <>
                {/* Header del Chat */}
                <CardHeader className="pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={selectedChatData.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{selectedChatData.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {selectedChatData.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{selectedChatData.name}</h3>
                        <p className="text-sm text-gray-500">
                          {selectedChatData.isOnline ? "En línea" : "Desconectado"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Mensajes */}
                <CardContent className="flex-1 p-4 overflow-y-auto max-h-[calc(100vh-20rem)]">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start space-x-2 max-w-[70%] ${
                            message.senderId === "me" ? "flex-row-reverse space-x-reverse" : ""
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
                            <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div
                            className={`rounded-lg p-3 ${
                              message.senderId === "me"
                                ? "bg-arandu-blue text-white"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.senderId === "me" ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                {/* Input de Mensaje */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        className="pr-10"
                      />
                      <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={handleSendMessage} className="bg-arandu-blue hover:bg-arandu-blue/90">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                    Selecciona una conversación
                  </h3>
                  <p className="text-sm text-gray-500 mt-2">Elige un chat de la lista para comenzar a conversar</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
