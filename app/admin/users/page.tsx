"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, UserPlus, Shield, Mail, Calendar } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

interface Role {
  id: string
  name: string
  description: string
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      const [usersResponse, rolesResponse] = await Promise.all([
        apiService.getUsers(),
        apiService.getRoles()
      ])

      if (usersResponse.success && usersResponse.data) {
        setUsers(usersResponse.data)
      }

      if (rolesResponse.success && rolesResponse.data) {
        setRoles(rolesResponse.data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar los datos",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAssignRole = async () => {
    if (!selectedUser || !selectedRoleId) return

    try {
      const response = await apiService.assignRole(selectedUser.id, selectedRoleId)
      if (response.success) {
        toast({
          title: "Éxito",
          description: "Rol asignado correctamente"
        })
        setIsRoleDialogOpen(false)
        setSelectedUser(null)
        setSelectedRoleId("")
        loadData() // Recargar para ver los cambios
      } else {
        toast({
          title: "Error",
          description: response.error || "Error al asignar el rol",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al asignar el rol",
        variant: "destructive"
      })
    }
  }

  const handleRemoveRole = async (userId: string, roleId: string) => {
    try {
      const response = await apiService.removeRole(userId, roleId)
      if (response.success) {
        toast({
          title: "Éxito",
          description: "Rol removido correctamente"
        })
        loadData()
      } else {
        toast({
          title: "Error",
          description: response.error || "Error al remover el rol",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al remover el rol",
        variant: "destructive"
      })
    }
  }

  const openRoleDialog = (user: User) => {
    setSelectedUser(user)
    setSelectedRoleId("")
    setIsRoleDialogOpen(true)
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Administración de Usuarios</h1>
          <p className="text-muted-foreground">Gestiona usuarios y asigna roles</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Buscar Usuarios</CardTitle>
          <CardDescription>
            Encuentra usuarios por nombre o email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
          <CardDescription>
            Lista de todos los usuarios registrados y sus roles asignados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando usuarios...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.image} />
                          <AvatarFallback>
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          {user.bio && (
                            <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {user.bio}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">Sin roles</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{formatDate(user.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRoleDialog(user)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Asignar Rol
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Asignar Rol a Usuario</DialogTitle>
            <DialogDescription>
              Selecciona un rol para asignar a {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>{role.name}</span>
                        <span className="text-muted-foreground">- {role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsRoleDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAssignRole}
                disabled={!selectedRoleId}
              >
                Asignar Rol
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

