import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockUsers } from '@/data/mockData'

export type UserRole = 'student' | 'trainer' | 'admin'

interface User {
  id: number
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const token = ref<string | null>(null)

  // Initialize from localStorage
  const initAuth = () => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      token.value = savedToken
    }
  }

  // Login
  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      const foundUser = mockUsers.find(u => u.email === email && u.password === password)
      
      if (!foundUser) {
        throw new Error('Invalid email or password')
      }
      
      // Create a user object without the password
      const { password: _, ...userWithoutPassword } = foundUser
      
      // Set the authenticated user
      user.value = userWithoutPassword
      token.value = 'mock-jwt-token'
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)
      
      // Redirect based on role
      if (foundUser.role === 'student') {
        router.push('/student')
      } else if (foundUser.role === 'trainer') {
        router.push('/trainer')
      } else if (foundUser.role === 'admin') {
        router.push('/admin')
      }
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  // Register
  const register = async (name: string, email: string, password: string, role: UserRole = 'student') => {
    try {
      // In a real app, this would be an API call
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email)
      
      if (existingUser) {
        throw new Error('Email already in use')
      }
      
      // Create a new user
      const newUser = {
        id: mockUsers.length + 1,
        name,
        email,
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      }
      
      // In a real app, we would save this user to the database
      mockUsers.push({ ...newUser, password })
      
      // Log in the new user
      await login(email, password)
      
      return true
    } catch (error) {
      console.error('Registration error:', error)
      return false
    }
  }

  // Logout
  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      // In a real app, this would send a reset link via email
      const userExists = mockUsers.some(u => u.email === email)
      
      if (!userExists) {
        throw new Error('User not found')
      }
      
      return true
    } catch (error) {
      console.error('Reset password error:', error)
      return false
    }
  }

  return {
    user,
    isAuthenticated,
    userRole,
    token,
    initAuth,
    login,
    register,
    logout,
    resetPassword
  }
})