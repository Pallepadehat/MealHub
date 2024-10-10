'use client'

import { useAuth } from '@/components/auth/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SignupFormData, signupSchema } from '@/lib/validations/auth'
import { AlertCircle, Loader2, Mail, Lock, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'

// SignUpForm component: Handles user registration functionality
export function SignUpForm() {
  // State for form data, errors, loading state, and server error
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<SignupFormData>>({})
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Hooks for routing and authentication
  const router = useRouter()
  const { signUp } = useAuth()

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')
    setIsLoading(true)

    try {
      // Validate form data
      const validatedData = signupSchema.parse(formData)
      // Attempt sign up
      await signUp(validatedData.email, validatedData.password, validatedData.name)
      // Redirect to onboarding page on successful sign up
      router.push('/onboarding')
    } catch (err) {
      // Handle different types of errors
      if (err instanceof Error) {
        setServerError(err.message)
      } else if (err instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Partial<SignupFormData> = {}
        err.errors.forEach((error) => {
          if (error.path) {
            fieldErrors[error.path[0] as keyof SignupFormData] = error.message
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {/* Full name input field */}
      <div>
        <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full name
        </Label>
        <div className="relative">
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            value={formData.name}
            onChange={handleChange}
          />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        {/* Animated error message for name */}
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.name}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email input field */}
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </Label>
        <div className="relative">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            value={formData.email}
            onChange={handleChange}
          />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        {/* Animated error message for email */}
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.email}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Password input field */}
      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            value={formData.password}
            onChange={handleChange}
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        {/* Animated error message for password */}
        <AnimatePresence>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-600"
            >
              {errors.password}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Animated server error message */}
      <AnimatePresence>
        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md"
          >
            <AlertCircle size={20} />
            <p className="text-sm">{serverError}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="animate-spin mr-2" size={20} />
        ) : null}
        {isLoading ? 'Signing up...' : 'Sign up'}
      </Button>
    </motion.form>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
