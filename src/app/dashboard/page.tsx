'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UtensilsCrossed, ShoppingCart, BookOpen, Plus, User, LogOut, ChefHat, Calendar } from 'lucide-react'
import { getMeals } from '@/app/actions/meal-action'
import { Meal } from '@/types'

// Dashboard page component
export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [meals, setMeals] = useState<Meal[]>([])
  const [shoppingItems, setShoppingItems] = useState<{ name: string; quantity: string }[]>([])

  useEffect(() => {
    if (!loading && user) {
      if (!user.onboardingCompleted) {
        router.push('/onboarding')
      } else {
        fetchMeals()
        // Uncomment when shopping list action is implemented
        // fetchShoppingItems()
      }
    }
  }, [user, loading, router])

  const fetchMeals = async () => {
    if (user) {
      const latestMeals = await getMeals(user.id, 5)
      setMeals(latestMeals)
    }
  }

  // Uncomment and implement when shopping list action is ready
  // const fetchShoppingItems = async () => {
  //   if (user) {
  //     const latestItems = await getShoppingListItems(user.id, 5)
  //     setShoppingItems(latestItems)
  //   }
  // }

  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
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

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to your Kitchen, {user.name}!</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Latest Meals */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-2xl text-primary flex items-center">
                <UtensilsCrossed className="mr-2 h-6 w-6" />
                Latest Meals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {meals.map((meal, index) => (
                  <li key={index} className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium text-gray-800">{meal.name}</span>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {new Date(meal.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
              <Button variant="link" className="mt-6 text-primary" onClick={() => router.push('/meal-planning')}>
                View all meals
              </Button>
            </CardContent>
          </Card>

          {/* Shopping List Items */}
          <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-2xl text-primary flex items-center">
                <ShoppingCart className="mr-2 h-6 w-6" />
                Shopping List
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {shoppingItems.map((item, index) => (
                  <li key={index} className="flex items-center justify-between border-b pb-2">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-sm text-gray-500">{item.quantity}</span>
                  </li>
                ))}
              </ul>
              <Button variant="link" className="mt-6 text-primary" onClick={() => router.push('/shopping-lists')}>
                View full list
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Add */}
        <Card className="shadow-md">
          <CardHeader className="bg-primary/10">
            <CardTitle className="text-2xl text-primary flex items-center">
              <Plus className="mr-2 h-6 w-6" />
              Quick Add
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex space-x-2">
              <Input placeholder="Add a meal or shopping item..." className="flex-grow" />
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
