/*
Developer: Patrick Jakobsen
Date: 08-10-2024
Description: AuthWrapper component that checks if the user is authenticated before rendering the children components.
*/


"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && pathname !== '/') {
      router.push('/auth/login')
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className='text-sm text-center text-muted-foreground'>We are loading your account...</p>
      </div>
    )
  }

  if (!user && pathname !== '/') {
    return null
  }

  return <>{children}</>
}
