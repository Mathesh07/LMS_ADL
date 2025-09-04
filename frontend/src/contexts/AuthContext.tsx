import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '@/services/api'

// Types
export interface User {
  id: number
  name: string
  email: string
  isVerified: boolean
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is authenticated on app start
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      // Mock authentication for development without backend
      console.log('Using mock authentication (no backend available)')
      
      // Create a mock user for development
      const mockUser: User = {
        id: 1,
        name: 'Dev User',
        email: 'dev@example.com',
        isVerified: true
      }
      
      setUser(mockUser)
      
      /* Original backend auth check - uncomment when backend is ready
      const response = await authApi.me()
      if (response.success && response.data) {
        setUser(response.data as User)
      }
      */
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      // Mock login for development
      console.log('Mock login attempt:', email)
      
      const mockUser: User = {
        id: 1,
        name: 'Dev User',
        email: email,
        isVerified: true
      }
      
      setUser(mockUser)
      toast.success('Login successful!')
      navigate('/')
      
      /* Original backend login - uncomment when backend is ready
      const response = await authApi.login(email, password)
      console.log(response.data)

      if (response.success && response.data) {
        setUser(response.data as User)
        toast.success('Login successful!')
        navigate('/')
      }
      */
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.register(name, email, password)

      if (response.success) {
        toast.success('Registration successful! Please check your email to verify your account.')
        navigate(`/verify-email?email=${encodeURIComponent(email)}`)
      }
    } catch (error) {
      console.log(error)
      const message = error instanceof Error ? error.message : 'Registration failed'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      const response = await authApi.logout()
      
      if (response.success) {
        setUser(null)
        toast.success('Logged out successfully!')
        navigate('/login')
      }
    } catch (error) {
      console.error('Logout failed:', error)
      // Even if logout fails on server, clear local state
      setUser(null)
      navigate('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (otp_code: string) => {
    setIsLoading(true)
    try {
      // Get email from localStorage or URL params
      const urlParams = new URLSearchParams(window.location.search)
      const user_email = urlParams.get('email')
      
      if (!user_email) {
        throw new Error('Email not found. Please try registering again.')
      }

      const response = await authApi.verifyEmail(user_email, otp_code)

      if (response.success) {
        toast.success('Email verified successfully!')
        if (response.data) {
          setUser(response.data as User)
        }
        navigate('/')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Email verification failed'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.forgotPassword(email)

      if (response.success) {
        toast.success('Password reset email sent! Please check your inbox.')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (token: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await authApi.resetPassword(token, password)

      if (response.success) {
        toast.success('Password reset successful! Please login with your new password.')
        navigate('/login')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Password reset failed'
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
