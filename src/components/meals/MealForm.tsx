'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ingredient, MealWithIngredients, User } from '@/types'
import { Plus, Minus, Save, Wand2, Loader2 } from 'lucide-react'
import { saveMeal, generateMealWithAI } from '@/app/actions/meal-action'
import { toast } from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'

interface MealFormProps {
  user: User;
}

export default function MealForm({ user }: MealFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [meal, setMeal] = useState<Omit<MealWithIngredients, 'id'>>({
    userId: user.id,
    name: '',
    description: '',
    ingredients: [],
    instructions: [],
    nutritionalBenefits: [],
    mealType: 'breakfast',
    servings: 1,
    prepTime: 0,
    cookTime: 0,
    totalTime: 0,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    createdAt: new Date().toISOString(),
  })
  const [aiPrompt, setAiPrompt] = useState('')
  const [servings, setServings] = useState(1)

  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMeal(prev => ({ ...prev, [name]: value }))
  }

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    setMeal(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      )
    }))
  }

  const addIngredient = () => {
    setMeal(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { id: '', meal_id: '', name: '', quantity: '', unit: '' }]
    }))
  }

  const removeIngredient = (index: number) => {
    setMeal(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  const handleArrayChange = (index: number, field: 'instructions' | 'nutritionalBenefits', value: string) => {
    setMeal(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayItem = (field: 'instructions' | 'nutritionalBenefits') => {
    setMeal(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayItem = (index: number, field: 'instructions' | 'nutritionalBenefits') => {
    setMeal(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await saveMeal(meal, user.id)
      if (result.success) {
        toast.success("Meal saved successfully")
        router.push('/dashboard')
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error saving meal:', error)
      toast.error("Failed to save meal. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIGenerate = async () => {
    if (!aiPrompt) {
      toast.error("Please enter a prompt for AI generation.")
      return
    }

    setIsAIGenerating(true)
    try {
      const result = await generateMealWithAI(aiPrompt, servings, user)
      if (result.success && result.meal) {
        setMeal(prev => ({
          ...prev,
          ...result.meal,
          userId: user.id,
          mealType: prev.mealType, // Preserve the selected meal type
        }))
        toast.success("AI-generated meal created! You can now edit and save it.")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error generating meal with AI:', error)
      toast.error("Failed to generate meal with AI. Please try again.")
    } finally {
      setIsAIGenerating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-800">Create a New Meal</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">Meal Name</Label>
                    <Input id="name" name="name" value={meal.name} onChange={handleInputChange} required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="mealType" className="text-sm font-medium text-gray-700">Meal Type</Label>
                    <Select name="mealType" value={meal.mealType} onValueChange={(value) => setMeal(prev => ({ ...prev, mealType: value as MealWithIngredients['mealType'] }))}>
                      <SelectTrigger className="mt-1">
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
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                  <Textarea id="description" name="description" value={meal.description} onChange={handleInputChange} required className="mt-1" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="ai">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Describe the meal you want..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    placeholder="Servings"
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value))}
                    className="w-24"
                    min={1}
                  />
                  <Button
                    type="button"
                    onClick={handleAIGenerate}
                    disabled={isAIGenerating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isAIGenerating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Generate
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Let our AI assistant create a meal based on your description and preferences.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Ingredients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {meal.ingredients.map((ing, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input placeholder="Name" value={ing.name} onChange={(e) => handleIngredientChange(index, 'name', e.target.value)} required />
                <Input placeholder="Quantity" value={ing.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} required className="w-24" />
                <Input placeholder="Unit" value={ing.unit} onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)} required className="w-24" />
                <Button type="button" onClick={() => removeIngredient(index)} variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
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
          <CardTitle className="text-xl font-semibold text-gray-800">Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {meal.instructions.map((instruction, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input value={instruction} onChange={(e) => handleArrayChange(index, 'instructions', e.target.value)} required />
                <Button type="button" onClick={() => removeArrayItem(index, 'instructions')} variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" onClick={() => addArrayItem('instructions')} variant="outline" className="w-full mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Instruction
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Nutritional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="calories" className="text-sm font-medium text-gray-700">Calories</Label>
              <Input id="calories" name="calories" type="number" value={meal.calories} onChange={handleInputChange} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="protein" className="text-sm font-medium text-gray-700">Protein (g)</Label>
              <Input id="protein" name="protein" type="number" value={meal.protein} onChange={handleInputChange} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="carbs" className="text-sm font-medium text-gray-700">Carbs (g)</Label>
              <Input id="carbs" name="carbs" type="number" value={meal.carbs} onChange={handleInputChange} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="fat" className="text-sm font-medium text-gray-700">Fat (g)</Label>
              <Input id="fat" name="fat" type="number" value={meal.fat} onChange={handleInputChange} required className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Preparation Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="prepTime" className="text-sm font-medium text-gray-700">Prep Time (min)</Label>
              <Input id="prepTime" name="prepTime" type="number" value={meal.prepTime} onChange={handleInputChange} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="cookTime" className="text-sm font-medium text-gray-700">Cook Time (min)</Label>
              <Input id="cookTime" name="cookTime" type="number" value={meal.cookTime} onChange={handleInputChange} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="totalTime" className="text-sm font-medium text-gray-700">Total Time (min)</Label>
              <Input id="totalTime" name="totalTime" type="number" value={meal.totalTime} onChange={handleInputChange} required className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Nutritional Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {meal.nutritionalBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input value={benefit} onChange={(e) => handleArrayChange(index, 'nutritionalBenefits', e.target.value)} required />
                <Button type="button" onClick={() => removeArrayItem(index, 'nutritionalBenefits')} variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" onClick={() => addArrayItem('nutritionalBenefits')} variant="outline" className="w-full mt-2">
              <Plus className="h-4 w-4 mr-2" /> Add Benefit
            </Button>

          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        ) : (
          <Save className="h-6 w-6 mr-2" />
        )}
        Save Meal
      </Button>
    </form>
  )
}
