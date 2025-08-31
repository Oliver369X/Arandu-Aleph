"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Users, Shield } from "lucide-react"
import { apiService } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Role {
  id: string
  name: string
  description: string
  permissions: string
  userRoles?: Array<{
    user: {
      id: string
      name: string
      email: string
    }
  }>
}

export default function RolesAdminPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    try {
      setIsLoading(true)
      const response = await apiService.getRoles()
      if (response.success && response.data) {
        setRoles(response.data)
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los roles",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar los roles",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const roleData = {
        ...formData,
        permissions: JSON.stringify(formData.permissions.split(',').map(p => p.trim()))
      }

      let response
      if (editingRole) {
        response = await apiService.updateRole({ id: editingRole.id, ...roleData })
      } else {
        response = await apiService.createRole(roleData)
      }

      if (response.success) {
        toast({
          title: "Éxito",
          description: editingRole ? "Rol actualizado correctamente" : "Rol creado correctamente"
        })
        setIsDialogOpen(false)
        resetForm()
        loadRoles()
      } else {
        toast({
          title: "Error",
          description: response.error || "Error al guardar el rol",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al guardar el rol",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (roleId: string) => {
    try {
      const response = await apiService.deleteRole(roleId)
      if (response.success) {
        toast({
          title: "Éxito",
          description: "Rol eliminado correctamente"
        })
        loadRoles()
      } else {
        toast({
          title: "Error",
          description: response.error || "Error al eliminar el rol",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar el rol",
        variant: "destructive"
      })
    }
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      name: role.name,
      description: role.description,
      permissions: typeof role.permissions === 'string' ? role.permissions : JSON.stringify(role.permissions)
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", permissions: "" })
    setEditingRole(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Administración de Roles</h1>
          <p className="text-muted-foreground">Gestiona los roles y permisos del sistema</p>
        </div>
        <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 w-4 h-4" />
          Crear Rol
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Roles del Sistema</CardTitle>
          <CardDescription>
            Lista de todos los roles disponibles y sus permisos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando roles...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead>Usuarios</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        <span className="font-medium">{role.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {typeof role.permissions === 'string' ? (
                          role.permissions.split(',').map((permission, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {permission.trim()}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">Sin permisos</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{role.userRoles?.length || 0} usuarios</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(role)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar rol?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará el rol "{role.name}" y se revocarán todos los permisos asociados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(role.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? "Editar Rol" : "Crear Nuevo Rol"}
            </DialogTitle>
            <DialogDescription>
              {editingRole 
                ? "Modifica los datos del rol existente"
                : "Crea un nuevo rol con sus permisos correspondientes"
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Rol</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: admin, teacher, student"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe las funciones y responsabilidades de este rol"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permissions">Permisos</Label>
              <Input
                id="permissions"
                value={formData.permissions}
                onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
                placeholder="Ej: read, write, delete, admin (separados por comas)"
                required
              />
              <p className="text-xs text-muted-foreground">
                Separa los permisos con comas. Ej: read, write, delete, admin
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingRole ? "Actualizar" : "Crear"} Rol
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

