"use client"

import React from 'react'
import { useMeals, Meal } from '@/hooks/useMeals'
import { MealCard } from './MealCard'
import { CreateMealDialog } from './CreateMealDialog'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'

export function Meals() {
  const { meals, loading, error, deleteMeal, fetchMeals } = useMeals()

  const handleEdit = (meal: Meal) => {
    // Implement edit functionality
    console.log('Edit meal:', meal)
    // You might want to open an edit dialog or navigate to an edit page here
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMeal(id)
      toast.success('Meal deleted successfully')
    } catch (error) {
      console.error('Error deleting meal:', error)
      toast.error('Failed to delete meal')
    }
  }

  const handleRefresh = async () => {
    try {
      await fetchMeals()
      toast.success('Meals refreshed successfully')
    } catch (error) {
      console.error('Error refreshing meals:', error)
      toast.error('Failed to refresh meals')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>Error: {error}</p>
        <Button onClick={handleRefresh} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Your Meals</h2>
        <div className="flex space-x-4">
          <Button onClick={handleRefresh} variant="outline">
            Refresh
          </Button>
          <CreateMealDialog />
        </div>
      </div>
      {meals.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-xl mb-4">You haven't added any meals yet.</p>
          <CreateMealDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <MealCard
              key={meal.$id}
              meal={meal}
              onEdit={() => handleEdit(meal)}
              onDelete={() => handleDelete(meal.$id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
