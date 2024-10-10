'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, login, logout, signUp, saveOnboardingData, updateUser, deleteUser } from '@/lib/auth'
import { User, OnboardingData } from '@/types'

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  saveOnboarding: (data: OnboardingData) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
  deleteProfile: () => Promise<void>
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// AuthProvider component: Manages authentication state and provides auth functions
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State for user, loading status, and authentication status
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Effect to load the current user on component mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        setIsAuthenticated(!!currentUser)
      } catch (error) {
        console.error('Failed to load user:', error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  // Handle user login
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
      setIsAuthenticated(false)
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  // Handle user sign up
  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      await signUp(email, password, name)
      await handleLogin(email, password)
    } catch (error) {
      console.error('Sign up failed:', error)
      throw error
    }
  }

  // Handle saving onboarding data
  const handleSaveOnboarding = async (data: OnboardingData) => {
    try {
      await saveOnboardingData(data)
      setUser(prevUser => prevUser ? { ...prevUser, ...data, onboardingCompleted: true } : null)
    } catch (error) {
      console.error('Failed to save onboarding data:', error)
      throw error
    }
  }

  // Handle updating user profile
  const handleUpdateProfile = async (data: Partial<User>) => {
    try {
      await updateUser(data)
      setUser(prevUser => prevUser ? { ...prevUser, ...data } : null)
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }

  // Handle deleting user profile
  const handleDeleteProfile = async () => {
    try {
      await deleteUser()
      setUser(null)
      setIsAuthenticated(false)
      router.push('/login')
    } catch (error) {
      console.error('Failed to delete profile:', error)
      throw error
    }
  }

  // Create the context value object
  const value = {
    user,
    loading,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    signUp: handleSignUp,
    saveOnboarding: handleSaveOnboarding,
    updateProfile: handleUpdateProfile,
    deleteProfile: handleDeleteProfile,
  }

  // Provide the authentication context to child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
