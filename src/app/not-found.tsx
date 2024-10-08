/*
Developer: Patrick Jakobsen
Date: 08-10-2024
Description: 404 page for MealHub, where users are redirected when a page is not found.
*/

"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ChefHat, Home, ArrowLeft } from 'lucide-react'

const randomMessages = [
  "Looks like this recipe got lost in the pantry!",
  "Oops! We stirred the pot too much and lost this page.",
  "This dish seems to have boiled over and disappeared!",
  "We've searched high and low, but this ingredient is missing from our kitchen.",
  "Seems like this page has been gobbled up!",
  "Our meal plan doesn't include this page. Let's find you something tasty!",
  "This recipe must have burned and we had to throw it out. Sorry!",
  "We've looked in every cookbook, but we can't find this page.",
  "This page is as elusive as the perfect soufflé!",
  "Looks like this page is still marinating. Check back later!"
]

export default function NotFound() {
  const [message, setMessage] = useState("")

  useEffect(() => {
    setMessage(randomMessages[Math.floor(Math.random() * randomMessages.length)])
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center">
          <ChefHat className="h-24 w-24 text-green-600 mb-4" />
          <h1 className="text-6xl font-extrabold text-gray-900 mb-2">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">{message}</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild className="flex items-center justify-center">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button asChild variant="outline" className="flex items-center justify-center">
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
