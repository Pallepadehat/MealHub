'use client'

import LoginForm from '@/components/auth/LoginForm'
import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed } from 'lucide-react'
import { motion } from 'framer-motion'

// LoginPage component: Renders the login page with animated elements
export default function LoginPage() {
  return (
    // Main container with gradient background
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Animated wrapper for the login card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        {/* Login card with shadow and rounded corners */}
        <Card className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="flex flex-col items-center pt-12 pb-10 px-8">
            {/* Animated icon container */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mb-8 bg-blue-600 p-4 rounded-full"
            >
              {/* MealHub icon */}
              <UtensilsCrossed size={48} className="text-white" />
            </motion.div>

            {/* Animated welcome text */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Welcome Back
            </motion.h2>

            {/* Animated subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-gray-600 mb-8 text-center"
            >
              Sign in to your MealHub account to continue your culinary journey
            </motion.p>

            {/* Login form component */}
            <LoginForm />

            {/* Animated links for signup and password recovery */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 text-center"
            >
              {/* Sign up link */}
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Sign up here
                </a>
              </p>
              {/* Forgot password link */}
              <a href="/forgot-password" className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-500 transition-colors">
                Forgot your password?
              </a>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
