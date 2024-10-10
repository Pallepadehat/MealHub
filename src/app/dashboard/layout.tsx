'use client'

import { useAuth } from '@/components/auth/AuthContext'
import Sidebar from '@/components/layout/Sidebar'
import { useEffect, useState } from 'react'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return null // Or redirect to login page
  }

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
<div className="flex h-screen overflow-hidden">
      <Sidebar />
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
