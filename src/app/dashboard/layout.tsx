'use client'

import { useAuth } from '@/components/auth/AuthContext'
import Sidebar from '@/components/layout/Sidebar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return null // Or redirect to login page
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
