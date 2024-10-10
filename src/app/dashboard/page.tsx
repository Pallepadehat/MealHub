'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UtensilsCrossed, ShoppingCart, Plus, Calendar } from 'lucide-react'
import { getMeals } from '@/app/actions/meal-action'
import { Meal } from '@/types'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [meals, setMeals] = useState<Meal[]>([])
  const [shoppingItems, setShoppingItems] = useState<{ name: string; quantity: string }[]>([])

  useEffect(() => {
    if (user) {
      if (!user.onboardingCompleted) {
        router.push('/onboarding')
      } else {
        fetchMeals()
        // Uncomment when shopping list action is implemented
        // fetchShoppingItems()
      }
    }
  }, [user, router])

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

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome to your Kitchen, {user?.name}!</h1>

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
            <Button variant="link" className="mt-6 text-primary" onClick={() => router.push('/dashboard/meal')}>
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
            <Button variant="link" className="mt-6 text-primary" onClick={() => router.push('/dashboard/shopping-list')}>
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
  )
}
