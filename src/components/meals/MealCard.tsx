import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Utensils, Users, Clock } from 'lucide-react'
import { Meal } from '@/hooks/useMeals'

interface MealCardProps {
  meal: Meal;
  onEdit: (meal: Meal) => void;
  onDelete: (id: string) => void;
}

export function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{meal.name}</CardTitle>
        <CardDescription className="text-sm text-gray-500">{meal.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center space-x-2 mb-2">
          <Utensils className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{meal.ingredients.length} ingredients</span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm">{meal.servings} servings</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm">Created on {new Date(meal.$createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => onEdit(meal)}>Edit</Button>
        <Button variant="destructive" onClick={() => onDelete(meal.$id)}>Delete</Button>
      </CardFooter>
    </Card>
  )
}
