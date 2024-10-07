/*
Developer: Patrick Jakobsen
Date: 07-10-2024
Description: onboarding page for MealHub, where users can set their preferences.
*/

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'

const dietTypes = [
  { id: "omnivore", label: "Omnivore" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "pescatarian", label: "Pescatarian" },
  { id: "keto", label: "Keto" },
  { id: "paleo", label: "Paleo" },
]

const commonAllergies = [
  { id: "dairy", label: "Dairy" },
  { id: "eggs", label: "Eggs" },
  { id: "peanuts", label: "Peanuts" },
  { id: "tree-nuts", label: "Tree Nuts" },
  { id: "soy", label: "Soy" },
  { id: "wheat", label: "Wheat" },
  { id: "fish", label: "Fish" },
  { id: "shellfish", label: "Shellfish" },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [dietType, setDietType] = useState("")
  const [allergies, setAllergies] = useState<string[]>([])
  const [otherAllergies, setOtherAllergies] = useState("")
  const [cookingExperience, setCookingExperience] = useState("")
  const [mealPlanningGoals, setMealPlanningGoals] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, updateUserProfile } = useAuth()

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      setIsLoading(true)
      try {
        if (!user) {
          throw new Error("User not authenticated")
        }
        await updateUserProfile(
          user.name,
          dietType,
          [...allergies, ...otherAllergies.split(',').map(a => a.trim())],
          cookingExperience,
          mealPlanningGoals
        )
        toast.success('Onboarding complete! Your preferences have been saved.')
        router.push("/dashboard")
      } catch (error) {
        console.error("Onboarding failed", error)
        toast.error('Oops! There was an error saving your preferences. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4 py-12 sm:px-6 lg:px-8">
      <Toaster position="top-center" reverseOrder={false} />
      <Card className="w-full max-w-lg bg-white/80 backdrop-blur-sm shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-gray-900">Welcome to MealHub</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Let&apos;s get to know you better to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What type of diet do you follow?</h3>
              <RadioGroup value={dietType} onValueChange={setDietType}>
                {dietTypes.map((diet) => (
                  <div key={diet.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={diet.id} id={diet.id} />
                    <Label htmlFor={diet.id}>{diet.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Do you have any food allergies?</h3>
              {commonAllergies.map((allergy) => (
                <div key={allergy.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={allergy.id}
                    checked={allergies.includes(allergy.id)}
                    onCheckedChange={(checked) => {
                      setAllergies(
                        checked
                          ? [...allergies, allergy.id]
                          : allergies.filter((a) => a !== allergy.id)
                      )
                    }}
                  />
                  <Label htmlFor={allergy.id}>{allergy.label}</Label>
                </div>
              ))}
              <div>
                <Label htmlFor="other-allergies">Other allergies:</Label>
                <Input
                  id="other-allergies"
                  placeholder="Enter any other allergies, separated by commas"
                  value={otherAllergies}
                  onChange={(e) => setOtherAllergies(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What&apos;s your cooking experience level?</h3>
              <RadioGroup value={cookingExperience} onValueChange={setCookingExperience}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beginner" id="beginner" />
                  <Label htmlFor="beginner">Beginner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediate" id="intermediate" />
                  <Label htmlFor="intermediate">Intermediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advanced" id="advanced" />
                  <Label htmlFor="advanced">Advanced</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What are your meal planning goals?</h3>
              <Textarea
                placeholder="e.g., Save time, eat healthier, learn new recipes..."
                value={mealPlanningGoals}
                onChange={(e) => setMealPlanningGoals(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleBack} disabled={step === 1} variant="outline">
            Back
          </Button>
          <Button onClick={handleNext} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : step === 4 ? (
              "Finish"
            ) : (
              "Next"
            )}
          </Button>
        </CardFooter>
        <div className="px-6 pb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </Card>
    </div>
  )
}
