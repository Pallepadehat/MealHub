'use client'

import { deleteMeal, getMeals } from '@/app/actions/meal-action'
import { useAuth } from '@/components/auth/AuthContext'
import MealForm from '@/components/meals/MealForm'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MealWithIngredients } from '@/types'
import { Calendar, Edit, Trash2, UtensilsCrossed, Plus, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

// MealPage component: Renders the meal planning page with list and creation functionality
export default function MealPage() {
  const { user } = useAuth()
  const [meals, setMeals] = useState<MealWithIngredients[]>([])
  const [editingMeal, setEditingMeal] = useState<MealWithIngredients | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch meals when the component mounts or user changes
  useEffect(() => {
    if (user) {
      fetchMeals()
    }
  }, [user])

  // Function to fetch meals from the server
  const fetchMeals = async () => {
    if (user) {
      setIsLoading(true)
      try {
        const fetchedMeals = await getMeals(user.id)
        setMeals(fetchedMeals)
      } catch (error) {
        console.error('Failed to fetch meals:', error)
        toast.error('Failed to load meals. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Function to handle meal deletion
  const handleDelete = async (mealId: string) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      try {
        const result = await deleteMeal(mealId)
        if (result.success) {
          toast.success('Meal deleted successfully')
          setMeals(meals.filter(meal => meal.id !== mealId))
        } else {
          throw new Error(result.error)
        }
      } catch (error) {
        console.error('Failed to delete meal:', error)
        toast.error('Failed to delete meal. Please try again.')
      }
    }
  }

  // Function to handle meal update
  const handleUpdate = (updatedMeal: MealWithIngredients) => {
    setMeals(meals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal))
    handleCloseEditForm()
  }

  // Function to close the edit form dialog
  const handleCloseEditForm = () => {
    setEditingMeal(null)
    setIsOpen(false)
  }

  // If no user is authenticated, return null
  if (!user) {
    return null
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 p-8">
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white/10 p-4 rounded-full"
              >
                <UtensilsCrossed size={48} className="text-white" />
              </motion.div>
            </div>
            <CardTitle className="text-4xl font-bold text-white mb-2">Meal Planning</CardTitle>
            <p className="text-blue-100 text-lg">Create and manage your meals</p>
          </CardHeader>
          <CardContent className="p-8">
            <Tabs defaultValue="list" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="list" className="rounded-md transition-all duration-200">Meal List</TabsTrigger>
                <TabsTrigger value="create" className="rounded-md transition-all duration-200">Create Meal</TabsTrigger>
              </TabsList>
              <TabsContent value="list">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : meals.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-gray-500 py-12"
                  >
                    <UtensilsCrossed className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-2xl font-semibold mb-2 text-gray-700">No meals found</h3>
                    <p className="text-lg mb-4">Create your first meal to get started!</p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    <ul className="space-y-4">
                      {meals.map((meal) => (
                        <motion.li
                          key={meal.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="p-6">
                            <h3 className="font-semibold text-xl text-gray-800 mb-2">{meal.name}</h3>
                            <p className="text-gray-600 mb-4">{meal.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500 flex items-center">
                                <Calendar className="mr-2 h-4 w-4" />
                                {new Date(meal.createdAt).toLocaleDateString()}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Dialog open={isOpen && editingMeal?.id === meal.id} onOpenChange={(open) => {
                                  setIsOpen(open)
                                  if (!open) setEditingMeal(null)
                                }}>
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
                                      <MealForm
                                        user={user}
                                        initialMeal={editingMeal}
                                        onClose={handleCloseEditForm}
                                        onUpdate={handleUpdate}
                                      />
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(meal.id)}>
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </AnimatePresence>
                )}
              </TabsContent>
              <TabsContent value="create">
                <MealForm user={user} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="bg-gray-50 p-6">
          <p className="text-sm text-gray-500 text-center w-full">
            MealHub - Your personal meal planning assistant
          </p>
        </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
