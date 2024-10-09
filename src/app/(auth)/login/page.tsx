import LoginForm from '@/components/auth/LoginForm'
import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="flex flex-col items-center pt-10 pb-8 px-8">
          {/* Logo */}
          <div className="mb-6">
            <UtensilsCrossed size={48} className="text-blue-600" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Welcome back to MealHub
          </h2>

          {/* Login Form */}
          <LoginForm />

          {/* Additional information */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

/*
Developer: Patrick Jakobsen
Date: 09-10-2024
*/
