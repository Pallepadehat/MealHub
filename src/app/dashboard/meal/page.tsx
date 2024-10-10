'use client'

import { deleteMeal, getMeals } from '@/app/actions/meal-action'
import { useAuth } from '@/components/auth/AuthContext'
import EditMealForm from '@/components/meals/EditMealForm'
import MealForm from '@/components/meals/MealForm'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MealWithIngredients } from '@/types'
import { Calendar, Edit, Trash2, UtensilsCrossed } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

export default function MealPage() {
  const { user } = useAuth()
  const [meals, setMeals] = useState<MealWithIngredients[]>([])
  const [editingMeal, setEditingMeal] = useState<MealWithIngredients | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [newMeal, setNewMeal] = useState({
    name: '',
    description: '',
    mealType: 'breakfast' as MealWithIngredients['mealType'],
    ingredients: [],
    instructions: [],
    nutritionalBenefits: []
  })

  if (!user) {
    return null
  }

  useEffect(() => {
    if (user) {
      fetchMeals()
    }
  }, [user])


  const fetchMeals = async () => {
    if (user) {
      const fetchedMeals = await getMeals(user.id)
      setMeals(fetchedMeals)
    }
  }

  const handleDelete = async (mealId: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      const result = await deleteMeal(mealId)
      if (result.success) {
        toast.success('Meal deleted successfully')
        setMeals(meals.filter(meal => meal.id !== mealId))
      } else {
        toast.error('Failed to delete meal')
      }
    }
  }

  const handleUpdate = (updatedMeal: MealWithIngredients) => {
    setMeals(meals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal))
  }

  const handleCloseEditForm = () => {
    setEditingMeal(null)
    setIsOpen(false)
  }


  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Meal Planning</h1>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Meal List</TabsTrigger>
          <TabsTrigger value="create">Create Meal</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card className="shadow-md">
            <CardHeader className="bg-primary/10">
              <CardTitle className="text-2xl text-primary flex items-center">
                <UtensilsCrossed className="mr-2 h-6 w-6" />
                Your Meals
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {meals.map((meal) => (
                  <li key={meal.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium text-lg text-gray-800">{meal.name}</h3>
                      <p className="text-sm text-gray-500">{meal.description}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {new Date(meal.createdAt).toLocaleDateString()}
                      </span>
                      <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => {
                            setEditingMeal(meal)
                            setIsOpen(true)
                          }}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          {editingMeal && (
                            <EditMealForm
                              meal={editingMeal}
                              onClose={handleCloseEditForm}
                              onUpdate={handleUpdate}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(meal.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create">
            <MealForm user={user} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
