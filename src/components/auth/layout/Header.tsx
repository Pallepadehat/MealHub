'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthContext'
import { Button } from "@/components/ui/button"
import { UtensilsCrossed, ShoppingCart, BookOpen } from 'lucide-react'

// Header component for the application
export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo and site title */}
        <Link href="/" className="text-2xl font-bold flex items-center">
          <UtensilsCrossed className="mr-2" />
          MealHub
        </Link>
        {/* Navigation links and user actions */}
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              {/* Links for authenticated users */}
              <Link href="/meals" className="hover:text-secondary-foreground transition-colors">
                <BookOpen className="inline mr-1" size={18} />
                Meals
              </Link>
              <Link href="/shopping-lists" className="hover:text-secondary-foreground transition-colors">
                <ShoppingCart className="inline mr-1" size={18} />
                Shopping Lists
              </Link>
              <span className="text-sm">Welcome, {user.name}</span>
              <Button onClick={logout} variant="secondary">Logout</Button>
            </>
          ) : (
            <>
              {/* Links for non-authenticated users */}
              <Link href="/login" passHref>
                <Button variant="secondary">Login</Button>
              </Link>
              <Link href="/signup" passHref>
                <Button variant="secondary">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

/*
Developer: Patrick Jakobsen
Date: 09-10-2024
*/
