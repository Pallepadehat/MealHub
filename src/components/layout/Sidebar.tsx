'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UtensilsCrossed, ShoppingCart, BookOpen, User, LogOut, Wand2, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Sidebar component: Renders the sidebar navigation for the dashboard
export default function Sidebar() {
  // Get user and logout function from auth context
  const { user, logout } = useAuth()
  const router = useRouter()
  // State for sidebar open/close and mobile view
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Effect to check and update mobile state on mount and window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // If no user is authenticated, don't render the sidebar
  if (!user) return null

  const pathname = usePathname()

  // Define menu items for the sidebar
  const menuItems = [
    { icon: Wand2, label: 'Ai Assistant', path: '/dashboard' },
    { icon: UtensilsCrossed, label: 'Meal Planning', path: '/dashboard/meal' },
    { icon: ShoppingCart, label: 'Shopping Lists', path: '/dashboard/shopping-list' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
  ]

  // Animation variants for the sidebar
  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  }

  return (
    <>
      {/* Mobile menu toggle button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      <AnimatePresence>
        {/* Render sidebar if it's open or not on mobile */}
        {(isOpen || !isMobile) && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 left-0 w-64 bg-white shadow-lg h-screen z-40 lg:relative lg:z-0"
          >
            <div className="flex flex-col h-full">
              <div className="p-6">
                {/* App logo and title */}
                <h2 className="text-2xl font-bold text-blue-500 mb-6 flex items-center gap-2">
                  <UtensilsCrossed size={25} className="text-blue-500" />
                  MealHub
                </h2>
                {/* User profile section */}
                <div className="flex items-center space-x-4 mb-8">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                {/* Navigation menu */}
                <nav className="space-y-2">
                  {menuItems.map((item, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className={`w-full justify-start hover:bg-blue-50 transition-colors duration-200 ${pathname == item.path  ? "bg-blue-50" : ""}`}
                      onClick={() => {
                        router.push(item.path)
                        if (isMobile) setIsOpen(false)
                      }}
                    >
                      <item.icon className="mr-3 h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">{item.label}</span>
                    </Button>
                  ))}
                </nav>
              </div>
              {/* Logout button */}
              <div className="mt-auto p-6">
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    logout()
                    if (isMobile) setIsOpen(false)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
