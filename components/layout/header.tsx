"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Brain, Menu, X, Moon, Sun, User, LogOut, Bell, MessageSquare, Shield } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { determineUserRole } from "@/lib/roles"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const navItems = [
    { id: "home", label: "Inicio", href: "/" },
    { id: "courses", label: "Cursos", href: "/courses" },
    { id: "certificates", label: "Certificaciones", href: "/certificates" },
    { id: "blockchain", label: "Blockchain", href: "/blockchain" },
    { id: "community", label: "Comunidad", href: "/community" },
  ]

  const notifications = [
    { id: 1, title: "Nuevo mensaje de Ana García", time: "5 min", unread: true },
    { id: 2, title: "Evaluación completada", time: "1 hora", unread: true },
    { id: 3, title: "Certificado generado", time: "2 horas", unread: false },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/arandu-logo.png"
                  alt="ARANDU Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                  fallback={
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Brain className="w-6 h-6 text-primary-foreground" />
                    </div>
                  }
                />
              </div>
              <span className="text-2xl font-poppins font-bold text-primary">ARANDU</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {user && (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 hover:bg-red-500">
                          {unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end">
                    <div className="p-2 font-semibold">Notificaciones</div>
                    <DropdownMenuSeparator />
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-3">
                        <div className="flex items-start space-x-2 w-full">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? "bg-blue-500" : "bg-gray-300"}`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <Link href="/notifications">
                      <DropdownMenuItem className="text-center text-sm text-primary">
                        Ver todas las notificaciones
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Link href="/messages">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href={
                    user.roles && user.roles.includes("teacher") 
                      ? "/dashboard/teacher" 
                      : user.roles && user.roles.includes("admin")
                      ? "/admin"
                      : "/dashboard/student"
                  }>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  {(determineUserRole(user) === "admin" || determineUserRole(user) === "teacher") && (
                    <Link href="/admin">
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        Panel de Administración
                      </DropdownMenuItem>
                    </Link>
                  )}
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/messages">
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Mensajes
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Iniciar Sesión</Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="bg-primary hover:bg-primary/90">Registrarse</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-left text-sm font-medium transition-colors ${
                    pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="justify-start"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="mr-2 h-4 w-4" />
                      Modo Claro
                    </>
                  ) : (
                    <>
                      <Moon className="mr-2 h-4 w-4" />
                      Modo Oscuro
                    </>
                  )}
                </Button>

                {user ? (
                  <>
                    <Link href={
                      user.roles && user.roles.includes("teacher") 
                        ? "/dashboard/teacher" 
                        : user.roles && user.roles.includes("admin")
                        ? "/admin"
                        : "/dashboard/student"
                    }>
                      <Button
                        variant="outline"
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full justify-start"
                      >
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="ghost" onClick={() => setMobileMenuOpen(false)} className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </Button>
                    </Link>
                    <Link href="/messages">
                      <Button variant="ghost" onClick={() => setMobileMenuOpen(false)} className="w-full justify-start">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Mensajes
                        {unreadCount > 0 && (
                          <Badge className="ml-auto h-5 w-5 p-0 text-xs bg-red-500">{unreadCount}</Badge>
                        )}
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                      className="w-full justify-start"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login">
                      <Button variant="outline" onClick={() => setMobileMenuOpen(false)} className="w-full">
                        Iniciar Sesión
                      </Button>
                    </Link>
                    <Link href="/auth/register">
                      <Button
                        onClick={() => setMobileMenuOpen(false)}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        Registrarse
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
