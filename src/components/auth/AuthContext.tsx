'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import { getCurrentUser, login, logout, signUp, saveOnboardingData } from '@/lib/auth'
import { User, OnboardingData } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  saveOnboarding: (data: OnboardingData) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Failed to load user:', error)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password)
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      await signUp(email, password, name)
      await handleLogin(email, password)
    } catch (error) {
      console.error('Sign up failed:', error)
      throw error
    }
  }

  const handleSaveOnboarding = async (data: OnboardingData) => {
    try {
      await saveOnboardingData(data)
      setUser(prevUser => prevUser ? { ...prevUser, ...data, onboardingCompleted: true } : null)
    } catch (error) {
      console.error('Failed to save onboarding data:', error)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
    signUp: handleSignUp,
    saveOnboarding: handleSaveOnboarding,
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

/*
Developer: Patrick Jakobsen
Date: 09-10-2024
*/
