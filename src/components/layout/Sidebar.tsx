'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UtensilsCrossed, ShoppingCart, BookOpen, User, LogOut, ChefHat } from 'lucide-react'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  return (
    <div className="w-64 bg-white shadow-lg h-screen">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center">
            <ChefHat className="mr-2 h-6 w-6" />
            MealHub
          </h2>
          <div className="flex items-center space-x-4 mb-8">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start hover:bg-gray-100" onClick={() => router.push('/dashboard')}>
              <UtensilsCrossed className="mr-3 h-5 w-5" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start hover:bg-gray-100" onClick={() => router.push('/dashboard/meal')}>
              <UtensilsCrossed className="mr-3 h-5 w-5" />
              Meal Planning
            </Button>
            <Button variant="ghost" className="w-full justify-start hover:bg-gray-100" onClick={() => router.push('/dashboard/shopping-list')}>
              <ShoppingCart className="mr-3 h-5 w-5" />
              Shopping Lists
            </Button>
            <Button variant="ghost" className="w-full justify-start hover:bg-gray-100" onClick={() => router.push('/recipe-book')}>
              <BookOpen className="mr-3 h-5 w-5" />
              Recipe Book
            </Button>
            <Button variant="ghost" className="w-full justify-start hover:bg-gray-100" onClick={() => router.push('/profile')}>
              <User className="mr-3 h-5 w-5" />
              Profile
            </Button>
          </nav>
        </div>
        <div className="mt-auto p-6">
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
