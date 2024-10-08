/*
Developer: Patrick Jakobsen
Date: 08-10-2024
Description: Error page for MealHub, where users are redirected when an error occurs.
*/



'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-orange-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <AlertTriangle className="h-24 w-24 text-red-600 mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Oops! Something went wrong</h1>
          <p className="text-xl text-gray-600 mb-8">We apologize for the inconvenience. Our chefs are working hard to fix this issue.</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button onClick={reset} className="flex items-center justify-center">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button asChild variant="outline" className="flex items-center justify-center">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
