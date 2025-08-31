"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, User, Wallet } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"


export function LoginPage() {
  const { login, loginWithWallet, isLoading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔍 [LoginPage] Formulario enviado, iniciando login...');
    console.log('🔍 [LoginPage] Datos del formulario:', { email, password: '***' });
    setError("")

    const result = await login(email, password)
    console.log('🔍 [LoginPage] Resultado del login:', result);
    
    if (result.success) {
      console.log('✅ [LoginPage] Login exitoso, redirigiendo...');
      
      // Obtener el usuario actual para determinar el rol
      const currentUser = await apiService.getCurrentUser();
      console.log('🔍 [LoginPage] Usuario actual:', currentUser);
      
      if (currentUser.success && currentUser.data && currentUser.data.roles && currentUser.data.roles.length > 0) {
        const userRoles = currentUser.data.roles;
        console.log('🔍 [LoginPage] Roles del usuario desde login:', userRoles);
        
        // Determinar el rol principal (tomar el primero si hay múltiples)
        const primaryRole = userRoles[0].toLowerCase();
        console.log('🔍 [LoginPage] Rol principal:', primaryRole);
        
        // Mapeo dinámico basado en el rol del usuario
        let dashboardRoute = '/dashboard/student'; // Por defecto
        
        if (primaryRole === 'teacher') {
          dashboardRoute = '/dashboard/teacher';
        } else if (primaryRole === 'admin') {
          dashboardRoute = '/admin';
        } else if (primaryRole === 'institution') {
          dashboardRoute = '/admin'; // O la ruta específica para instituciones
        }
        
        console.log(`🎯 [LoginPage] Rol del usuario: ${primaryRole}, redirigiendo a: ${dashboardRoute}`);
        console.log('🚨 [LoginPage] REDIRECCIÓN DE LOGIN A:', dashboardRoute);
        
        // Redirección usando window.location para forzar la navegación
        console.log('🔄 [LoginPage] Usando window.location.href para redirección forzada');
        window.location.href = dashboardRoute;
      } else {
        // Fallback: redirigir a dashboard de estudiante por defecto
        console.log('👨‍🎓 [LoginPage] No se encontraron roles, redirigiendo a dashboard de estudiante por defecto');
        router.push("/dashboard/student");
      }
    } else {
      console.log('❌ [LoginPage] Login falló:', result.error);
      setError(result.error || "Error al iniciar sesión")
    }
  }

  const handleWalletLogin = async () => {
    const result = await loginWithWallet("0x123...", "signature")
    if (result.success) {
      router.push("/dashboard/teacher")
    } else {
      setError(result.error || "Error al conectar wallet")
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-poppins text-2xl">Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu cuenta de ARANDU</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="wallet">Wallet</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="text-red-500 text-sm">{error}</div>}
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                    <Mail className="mr-2 w-4 h-4" />
                    {isLoading ? "Entrando..." : "Entrar con Email"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="wallet" className="space-y-4">
                <div className="text-center py-8">
                  <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Conecta tu wallet para acceder con Web3</p>
                  {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                  <Button
                    className="w-full bg-secondary hover:bg-secondary/90"
                    onClick={handleWalletLogin}
                    disabled={isLoading}
                  >
                    <Wallet className="mr-2 w-4 h-4" />
                    {isLoading ? "Conectando..." : "Conectar Wallet"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-4">
              <Button variant="link" className="text-sm">
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export function RegisterPage() {
  const { register, registerWithWallet, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
  })
  const [roles, setRoles] = useState<Array<{id: string, name: string, description: string}>>([])
  const [error, setError] = useState("")

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      console.log('🔍 [RegisterPage] Cargando roles...')
      const response = await apiService.getRoles()
      console.log('🔍 [RegisterPage] Respuesta de roles:', response)
      
      if (response.success && response.data) {
        console.log('🔍 [RegisterPage] Roles cargados:', response.data)
        setRoles(response.data)
      } else {
        console.error('🔍 [RegisterPage] Error en respuesta de roles:', response.error)
        // Fallback: usar roles por defecto si no se pueden cargar
        const defaultRoles = [
          { id: '44f5da8f-4a10-4ef2-8657-ba5df72e0ef1', name: 'student', description: 'Estudiante con acceso a cursos y contenido educativo' },
          { id: 'ee9f44dd-621d-4acd-ba7f-b51fba39de00', name: 'teacher', description: 'Profesor con acceso a gestión de cursos y estudiantes' }
        ]
        setRoles(defaultRoles)
      }
    } catch (error) {
      console.error("Error loading roles:", error)
      // Fallback: usar roles por defecto
      const defaultRoles = [
        { id: '44f5da8f-4a10-4ef2-8657-ba5df72e0ef1', name: 'student', description: 'Estudiante con acceso a cursos y contenido educativo' },
        { id: 'ee9f44dd-621d-4acd-ba7f-b51fba39de00', name: 'teacher', description: 'Profesor con acceso a gestión de cursos y estudiantes' }
      ]
      setRoles(defaultRoles)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔍 [RegisterPage] Formulario enviado, iniciando registro...');
    console.log('🔍 [RegisterPage] Datos del formulario:', { ...formData, password: '***' });
    setError("")

    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor completa todos los campos")
      return
    }

    // Encontrar el rol seleccionado en los roles cargados dinámicamente
    console.log('🔍 [RegisterPage] Roles disponibles:', roles);
    console.log('🔍 [RegisterPage] Buscando rol:', formData.role);
    
    const selectedRole = roles.find(r => r.name === formData.role);
    console.log('🔍 [RegisterPage] Rol encontrado:', selectedRole);
    
    if (!selectedRole) {
      setError("Por favor selecciona un rol válido")
      return
    }

    console.log('🔍 [RegisterPage] Enviando al backend:', {
      ...formData,
      role: selectedRole.id,  // Usar el ID del rol encontrado
      password: '***'
    });

    const result = await register({
      ...formData,
      role: selectedRole.id  // Usar el ID del rol encontrado
    })
    console.log('🔍 [RegisterPage] Resultado del registro:', result);
    
    if (result.success && result.loginResponse && result.loginResponse.user) {
      console.log('✅ [RegisterPage] Registro exitoso, obteniendo roles del usuario...');
      
      // Obtener los roles del usuario desde la respuesta del login
      const userRoles = result.loginResponse.user.roles;
      console.log('🔍 [RegisterPage] Roles del usuario desde login:', userRoles);
      
      if (userRoles && userRoles.length > 0) {
        // Determinar el rol principal (tomar el primero si hay múltiples)
        const primaryRole = userRoles[0].toLowerCase();
        console.log('🔍 [RegisterPage] Rol principal:', primaryRole);
        
        // Mapeo dinámico basado en el rol del usuario
        let dashboardRoute = '/dashboard/student'; // Por defecto
        
        if (primaryRole === 'teacher') {
          dashboardRoute = '/dashboard/teacher';
        } else if (primaryRole === 'admin') {
          dashboardRoute = '/admin';
        } else if (primaryRole === 'institution') {
          dashboardRoute = '/admin'; // O la ruta específica para instituciones
        }
        
        console.log(`🎯 [RegisterPage] Rol del usuario: ${primaryRole}, redirigiendo a: ${dashboardRoute}`);
        console.log('🚨 [RegisterPage] REDIRECCIÓN FORZADA A:', dashboardRoute);
        
        // Redirección usando window.location para forzar la navegación
        console.log('🔄 [RegisterPage] Usando window.location.href para redirección forzada');
        window.location.href = dashboardRoute;
      } else {
        // Fallback: redirigir a dashboard de estudiante por defecto
        console.log('👨‍🎓 [RegisterPage] No se encontraron roles, redirigiendo a dashboard de estudiante por defecto');
        router.push("/dashboard/student");
      }
    } else {
      console.log('❌ [RegisterPage] Registro falló:', result.error);
      setError(result.error || "Error al crear la cuenta")
    }
  }

  const handleWalletRegister = async () => {
    const result = await registerWithWallet("0x123...", "signature")
    if (result.success) {
      router.push("/dashboard/student")
    } else {
      setError(result.error || "Error al conectar wallet")
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-poppins text-2xl">Crear Cuenta</CardTitle>
            <CardDescription>Únete a la revolución educativa</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="Tu nombre" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  placeholder="tu@email.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.length === 0 ? (
                      <SelectItem value="loading" disabled>
                        Cargando roles...
                      </SelectItem>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          <div className="flex flex-col">
                            <span className="font-medium capitalize">
                              {role.name === 'student' ? 'Estudiante' : 
                               role.name === 'teacher' ? 'Docente' : 
                               role.name === 'admin' ? 'Administrador' : 
                               role.name === 'institution' ? 'Institución' : role.name}
                            </span>
                            <span className="text-xs text-muted-foreground">{role.description}</span>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {/* Debug info - remover en producción */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-muted-foreground">
                    Debug: {roles.length} roles cargados
                  </div>
                )}
              </div>
              
              {error && <div className="text-red-500 text-sm">{error}</div>}
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                <User className="mr-2 w-4 h-4" />
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">O regístrate con</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full bg-transparent mt-4"
              onClick={handleWalletRegister}
              disabled={isLoading}
            >
              <Wallet className="mr-2 w-4 h-4" />
              Registrarse con Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
