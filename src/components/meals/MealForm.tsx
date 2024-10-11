'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Ingredient, MealWithIngredients, User } from '@/types'
import { Plus, Minus, Save, Wand2, Loader2 } from 'lucide-react'
import { saveMeal, generateMealWithAI, updateMeal } from '@/app/actions/meal-action'
import { toast } from 'react-hot-toast'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// Props interface for the MealForm component
interface MealFormProps {
  user: User;
  initialMeal?: MealWithIngredients;
  onClose?: () => void;
  onUpdate?: (meal: MealWithIngredients) => void;
}

// Array of ingredient categories
const ingredientCategories = [
  "Produce", "Dairy", "Meat", "Seafood", "Bakery", "Pantry", "Frozen", "Beverages", "Spices", "Other"
]

// Type guard to check if an object is of type MealWithIngredients
function isMealWithIngredients(meal: any): meal is MealWithIngredients {
  return (
    meal &&
    typeof meal === 'object' &&
    'id' in meal &&
    'userId' in meal &&
    'name' in meal &&
    'ingredients' in meal &&
    Array.isArray(meal.ingredients)
  )
}

// MealForm component: Renders a form for creating or editing meals
export default function MealForm({ user, initialMeal, onClose, onUpdate }: MealFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [meal, setMeal] = useState<MealWithIngredients>({
    id: initialMeal?.id ?? '',
    userId: user.id,
    name: initialMeal?.name ?? '',
    description: initialMeal?.description ?? '',
    ingredients: initialMeal?.ingredients ?? [],
    instructions: initialMeal?.instructions ?? [],
    nutritionalBenefits: initialMeal?.nutritionalBenefits ?? [],
    mealType: initialMeal?.mealType ?? 'breakfast',
    servings: initialMeal?.servings ?? 1,
    prepTime: initialMeal?.prepTime ?? 0,
    cookTime: initialMeal?.cookTime ?? 0,
    totalTime: initialMeal?.totalTime ?? 0,
    calories: initialMeal?.calories ?? 0,
    protein: initialMeal?.protein ?? 0,
    carbs: initialMeal?.carbs ?? 0,
    fat: initialMeal?.fat ?? 0,
    createdAt: initialMeal?.createdAt ?? new Date().toISOString(),
  })
  const [aiPrompt, setAiPrompt] = useState('')
  const [servings, setServings] = useState(initialMeal?.servings ?? 1)

  const router = useRouter()

  // Handle changes in input fields
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMeal(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'description' ? value : Number(value)
    }))
  }

  // Handle changes in ingredient fields
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    setMeal(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) =>
        i === index ? { ...ing, [field]: value } : ing
      )
    }))
  }

  // Add a new ingredient to the meal
  const addIngredient = () => {
    setMeal(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { id: '', meal_id: '', name: '', quantity: '', unit: '', category: 'Other' }]
    }))
  }

  // Remove an ingredient from the meal
  const removeIngredient = (index: number) => {
    setMeal(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }))
  }

  // Handle changes in array fields (instructions and nutritionalBenefits)
  const handleArrayChange = (index: number, field: 'instructions' | 'nutritionalBenefits', value: string) => {
    setMeal(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  // Add a new item to an array field
  const addArrayItem = (field: 'instructions' | 'nutritionalBenefits') => {
    setMeal(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  // Remove an item from an array field
  const removeArrayItem = (index: number, field: 'instructions' | 'nutritionalBenefits') => {
    setMeal(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (initialMeal) {
        const result = await updateMeal(meal)
        if (result.success && result.meal) {
          toast.success("Meal updated successfully")
          if (onUpdate && isMealWithIngredients(result.meal)) {
            onUpdate(result.meal)
          }
          onClose && onClose()
        } else {
          throw new Error(result.error || "Failed to update meal")
        }
      } else {
        const result = await saveMeal(meal, user.id)
        if (result.success && result.meal) {
          toast.success("Meal saved successfully")
          router.push('/dashboard/meal')
        } else {
          throw new Error(result.error || "Failed to save meal")
        }
      }
    } catch (error) {
      console.error('Error saving meal:', error)
      toast.error("Failed to save meal. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle AI-assisted meal generation
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
          mealType: prev.mealType,
        }))
        toast.success("AI-generated meal created! You can now edit and save it.")
      } else {
        throw new Error(result.error || "Failed to generate meal with AI")
      }
    } catch (error) {
      console.error('Error generating meal with AI:', error)
      toast.error("Failed to generate meal with AI. Please try again.")
    } finally {
      setIsAIGenerating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="border-none shadow-none bg-transparent rounded-lg overflow-hidden">
        <CardContent className="p-6">
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="ai">AI Assistant</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Let Mealbuddy Light make you a meal with its AI-powered meal generation. Describe the meal you want, and Mealbuddy will create a recipe for you.
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <AnimatePresence>
            <motion.div
              key="meal-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                  <div className="space-y-2">
                    {meal.ingredients.map((ing, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center space-x-2"
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
                    <Button type="button" onClick={addIngredient} variant="outline" className="w-full mt-2">
                      <Plus className="h-4 w-4 mr-2" /> Add Ingredient
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg  font-semibold mb-2">Instructions</h3>
                  <div className="space-y-2">
                    {meal.instructions.map((instruction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center space-x-2"
                      >
                        <Input value={instruction} onChange={(e) => handleArrayChange(index, 'instructions', e.target.value)} required />
                        <Button type="button" onClick={() => removeArrayItem(index, 'instructions')} variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
                      </motion.div>
                    ))}
                    <Button type="button" onClick={() => addArrayItem('instructions')} variant="outline" className="w-full mt-2">
                      <Plus className="h-4 w-4 mr-2" /> Add Instruction
                    </Button>
                  </div>
                </div>

                <div>

                  <h3 className="text-lg font-semibold mb-2">Nutritional Information</h3>
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
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Preparation Time</h3>
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
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Nutritional Benefits</h3>
                  <div className="space-y-2">
                    {meal.nutritionalBenefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center space-x-2"
                      >
                        <Input value={benefit} onChange={(e) => handleArrayChange(index, 'nutritionalBenefits', e.target.value)} required />
                        <Button type="button" onClick={() => removeArrayItem(index, 'nutritionalBenefits')} variant="outline" size="icon"><Minus className="h-4 w-4" /></Button>
                      </motion.div>
                    ))}
                    <Button type="button" onClick={() => addArrayItem('nutritionalBenefits')} variant="outline" className="w-full mt-2">
                      <Plus className="h-4 w-4 mr-2" /> Add Benefit
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white text-lg py-3 rounded-lg shadow-md transition-all duration-300" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <Save className="h-6 w-6 mr-2" />
              )}
              {initialMeal ? 'Update Meal' : 'Save Meal'}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </form>
  )
}

/*
Developer: Patrick Jakobsen
Date: 10-10-2024
*/
