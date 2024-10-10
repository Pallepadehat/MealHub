'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { databases } from '@/lib/appwrite'
import { Query } from 'appwrite'
import { toast } from 'react-hot-toast'
import { Search } from 'lucide-react'

interface Ingredient {
  id: string
  name: string
  quantity: string
  unit: string
  category: string
}

interface Meal {
  id: string
  name: string
  ingredients: Ingredient[]
}

interface ImportFromMealProps {
  onImport: (items: Ingredient[]) => void
}

export default function ImportFromMeal({ onImport }: ImportFromMealProps) {
  const { user } = useAuth()
  const [meals, setMeals] = useState<Meal[]>([])
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([])

  useEffect(() => {
    if (user) {
      fetchMealsAndIngredients()
    }
  }, [user])

  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase()
    const filtered = meals.filter(meal =>
      meal.name.toLowerCase().includes(lowercasedTerm) ||
      meal.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(lowercasedTerm))
    )
    setFilteredMeals(filtered)
  }, [searchTerm, meals])

  const fetchMealsAndIngredients = async () => {
    try {
      // Fetch meals
      const mealsResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_MEALS_ID!,
        [Query.equal('userId', user!.id)]
      )

      // Fetch all ingredients
      const ingredientsResponse = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_INGREDIENTS_ID!
      )

      // Combine meals with their ingredients
      const mealsWithIngredients = mealsResponse.documents.map(meal => ({
        id: meal.$id,
        name: meal.name,
        ingredients: ingredientsResponse.documents
          .filter(ingredient => ingredient.meal_id === meal.$id)
          .map(ingredient => ({
            id: ingredient.$id,
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            category: ingredient.category
          }))
      }))

      setMeals(mealsWithIngredients)
      setFilteredMeals(mealsWithIngredients)
    } catch (error) {
      console.error('Error fetching meals and ingredients:', error)
      toast.error('Failed to load meals and ingredients')
    }
  }

  const toggleIngredient = (ingredient: Ingredient) => {
    setSelectedIngredients(prev =>
      prev.some(i => i.id === ingredient.id)
        ? prev.filter(i => i.id !== ingredient.id)
        : [...prev, ingredient]
    )
  }

  const toggleAllInMeal = (meal: Meal) => {
    const allSelected = meal.ingredients.every(ingredient =>
      selectedIngredients.some(i => i.id === ingredient.id)
    )

    if (allSelected) {
      setSelectedIngredients(prev =>
        prev.filter(i => !meal.ingredients.some(mi => mi.id === i.id))
      )
    } else {
      setSelectedIngredients(prev => [
        ...prev,
        ...meal.ingredients.filter(ingredient =>
          !prev.some(i => i.id === ingredient.id)
        )
      ])
    }
  }

  const handleImport = () => {
    onImport(selectedIngredients)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search meals or ingredients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      <ScrollArea className="h-[300px] pr-4">
        {filteredMeals.map(meal => (
          <div key={meal.id} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{meal.name}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAllInMeal(meal)}
              >
                {meal.ingredients.every(ingredient =>
                  selectedIngredients.some(i => i.id === ingredient.id)
                ) ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
            {meal.ingredients.map(ingredient => (
              <div key={ingredient.id} className="flex items-center space-x-2 py-1">
                <Checkbox
                  checked={selectedIngredients.some(i => i.id === ingredient.id)}
                  onCheckedChange={() => toggleIngredient(ingredient)}
                  id={`ingredient-${ingredient.id}`}
                />
                <label htmlFor={`ingredient-${ingredient.id}`} className="flex-grow">
                  {ingredient.name} ({ingredient.quantity} {ingredient.unit})
                </label>
              </div>
            ))}
          </div>
        ))}
      </ScrollArea>
      <Button onClick={handleImport} disabled={selectedIngredients.length === 0}>
        Import Selected Ingredients
      </Button>
    </div>
  )
}
