'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ingredient, MealWithIngredients } from '@/types'
import { Plus, Minus, Save, Loader2 } from 'lucide-react'
import { updateMeal } from '@/app/actions/meal-action'
import { toast } from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface EditMealFormProps {
  meal: MealWithIngredients;
  onClose: () => void;
  onUpdate: (updatedMeal: MealWithIngredients) => void;
}

export default function EditMealForm({ meal, onClose, onUpdate }: EditMealFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [editedMeal, setEditedMeal] = useState<MealWithIngredients>(meal)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedMeal(prev => ({ ...prev, [name]: value }))
  }

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    setEditedMeal(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      )
    }))
  }

  const addIngredient = () => {
    setEditedMeal(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { id: '', meal_id: prev.id, name: '', quantity: '', unit: '' }]
    }))
  }

  const removeIngredient = (index: number) => {
    setEditedMeal(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const handleArrayChange = (index: number, field: 'instructions' | 'nutritionalBenefits', value: string) => {
    setEditedMeal(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'instructions' | 'nutritionalBenefits') => {
    setEditedMeal(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (index: number, field: 'instructions' | 'nutritionalBenefits') => {
    setEditedMeal(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await updateMeal(editedMeal)
      if (result.success) {
        toast.success("Meal updated successfully")
        onUpdate(editedMeal)
        onClose()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error updating meal:', error)
      toast.error("Failed to update meal. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollArea className="h-[80vh] pr-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl font-bold text-primary">Edit Meal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Meal Name</Label>
                <Input id="name" name="name" value={editedMeal.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={editedMeal.description} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="mealType">Meal Type</Label>
                <Select name="mealType" value={editedMeal.mealType} onValueChange={(value) => setEditedMeal(prev => ({ ...prev, mealType: value as MealWithIngredients['mealType'] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {editedMeal.ingredients.map((ing, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <Input placeholder="Name" value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} required className="w-full sm:w-1/2" />
                  <Input placeholder="Quantity" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} required className="w-full sm:w-1/4" />
                  <Input placeholder="Unit" value={ing.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} required className="w-full sm:w-1/4" />
                  <Button type="button" onClick={() => removeIngredient(index)} variant="outline" size="icon" className="mt-2 sm:mt-0"><Minus className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" onClick={addIngredient} variant="outline" className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Ingredient
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {editedMeal.instructions.map((instruction, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input value={instruction} onChange={(e) => handleArrayChange(index, 'instructions', e.target.value)} required className="flex-grow" />
                  <Button type="button" onClick={() => removeArrayItem(index, 'instructions')} variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
                </div>
              ))}
              <Button type="button" onClick={() => addArrayItem('instructions')} variant="outline" className="w-full mt-2">
                <Plus className="h-4 w-4 mr-2" /> Add Instruction
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
          <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </ScrollArea>
  )
}
