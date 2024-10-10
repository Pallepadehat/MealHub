'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import ShoppingList from '@/components/shopping-list/ShoppingList'
import { useAuth } from '@/components/auth/AuthContext'
import { useRouter } from 'next/navigation'

export default function ShoppingListPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-5">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <ShoppingList />
      </motion.div>
    </div>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
