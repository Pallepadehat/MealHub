'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from 'lucide-react'
import { signupSchema, SignupFormData } from '@/lib/validations/auth'
import { z } from 'zod'

export default function SignUpForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Partial<SignupFormData>>({})
  const [serverError, setServerError] = useState('')
  const router = useRouter()
  const { signUp } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')

    try {
      const validatedData = signupSchema.parse(formData)
      await signUp(validatedData.email, validatedData.password, validatedData.name)
      router.push('/onboarding')
    } catch (err) {
      if (err instanceof Error) {
        setServerError(err.message)
      } else if (err instanceof z.ZodError) {
        const fieldErrors: Partial<SignupFormData> = {}
        err.errors.forEach((error) => {
          if (error.path) {
            fieldErrors[error.path[0] as keyof SignupFormData] = error.message
          }
        })
        setErrors(fieldErrors)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div>
        <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full name
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {serverError && (
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle size={20} />
          <p>{serverError}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Sign up
      </Button>
    </form>
  )
}

/*
Developer: Patrick Jakobsen
Date: 09-10-2024
*/
