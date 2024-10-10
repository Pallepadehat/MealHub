'use client'

import { SignUpForm } from "@/components/auth/SignUpForm"
import { Card, CardContent } from "@/components/ui/card"
import { UtensilsCrossed } from 'lucide-react'
import Link from "next/link"
import { motion } from 'framer-motion'

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="flex flex-col items-center pt-12 pb-10 px-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="mb-8 bg-blue-600 p-4 rounded-full"
            >
              <UtensilsCrossed size={48} className="text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl font-bold text-gray-900 mb-2"
            >
              Join MealHub
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-gray-600 mb-8 text-center"
            >
              Create your account and start your culinary journey
            </motion.p>

            <SignUpForm />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 text-center text-sm text-gray-600"
            >
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Log in here
              </Link>
            </motion.p>
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
