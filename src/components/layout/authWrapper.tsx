"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface AuthWrapperProps {
  children: React.ReactNode
}

const publicRoutes = ['/', '/login', '/signup', '/auth/login', '/auth/signup']

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && !publicRoutes.includes(pathname)) {
      router.push('/login')
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className='text-sm text-center text-muted-foreground'>We are loading your account...</p>
      </div>
    )
  }

  if (!user && !publicRoutes.includes(pathname)) {
    return null
  }

  return <>{children}</>
}
