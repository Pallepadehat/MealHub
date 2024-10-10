'use client'

import { useAuth } from '@/components/auth/AuthContext'
import Sidebar from '@/components/layout/Sidebar'
import { useEffect, useState } from 'react'

// DashboardLayout component: Provides a layout structure for dashboard pages
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  // Show loading state while authentication is being checked
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  // If no user is authenticated, return null (component will not render)
  // In a real application, you might want to redirect to a login page here
  if (!user) {
    return null // Or redirect to login page
  }

  // State to track if the viewport is mobile-sized
  const [isMobile, setIsMobile] = useState(false)

  // Effect to check and update mobile state on mount and window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar component */}
      <Sidebar />
      {/* Main content area */}
      <main className={`flex-1 overflow-y-auto ${isMobile ? 'pt-20' : ''}`}>
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
