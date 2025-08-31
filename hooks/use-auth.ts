"use client"

import { useState, useEffect } from "react"
import { apiService } from "@/lib/api"
import { DataAdapter } from "@/lib/data-adapter"
import type { User } from "@/lib/api"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("arandu_token")
      if (token) {
        const response = await apiService.getCurrentUser()
        if (response.success && response.data) {
          setUser(response.data)
          setIsAuthenticated(true)
        } else {
          // Token inválido, limpiar
          apiService.logout()
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      apiService.logout()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    console.log('🔍 [useAuth] Iniciando login...', { email, password: '***' });
    setIsLoading(true);
    try {
      console.log('🔍 [useAuth] Llamando a apiService.login...');
      const response = await apiService.login(email, password);
      console.log('🔍 [useAuth] Respuesta del apiService:', response);
      
      if (response.success && response.user) {
        console.log('✅ [useAuth] Login exitoso, configurando usuario...');
        // El backend devuelve { success: true, data: { id, name, email, ... }, token: "..." }
        const userData = response.user;
        console.log('🔍 [useAuth] Datos del usuario:', userData);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('✅ [useAuth] Usuario configurado correctamente');
        return { success: true };
      } else {
        console.log('❌ [useAuth] Login falló:', response.error);
        return { success: false, error: response.error || "Login failed" };
      }
    } catch (error) {
      console.error('❌ [useAuth] Error en login:', error);
      return { success: false, error: "Login failed" };
    } finally {
      setIsLoading(false);
      console.log('🔍 [useAuth] Login completado, isLoading = false');
    }
  }

  const loginWithWallet = async (walletAddress: string, signature: string) => {
    setIsLoading(true)
    try {
      // TODO: Implementar autenticación con wallet
      // Por ahora, simular login con wallet
      const mockUser: User = {
        id: "wallet_user_1",
        name: "Usuario Wallet",
        email: `${walletAddress.slice(0, 8)}...@wallet.com`,
        roles: ["student"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const token = `wallet_${walletAddress.slice(0, 8)}_token`
      apiService.setToken(token)
      localStorage.setItem("arandu_user", JSON.stringify(mockUser))

      setUser(mockUser)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return { success: false, error: "Wallet login failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    apiService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await apiService.updateUser(userData)
      if (response.success && response.data) {
        setUser(response.data)
        localStorage.setItem("arandu_user", JSON.stringify(response.data))
        return { success: true }
      } else {
        return { success: false, error: response.error }
      }
    } catch (error) {
      return { success: false, error: "Update failed" }
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiService.changePassword(currentPassword, newPassword)
      return response
    } catch (error) {
      return { success: false, error: "Password change failed" }
    }
  }

  const register = async (userData: { name: string; email: string; password: string; role?: string }) => {
    setIsLoading(true)
    try {
      const response = await apiService.register(userData)
      
      if (response.success) {
        // Si el registro es exitoso, hacer login automáticamente
        const loginResponse = await apiService.login(userData.email, userData.password)
        if (loginResponse.success && loginResponse.user) {
          setUser(loginResponse.user)
          setIsAuthenticated(true)
        }
        return { success: true }
      } else {
        return { success: false, error: response.error || "Registration failed" }
      }
    } catch (error) {
      return { success: false, error: "Registration failed" }
    } finally {
      setIsLoading(false)
    }
  }

  const registerWithWallet = async (walletAddress: string, signature: string) => {
    setIsLoading(true)
    try {
      // TODO: Implementar registro con wallet
      // Por ahora, simular registro con wallet
      const mockUser: User = {
        id: "wallet_user_1",
        name: "Usuario Wallet",
        email: `${walletAddress.slice(0, 8)}...@wallet.com`,
        roles: ["student"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const token = `wallet_${walletAddress.slice(0, 8)}_token`
      apiService.setToken(token)
      localStorage.setItem("arandu_user", JSON.stringify(mockUser))

      setUser(mockUser)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return { success: false, error: "Wallet registration failed" }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithWallet,
    register,
    registerWithWallet,
    logout,
    updateUser,
    changePassword,
  }
}
