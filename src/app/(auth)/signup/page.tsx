/*
Developer: Patrick Jakobsen
Date: 07-10-2024
Description: Signup page for MealHub, where users can create an account.
*/

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Apple, Loader2 } from 'lucide-react'
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-hot-toast"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (password !== confirmPassword) {
        toast.error("Passwords do not match. Please make sure your passwords match.")
        return
      }
      setIsLoading(true)
      try {
        await register(name, email, password)
        router.push('/onboarding')
      } catch (error) {
        console.error("Signup failed", error)
        toast.error("Signup failed. An error occurred during signup. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
           <Apple className="h-12 w-12 text-green-600" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Join MealHub today</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Start planning your meals with ease
          </p>
        </div>
        <Card className="mt-8 space-y-6 bg-white/80 backdrop-blur-sm shadow-xl rounded-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-900">Create your account</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Fill in your details to get started with MealHub
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <Button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/auth/login" className="font-medium text-green-600 hover:text-green-500">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
