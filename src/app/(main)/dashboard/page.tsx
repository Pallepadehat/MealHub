"use client"

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
      <h1 className="text-4xl font-bold mb-6">Welcome to your Dashboard</h1>
      <p className="text-xl mb-8">Hello, {user?.name}!</p>
      <Button onClick={logout}>Logout</Button>
    </div>
  )
}
