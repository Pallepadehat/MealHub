'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ingredient, MealWithIngredients } from '@/types'
import { updateMeal } from '@/app/actions/meal-action'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, Save, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EditMealFormProps {
  meal: MealWithIngredients;
  onClose: () => void;
  onUpdate: (updatedMeal: MealWithIngredients) => void;
}

const ingredientCategories = [
  "Produce", "Dairy", "Meat", "Seafood", "Bakery", "Pantry", "Frozen", "Beverages", "Spices", "Other"
]

export default function EditMealForm({ meal, onClose, onUpdate }: EditMealFormProps) {
  const [editedMeal, setEditedMeal] = useState<MealWithIngredients>(meal)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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
      ingredients: [...prev.ingredients, { id: '', meal_id: prev.id, name: '', quantity: '', unit: '', category: 'Other' }]
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Edit Meal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="servings">Servings</Label>
                  <Input id="servings" name="servings" type="number" value={editedMeal.servings} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                  <Input id="prepTime" name="prepTime" type="number" value={editedMeal.prepTime} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                  <Input id="cookTime" name="cookTime" type="number" value={editedMeal.cookTime} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="totalTime">Total Time (minutes)</Label>
                  <Input id="totalTime" name="totalTime" type="number" value={editedMeal.totalTime} onChange={handleInputChange} required />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ingredients">
              <div className="space-y-4">
                <Label>Ingredients</Label>
                <AnimatePresence>
                  {editedMeal.ingredients.map((ing, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <Input placeholder="Name" value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} required />
                      <Input placeholder="Quantity" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} required className="w-24" />
                      <Input placeholder="Unit" value={ing.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} required className="w-24" />
                      <Select value={ing.category} onValueChange={(value) => handleIngredientChange(index, 'category', value)}>
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          {ingredientCategories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" onClick={() => removeIngredient(index)} variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button type="button" onClick={addIngredient} variant="outline" className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-2" /> Add Ingredient
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="instructions">
              <div className="space-y-4">
                <Label>Instructions</Label>
                <AnimatePresence>
                  {editedMeal.instructions.map((instruction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <Input value={instruction} onChange={(e) => handleArrayChange(index, 'instructions', e.target.value)} required />
                      <Button type="button" onClick={() => removeArrayItem(index, 'instructions')} variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button type="button" onClick={() => addArrayItem('instructions')} variant="outline" className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-2" /> Add Instruction
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="nutrition" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input id="calories" name="calories" type="number" value={editedMeal.calories} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input id="protein" name="protein" type="number" value={editedMeal.protein} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input id="carbs" name="carbs" type="number" value={editedMeal.carbs} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input id="fat" name="fat" type="number" value={editedMeal.fat} onChange={handleInputChange} required />
                </div>
              </div>
              <div>
                <Label>Nutritional Benefits</Label>
                <AnimatePresence>
                  {editedMeal.nutritionalBenefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center space-x-2 mt-2"
                    >
                      <Input value={benefit} onChange={(e) => handleArrayChange(index, 'nutritionalBenefits', e.target.value)} required />
                      <Button type="button" onClick={() => removeArrayItem(index, 'nutritionalBenefits')} variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <Button type="button" onClick={() => addArrayItem('nutritionalBenefits')} variant="outline" className="w-full mt-2">
                  <Plus className="h-4 w-4 mr-2" /> Add Benefit
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Update Meal
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
