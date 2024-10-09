/*
Developer: Patrick Jakobsen
Date: 08-10-2024
Description: AuthWrapper makes sure the pages are protected and only accessible to authenticated users.
*/

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-loader-circle w-8 h-8 animate-spin mb-2">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
        </svg>
        <p className="text-sm text-center text-muted-foreground">We are loading your account...</p>
      </div>
    )
  }

  return children
}
