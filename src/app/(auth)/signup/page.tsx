import SignUpForm from '@/components/auth/SignUpForm'
import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardContent className="flex flex-col items-center pt-10 pb-8 px-8">
          {/* Logo */}
          <div className="mb-6">
            <UtensilsCrossed size={48} className="text-blue-600" />
          </div>

          {/* Title */}
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Join MealHub
          </h2>

          {/* Sign Up Form */}
          <SignUpForm />

          {/* Additional information */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log in here
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
